import Column from "./Column";

export const initShortcuts = () => {
  const grid = workspace.__globals.grid;

  const focusLeft = () => {
    const columns = workspace.__globals.getColumnsSortedByXPos();

    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;
    const [activeColumn, index] = columnResponse;

    let newActiveColumn;
    let newActiveWindow;

    let willScrollFirstItem = false;

    let scrollOffset = 0;
    if (index === 0) {
      //Total horizontal space
      let maxWidth = 0;
      for (const output of workspace.screens) {
        maxWidth += output.geometry.x;
      }

      //On my machine, it was let me scroll over one window width worth out of view. So it made conceptual sense to substract the columnWidth.
      const distanceLeftToScroll =
        maxWidth - activeColumn.xPosStart - activeColumn.width;

      if (distanceLeftToScroll >= activeColumn.width) {
        scrollOffset = activeColumn.width;
      }

      willScrollFirstItem = true;
    } else {
      newActiveColumn = columns[index - 1];
      newActiveWindow = newActiveColumn.windows[0];
      scrollOffset = Math.abs(
        activeColumn.xPosStart - newActiveColumn.xPosStart,
      );

      workspace.activeWindow = newActiveWindow;
    }

    if (newActiveColumn?.xPosStart < 0 || willScrollFirstItem) {
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        //Find the difference first, THEN, add that to the currentXPos of the currnet column we iterate over

        const newXPos = column.xPosStart + scrollOffset;

        column.setXPos(newXPos);
      }
    }
  };

  const focusRight = () => {
    const columns = workspace.__globals.getColumnsSortedByXPos();

    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;
    const [activeColumn, index] = columnResponse;

    let newActiveColumn;
    let newActiveWindow;

    let willScrollLastItem = false;

    let scrollOffset = 0;
    if (index === columns.length - 1) {
      if (activeColumn.xPosStart >= activeColumn.width) {
        scrollOffset = activeColumn.width;
      }
      willScrollLastItem = true;
    } else {
      newActiveColumn = columns[index + 1];
      newActiveWindow = newActiveColumn.windows[0];
      scrollOffset = Math.abs(
        newActiveColumn.xPosStart - activeColumn.xPosStart,
      );

      workspace.activeWindow = newActiveWindow;
    }

    let maxWidth = 0;
    for (const output of workspace.screens) {
      maxWidth += output.geometry.x;
    }

    if (newActiveColumn?.getXPosEnd() > maxWidth || willScrollLastItem) {
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];

        const newXPos = column.xPosStart - scrollOffset;
        column.setXPos(newXPos);
      }
    }
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

      for (let i = 0; i < grid.columns.length; i++) {
        if (i === index) continue;

        const column: Column = grid.columns[i];

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
  };

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
