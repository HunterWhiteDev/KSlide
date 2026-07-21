import Column from "./Column";
import updatePager from "./utils/updatePager";

export const initShortcuts = () => {
  const focusLeft = () => {
    const columns = workspace.__globals.getColumnsSortedByXPos();

    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;

    const [activeColumn, index] = columnResponse;

    let newActiveWindow;

    const maxWidth = workspace.__globals.getTotalWidth();

    //Logic for the first column has different conditions
    if (index === 0) {
      if (!activeColumn.windows[0].active) {
        //Last window is not focused, so one must be focused
        let idx = 0;
        for (const window of activeColumn.windows) {
          if (window.active) {
            newActiveWindow = activeColumn.windows[idx - 1];
            break;
          }
        }
      } else {
        //First window is focused, we only need to scroll
        //First check if window will go offscreen. If it will, don't scroll.
        //

        if (
          activeColumn.xPosStart +
          activeColumn.width +
          workspace.__globals.padding >
          maxWidth
        )
          return;

        for (const col of columns) {
          col.setXPos(col.xPosStart + activeColumn.width);
        }
      }
    } else {
      if (activeColumn.windows[0].active) {
        const newColumn = columns[index - 1];
        newActiveWindow = newColumn.windows[newColumn.windows.length - 1];
      } else {
        let idx = 0;
        for (const window of activeColumn.windows) {
          if (window.active) {
            newActiveWindow = activeColumn.windows[idx - 1];
            break;
          }
          idx++;
        }
      }

      //Scrolling will be handled windowActivatedSignal
      workspace.activeWindow = newActiveWindow as KWin.AbstractClient;
    }

    updatePager();
  };

  const focusRight = () => {
    workspace.__globals.autoFocus = false;
    const columns = workspace.__globals.getColumnsSortedByXPos();

    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;

    const [activeColumn, index] = columnResponse;

    let newActiveWindow;

    //Logic for the last column has different conditions
    if (
      index === columns.length - 1 &&
      activeColumn.windows[activeColumn.windows.length - 1].active
    ) {
      if (!activeColumn.windows[activeColumn.windows.length - 1].active) {
        //Last window is not focused, so one must be focused
        let idx = 0;
        for (const window of activeColumn.windows) {
          if (window.active) {
            newActiveWindow = activeColumn.windows[idx + 1];
            break;
          }
        }
      } else {
        //Last window is focused, we only need to scroll
        //First check if window will go offscreen. If it will, don't scroll.
        if (activeColumn.xPosStart - activeColumn.width < 0) return;

        for (const col of columns) {
          col.setXPos(col.xPosStart - activeColumn.width);
        }
      }
    } else {
      if (activeColumn.windows[activeColumn.windows.length - 1].active) {
        const newColumn = columns[index + 1];
        newActiveWindow = newColumn.windows[0];
      } else {
        let idx = 0;
        for (const window of activeColumn.windows) {
          if (window.active) {
            newActiveWindow = activeColumn.windows[idx + 1];
            break;
          }
          idx++;
        }
      }

      //Scrolling will be handled windowActivatedSignal
      workspace.activeWindow = newActiveWindow as KWin.AbstractClient;
    }

    updatePager();
  };

  const shiftViewLeft = () => {
    const columns = workspace.__globals.getColumnsSortedByXPos();
    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;

    const [activeColumn, index] = columnResponse;
    if (index === 0) return;
    const columnToScroll = columns[index - 1];

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      const newXPos = column.xPosStart + columnToScroll.width;
      column.setXPos(newXPos);
    }
  };
  const shiftViewRight = () => {
    const columns = workspace.__globals.getColumnsSortedByXPos();
    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;

    const [activeColumn, index] = columnResponse;
    if (index === columns.length - 1) return;
    const columnToScroll = columns[index + 1];

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      const newXPos = column.xPosStart - columnToScroll.width;
      column.setXPos(newXPos);
    }
  };

  //This function does 2 things
  //1) Make a Column take up the max amount of space it possibly
  //2) Makes every other column grow or shrink depending on what size columns to the left or right need to change by
  const maxSpace = () => {
    try {
      const columns = workspace.__globals.getColumnsSortedByXPos();
      const columnResponse = workspace.__globals.getColumnWithActiveWindow();

      if (!columnResponse) return print("No column found");

      const [activeColumn, index] = columnResponse;

      const oldXPosStart = activeColumn.xPosStart;
      const oldXPosEnd = activeColumn.getXPosEnd();

      activeColumn.maximize();

      const newXPostStart = activeColumn.xPosStart;
      const newXposEnd = activeColumn.getXPosEnd();

      const leftDifference = newXPostStart - oldXPosStart;
      const rightDifference = newXposEnd - oldXPosEnd;

      for (let i = 0; i < columns.length; i++) {
        if (i === index) continue;

        const column: Column = columns[i];

        if (i < index) {
          column.setXPos(column.xPosStart + leftDifference);
        } else if (i > index) {
          column.setXPos(column.xPosStart + rightDifference);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const swapLeft = () => {
    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    const columns = workspace.__globals.getColumnsSortedByXPos();
    if (!columnResponse) return;
    const [column, index] = columnResponse;

    if (index === 0) return;

    const swapColumn = columns[index - 1];
    column.setXPos(swapColumn.xPosStart);
    swapColumn.setXPos(column.getXPosEnd());

    if (column.getXPosEnd() < 0 + workspace.__globals.padding) {
      const difference = Math.abs(column.xPosStart - 0);
      for (const column of columns) {
        column.setXPos(column.xPosStart + difference);
      }
    }
  };

  const swapRight = () => {
    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    const columns = workspace.__globals.getColumnsSortedByXPos();
    if (!columnResponse) return;

    const [column, index] = columnResponse;

    if (index === columns.length - 1) return;

    const swapColumn = columns[index + 1];
    swapColumn.setXPos(column.xPosStart);
    column.setXPos(swapColumn.getXPosEnd());

    const maxWidth = workspace.__globals.getTotalWidth();
    if (column.getXPosEnd() > maxWidth) {
      const difference = Math.abs(column.getXPosEnd() - maxWidth);
      for (const column of columns) {
        column.setXPos(column.xPosStart - difference);
      }
    }
  };

  const increaseWidth = () => {
    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;
    const [column, index] = columnResponse;
    column.setWidth(column.width + 75);
  };
  const decreaseWidth = () => {
    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;
    const [column, index] = columnResponse;
    column.setWidth(column.width - 75);
  };

  //TODO: This function and focus right work fine. Focus left needs to be adjusted, and focus move toRightColumn need to be completed
  //This function needs to do this:
  //If the active window in in a column as at index 0, it needs to create a new column, and maximize itself and adjust the column it came from
  //If it is the only window in the column, it needs to delete the current one, move it to the left, and size both accordingly. Maximize the one it was moved to and readjust the size of the one it came from
  //If it is *not*  the only window, it needs to be moved to the column to the left, and resize both accordingly
  const moveToLeftColumn = () => {
    const columns = workspace.__globals.getColumnsSortedByXPos();
    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;

    let leftColumn;
    let leftColIdx;
    let currentColIdx;
    let windowToMove;

    const [activeColumn, index] = columnResponse;
    leftColIdx = index - 1;
    leftColumn = columns[leftColIdx];
    currentColIdx = index;

    for (const window of activeColumn.windows) {
      if (window.active) windowToMove = window;
    }

    if (!windowToMove || !activeColumn || !currentColIdx || !leftColumn)
      return print(
        "moveToLeftReturned Early ",
        JSON.stringify({
          windowToMove,
          activeColumn,
          currentColIdx,
          leftColumn,
        }),
      );

    let skipColumnIndex = -1;

    print(JSON.stringify({ currentColIdx, leftColIdx }));

    //Intiial column has no windows left, Delete it and move the window over
    if (currentColIdx === 0) {
      const newCol = new Column(
        windowToMove,
        workspace.__globals.padding,
        activeColumn.xPosStart - activeColumn.width,
      );
      newCol.maximize();
      activeColumn.deleteWindow(windowToMove);
      if (activeColumn.windows.length === 0) {
        skipColumnIndex = currentColIdx;
      }
    } else {
      //2 things can be true here: The current column may either have some windows or no windows after we remove the current one. We will handle both here
      activeColumn.deleteWindow(windowToMove);
      if (activeColumn.windows.length === 0) {
        //Delete this column and move over window
        leftColumn.addWindow(windowToMove);
        skipColumnIndex = currentColIdx;
        print("win length should be 0");
      } else {
        //Just move over the window and size both
        leftColumn.addWindow(windowToMove);
      }
    }

    const newColumns = [];
    let scrollDifference = activeColumn.width;
    for (let i = 0; i < columns.length; i++) {
      //Skip column if it needs to be deleted
      if (i === skipColumnIndex) continue;
      const column = columns[i];
      if (i > skipColumnIndex)
        column.setXPos(column.xPosStart - scrollDifference);

      newColumns.push(column);
    }

    workspace.__globals.grid.columns = newColumns;
    print("fin");
  };
  const moveToRightColumn = () => { };

  registerShortcut(
    "Move current window to the left column",
    "",
    "Meta+H",
    moveToLeftColumn,
  );

  registerShortcut("Increase Width", "", "Meta+E", increaseWidth);
  registerShortcut("Decrease Width", "", "Meta+W", decreaseWidth);

  registerShortcut(
    "Focus left",
    "Focuses the next window to the left",
    "Meta+A",
    focusLeft,
  );

  registerShortcut(
    "Focus right",
    "Focuses the next window to the right",
    "Meta+D",
    focusRight,
  );
  registerShortcut(
    "Take up max space",
    "Makes the active column take up the maximum amount of space possible. This is normally your available space minus your padding",
    "Meta+M",
    maxSpace,
  );

  registerShortcut(
    "Swap The Current Column with its Column to the left",
    "",
    "Meta+Ctrl+A",
    swapLeft,
  );

  registerShortcut(
    "Swap The Current Column with its Column to the right",
    "",
    "Meta+Ctrl+D",
    swapRight,
  );

  registerShortcut(
    "Scroll Viewport Left",
    "Scrolls the view port by the width of the column to the left without focusing the column",
    "Meta+Shift+A",
    shiftViewLeft,
  );

  registerShortcut(
    "Scroll Viewport Right",
    "Scrolls the view port by the width of the column to the right without focusing the column",
    "Meta+Shift+D",
    shiftViewRight,
  );
};
