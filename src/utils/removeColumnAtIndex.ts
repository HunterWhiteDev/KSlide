export default function removeColumnAtIndex(index: number) {
  const columns = workspace.__globals.getColumnsSortedByXPos();
  const firstHalf = columns.slice(0, index);
  const secondHalf = columns.slice(index + 1, columns.length);
  workspace.__globals.grid.columns = [...firstHalf, ...secondHalf];
}
