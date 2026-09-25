import Column from "../Column";
export const maxSpace = () => {
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
