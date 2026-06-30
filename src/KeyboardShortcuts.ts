export const initShortcuts = () => {
  const padding = workspace.__globals.padding;
  const focusLeft = () => {
    const columns = workspace.__globals.getColumnsSortedByXPos();

    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;
    const [activeColumn, index] = columnResponse;

    const newActiveColumn = columns[index - 1];
    const newActiveWindow = newActiveColumn.windows[0];
    if (!newActiveWindow) return;

    workspace.activeWindow = newActiveWindow;

    const scrollOffset = Math.abs(
      activeColumn.xPosStart - newActiveColumn.xPosStart,
    );

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      //Find the difference first, THEN, add that to the currentXPos of the currnet column we iterate over

      const newXPos = column.xPosStart + scrollOffset;

      column.setXPos(newXPos);
    }
  };

  const focusRight = () => {
    const columns = workspace.__globals.getColumnsSortedByXPos();

    const columnResponse = workspace.__globals.getColumnWithActiveWindow();
    if (!columnResponse) return;
    const [activeColumn, index] = columnResponse;
    const newActiveColumn = columns[index + 1];
    const newActiveWindow = newActiveColumn.windows[0];
    if (!newActiveWindow) return;

    workspace.activeWindow = newActiveWindow;

    const scrollOffset = Math.abs(
      newActiveColumn.xPosStart - activeColumn.xPosStart,
    );
    print(scrollOffset);

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      const newXPos = column.xPosStart - scrollOffset;
      column.setXPos(newXPos);
    }
  };

  const maxSpace = () => {
    try {
      const columnResponse = workspace.__globals.getColumnWithActiveWindow();

      if (!columnResponse) return print("No column found");

      const [activeColumn, index] = columnResponse;

      const oldWidth = activeColumn.width;
      const newWidth = activeColumn.maximize();
      if (typeof newWidth !== "number")
        return print("KS: NewXPos was not a number (returned null)");

      //If the difference is positive, X increased (moved right), if the difference is neegative, the X positioned decreased (moved left)
      const didGrow = Math.sign(newWidth - newWidth);

      const difference = Math.abs(oldWidth - newWidth);
      for (let i = 0; i < grid.columns.length; i++) {
        if (i === index) continue;
        let column = grid.columns[i];

        if (didGrow) {
          column.setXPos(column.xPosStart + difference + padding);
        } else {
          column.setXPos(column.xPosStart - difference + padding);
        }
      }
    } catch (error) {
      console.log(error);
    }
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
};
