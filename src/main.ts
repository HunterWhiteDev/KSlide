import Column from "./Column";
import Grid from "./Grid";
import { initShortcuts } from "./KeyboardShortcuts";

const grid = new Grid();
const padding = 8;

const exlcludeList = ["org.kde.plasmashell", "krunner"];

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
};

print("GLOBALS:  ", workspace.__globals);

const main = () => {
  const stackingOrder = workspace.stackingOrder;
  let prevWindowXPos: number = 0;
  for (let i = stackingOrder.length - 1; i >= 0; i--) {
    const window = stackingOrder[i];

    if (window.resourceName === "plasmashell") continue;

    let newXPos;
    if (window.active) {
      const activeScreen = workspace.activeScreen;
      newXPos = activeScreen.geometry.x;
    } else {
      newXPos = prevWindowXPos - window.width;
    }

    window.minimized = false;
    window.frameGeometry = {
      x: newXPos,
      y: window.y,
      width: window.width,
      height: window.height,
    };

    prevWindowXPos = newXPos;

    const column = new Column(window, padding);

    grid.columns.push(column);
  }

  initShortcuts();
};
main();

//TODO: Make this function add the new column of the last column's width + padding
const addWindow = (newWindow: KWin.AbstractClient) => {
  if (exlcludeList.includes(newWindow.resourceClass)) return;
  const columns = workspace.__globals.getColumnsSortedByXPos();
  const lastColumn = columns[columns.length - 1];

  const newWindowXPos = lastColumn.getXPosEnd();

  newWindow.frameGeometry = {
    width: newWindow.width,
    height: newWindow.height,
    x: newWindowXPos,
    y: newWindow.y,
  };

  grid.columns.push(new Column(newWindow, padding));
};

const removeWindow = (removedWindow: KWin.AbstractClient) => {
  if (exlcludeList.includes(removedWindow.resourceClass)) return;

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
      print("KS: ", col.windows.length);
    }

    let windowToFocus;
    if (index === 0) {
      windowToFocus = columns[index + 1].windows[0];
    } else {
      windowToFocus = columns[index - 1].windows[0];
    }

    workspace.activeWindow = windowToFocus;
    print("KS: RAN");
  } else {
    //This will probably need to be more programtically smart in the future
    workspace.activeWindow = column.windows[windows.length - 1];
  }
};

workspace.windowAdded.connect(addWindow);
workspace.windowRemoved.connect(removeWindow);

print("done");
