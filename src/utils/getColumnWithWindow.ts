//Get column with any window parameter

import Column from "../Column";

export default function getColumnWithWindw(
  window: KWin.AbstractClient,
): Column | null {
  const columns = workspace.__globals.grid.columns;

  for (const col of columns) {
    for (const win of col.windows) {
      if (window.internalId === win.internalId) return col;
    }
  }
  return null;
}
