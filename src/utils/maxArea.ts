//This function will find the screen with the least amount of area. Thiw will be useful for keeping the columns the same size When only one screen has panels
export default function getScreenWithLeastArea(): QRect {
  const screens = workspace.screens;

  //To do this we have to keep track of the area (height * width) and the actual QRect we eventually want to return
  let leastAreaValue: number = Infinity;
  let leastAreaRect: QRect = {
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  };
  const desktop = workspace.currentDesktop;
  for (const screen of screens) {
    const geometry = workspace.clientArea(2, screen, desktop);
    const area = geometry.width * geometry.height;
    if (area < leastAreaValue) {
      leastAreaValue = area;
      leastAreaRect = geometry;
    }
  }

  return leastAreaRect;
}
