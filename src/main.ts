import Column from "./Column";
import Grid from "./Grid";
import { initShortcuts } from "./KeyboardShortcuts";

const grid = new Grid();
const padding = 8;

function getColumnsSortedByXPos(): Column[] {
  return grid.columns.sort((a, b) => {
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
  const lastColumn = grid.columns[grid.columns.length - 1];
  const lastWindow = lastColumn.windows[lastColumn.windows.length - 1];

  const newWindowXPos = lastWindow.x + lastWindow.width + padding;

  newWindow.frameGeometry = {
    width: newWindow.width,
    height: newWindow.height,
    x: newWindowXPos + padding,
    y: newWindow.y,
  };

  grid.columns.push(new Column(newWindow, padding));
};

//TODO: make this function delete column if no windows are left and reposition the ones still left
// const removeWindow = (window: KWin.AbstractClient) => {
//   const columnResponse = getColumnWithActiveWindow();
//
//   if (columnResponse == null) return;
//
//   const [activeColumn, index] = columnResponse;
//
//   const length = activeColumn.deleteWindow(window);
//
//   const newColumns = [];
//
//   if (length === 0) {
//     let count = 0;
//
//     for (const column of grid.columns) {
//       if (count == index) continue;
//       else newColumns.push(column);
//     }
//     count++;
//   }
// };

// workspace.windowAdded.connect(addWindow);
// workspace.windowRemoved.connect(removeWindow);

print("done");
