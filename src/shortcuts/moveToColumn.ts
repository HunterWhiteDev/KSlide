import Column from "../Column";

export const moveToLeftColumn = () => {
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

  if (!windowToMove) return;
  if (currentColIdx === 0 && activeColumn.windows.length === 1) return;

  //Intiial column has no windows left, Delete it and move the window over
  //I have decided it makes the most sense in terms of code flow that the check for if the currentColumn has no windows left if best in each condition here. In other terms, the if an the else blocks will both have their own logic for handling when the current column now has 0 windows after deleting the current one from it
  //

  if (currentColIdx === 0) {
    const newCol = new Column(
      windowToMove,
      workspace.__globals.padding,
      activeColumn.xPosStart - activeColumn.width,
    );
    activeColumn.deleteWindow(windowToMove);
    if (activeColumn.windows.length === 0) {
      workspace.__globals.removeColumnAtIndex(currentColIdx);
    }
    workspace.__globals.grid.columns.push(newCol);
  } else {
    //2 things can be true here: The current column may either have some windows or no windows after we remove the current one. We will handle both here
    activeColumn.deleteWindow(windowToMove);
    if (activeColumn.windows.length === 0) {
      //Delete this column and move over window
      workspace.__globals.removeColumnAtIndex(currentColIdx);
      leftColumn.addWindow(windowToMove);
    } else {
      //Just move over the window and size both
      leftColumn.addWindow(windowToMove);
      //return so columns don't move
      return;
    }
  }

  if (activeColumn.windows.length) activeColumn.maximize();

  //Now, we rebuild the columns and skip the one the window came from if it is now empty
  const updatedColumns = workspace.__globals.getColumnsSortedByXPos();

  if (currentColIdx === 0) return;
  for (let i = currentColIdx; i < updatedColumns.length; i++) {
    const col = updatedColumns[i];
    col.setXPos(col.xPosStart - activeColumn.width);
  }
};

//This function should always be identical to moveToLeftColumn in concept, but will have adjusted values. moveToLeftColumn has comments for reference.

export const moveToRightColumn = () => {
  const columns = workspace.__globals.getColumnsSortedByXPos();

  const columnResponse = workspace.__globals.getColumnWithActiveWindow();
  if (!columnResponse) return;

  let rightColumn;
  let rightColIdx;
  let currentColIdx;
  let windowToMove;

  const [activeColumn, index] = columnResponse;
  rightColIdx = index + 1;
  rightColumn = columns[rightColIdx];
  currentColIdx = index;

  for (const window of activeColumn.windows) {
    if (window.active) windowToMove = window;
  }

  if (!windowToMove) return;
  if (currentColIdx === columns.length - 1 && activeColumn.windows.length === 1)
    return;

  //Intiial column has no windows left, Delete it and move the window over
  //I have decided it makes the most sense in terms of code flow that the check for if the currentColumn has no windows left if best in each condition here. In other terms, the if an the else blocks will both have their own logic for handling when the current column now has 0 windows after deleting the current one from it
  //

  if (currentColIdx === columns.length - 1) {
    const newCol = new Column(
      windowToMove,
      workspace.__globals.padding,
      activeColumn.xPosStart + activeColumn.width,
    );
    activeColumn.deleteWindow(windowToMove);
    if (activeColumn.windows.length === 0) {
      workspace.__globals.removeColumnAtIndex(currentColIdx);
    }
    workspace.__globals.grid.columns.push(newCol);
  } else {
    //2 things can be true here: The current column may either have some windows or no windows after we remove the current one. We will handle both here
    activeColumn.deleteWindow(windowToMove);
    if (activeColumn.windows.length === 0) {
      //Delete this column and move over window
      workspace.__globals.removeColumnAtIndex(currentColIdx);
      rightColumn.addWindow(windowToMove, 0);
    } else {
      //Just move over the window and size both
      rightColumn.addWindow(windowToMove, 0);
      //Return so columns dont move
      return;
    }
  }

  if (activeColumn.windows.length) activeColumn.maximize();

  //Now, we rebuild the columns and skip the one the window came from if it is now empty
  const updatedColumns = workspace.__globals.getColumnsSortedByXPos();

  if (currentColIdx === updatedColumns.length - 1) return;
  for (let i = currentColIdx - 1; i >= 0; i--) {
    const col = columns[i];
    col.setXPos(col.xPosStart + activeColumn.width);
  }
};
