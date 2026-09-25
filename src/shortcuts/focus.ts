import updatePager from "../utils/updatePager";

export const focusLeft = () => {
  const columns = workspace.__globals.getColumnsSortedByXPos();

  const columnResponse = workspace.__globals.getColumnWithActiveWindow();
  if (!columnResponse) return;

  const [activeColumn, index] = columnResponse;

  let newActiveWindow;

  const maxWidth = workspace.__globals.getTotalWidth();

  //Logic for the first column has different conditions
  if (index === 0 && activeColumn.windows[0].active) {
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
      //First check if col will go offscreen. If it will, don't scroll.
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

export const focusRight = () => {
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
