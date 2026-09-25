export const increaseWidth = () => {
  const columnResponse = workspace.__globals.getColumnWithActiveWindow();
  if (!columnResponse) return;
  const [column] = columnResponse;
  column.setWidth(column.width + 75);
};
export const decreaseWidth = () => {
  const columnResponse = workspace.__globals.getColumnWithActiveWindow();
  if (!columnResponse) return;
  const [column] = columnResponse;
  column.setWidth(column.width - 75);
};
