import updatePager from "../utils/updatePager";

export const swapLeft = () => {
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
  updatePager();
};

export const swapRight = () => {
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
  updatePager();
};
