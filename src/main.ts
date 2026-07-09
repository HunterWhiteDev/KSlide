import Column from "./Column";
import maxArea from "./utils/maxArea";
import Grid from "./Grid";
import { initShortcuts } from "./KeyboardShortcuts";
import updatePager from "./utils/updatePager";

const grid = new Grid();
const padding = 8;

const exlcludeList = [
  "org.kde.plasmashell",
  "krunner",
  "org.kde.spectacle",
  "plasmashell",
  "",
];

function getColumnsSortedByXPos(): Column[] {
  return workspace.__globals.grid.columns.sort((a, b) => {
    if (a.xPosStart < b.xPosStart) return -1;
    else if (a.xPosStart === b.xPosStart) return 0;
    else return 1;
  });
}

function getColumnWithActiveWindow(): [Column, number] | null {
  const columns = getColumnsSortedByXPos();
  let counter = 0;
  for (const column of columns) {
    for (const window of column.windows) {
      if (window.active) return [column, counter];
    }
    counter++;
  }
  return null;
}

workspace["__globals"] = {
  getColumnWithActiveWindow,
  getColumnsSortedByXPos,
  padding,
  grid,
  autoFocus: true,
};

const main = () => {
  const leastMaxArea = maxArea();
  const stackingOrder = workspace.stackingOrder;
  let prevWindowXPos: number = 0;
  for (let i = stackingOrder.length - 1; i >= 0; i--) {
    const window = stackingOrder[i];
    if (exlcludeList.includes(window.resourceName)) continue;
    if (window.skipSwitcher) continue;
    if (!window.normalWindow) continue;

    print("KS: ", window.resourceName);

    let newXPos;
    if (window.active) {
      const activeScreen = workspace.activeScreen;
      newXPos = activeScreen.geometry.x;
    } else {
      newXPos = prevWindowXPos - leastMaxArea.width;
    }

    window.minimized = false;

    prevWindowXPos = newXPos;

    const column = new Column(window, padding, newXPos);

    grid.columns.push(column);
  }

  updatePager();
  initShortcuts();
};
main();

//TODO: Make this function add the new column of the last column's width + padding
const addWindow = (newWindow: KWin.AbstractClient) => {
  if (exlcludeList.includes(newWindow.resourceName)) return;
  if (!newWindow.normalWindow) return;
  if (newWindow.skipSwitcher) return;

  print("INFO");
  print(JSON.stringify(newWindow));
  print(
    newWindow.resourceName,
    " ",
    newWindow.resourceClass,
    " ",
    newWindow.caption,
  );
  print("INFO");

  const columns = workspace.__globals.getColumnsSortedByXPos();
  const lastColumn = columns[columns.length - 1];

  const newWindowXPos = lastColumn.getXPosEnd();

  grid.columns.push(new Column(newWindow, padding, newWindowXPos));
};

const removeWindow = (removedWindow: KWin.AbstractClient) => {
  if (exlcludeList.includes(removedWindow.resourceClass)) return;

  //Just make sure it's a normal window that did get added
  let foundInList = false;
  for (const col of grid.columns) {
    for (const win of col.windows) {
      if (removedWindow.internalId === win.internalId) foundInList = true;
    }
  }

  if (!foundInList) return;

  //Might have to manually filter where this was in the grid (hopefully not)
  const columnResponse = getColumnWithActiveWindow();
  if (!columnResponse) return;
  const [column, index] = columnResponse;

  const columns = getColumnsSortedByXPos();
  //First remove the window from the column
  const windows = columns[index].windows;

  const newWindows: KWin.AbstractClient[] = [];
  for (const window of windows) {
    if (window.internalId !== removedWindow.internalId) {
      newWindows.push(window);
    }
  }

  column.windows = newWindows;

  if (column.windows.length === 0) {
    const newGridArrayFirstHalf = columns.slice(0, index);

    const newGridArrayEndHalf = columns.slice(index + 1, columns.length);

    for (let i = index; i < columns.length; i++) {
      const currentColumn = columns[i];
      currentColumn.setXPos(currentColumn.xPosStart - column.width);
    }

    grid.columns = [...newGridArrayFirstHalf, ...newGridArrayEndHalf];
    for (const col of grid.columns) {
    }

    let windowToFocus;
    if (index === 0) {
      windowToFocus = columns[index + 1].windows[0];
    } else {
      windowToFocus = columns[index - 1].windows[0];
    }

    workspace.activeWindow = windowToFocus;
  } else {
    //This will probably need to be more programtically smart in the future
    workspace.activeWindow = column.windows[windows.length - 1];
  }
};

const windowActivated = (window: KWin.AbstractClient) => {
  if (!workspace.__globals.autoFocus) return;
  if (exlcludeList.includes(window.resourceName)) return;
  print("KS: rc: ", window.resourceClass);
  const columnResponse = getColumnWithActiveWindow();
  if (!columnResponse) return;
  const [column] = columnResponse;
  const columns = getColumnsSortedByXPos();
  const screenGeometry = workspace.activeScreen.geometry;

  const difference = screenGeometry.x + padding - column.xPosStart;
  print("KS: ", difference);
  print("KS: ", "FOCUSING");

  if (Math.sign(column.xPosStart) === -1) {
    for (const column of columns) {
      column.setXPos(column.xPosStart + Math.abs(difference));
    }
  } else {
    for (const column of columns) {
      column.setXPos(column.xPosStart - Math.abs(difference));
    }
  }
};

// workspace.windowActivated.connect(windowActivated);
workspace.windowAdded.connect(addWindow);
workspace.windowRemoved.connect(removeWindow);
