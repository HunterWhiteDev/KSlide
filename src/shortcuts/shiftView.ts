export const shiftViewLeft = () => {
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
export const shiftViewRight = () => {
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
