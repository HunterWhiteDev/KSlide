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
      if (activeColumn.windows.length === 1) {
        const newColumn = columns[index - 1];
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

  const focusRight = () => {
    workspace.__globals.autoFocus = false;
    const columns = workspace.__globals.getColumnsSortedByXPos();

    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;

    const [activeColumn, index] = columnResponse;

    let newActiveWindow;

    //Logic for the last column has different conditions
    if (index === columns.length - 1) {
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
      if (activeColumn.windows.length === 1) {
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
