//Get the total width of all monitors

export default function toalWidth(): number {
  let width = 0;

  for (const screen of workspace.screens) {
    width += screen.geometry.width;
  }

  return width;
}
