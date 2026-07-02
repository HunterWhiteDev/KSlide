export default class Column {
  width: number;
  xPosStart: number;
  windows: KWin.AbstractClient[] = [];
  padding: number;

  //Refer to docs/model.md
  //A Column's initial geometry is set by its initialWindow.
  //A Column's geometry is set by the intial window. The initial window will not have the padding applied to it's geometry when it is passed to the constructor. calling addWindow() will apply the geometry with padding on the initial window
  //All other operations interacting with a window that is part of a Columns windows property should factor in the padding in the window deminsions
  constructor(initialWindow: KWin.AbstractClient, padding: number) {
    this.width = initialWindow.frameGeometry.width;
    this.xPosStart = initialWindow.frameGeometry.x;
    this.padding = padding;
    this.addWindow(initialWindow);
  }

  addWindow(window: KWin.AbstractClient) {
    //Apply correct geometry with padding to window
    window.frameGeometry = {
      x: this.xPosStart + this.padding,
      width: this.width - this.padding * 2,
      height: window.height - this.padding * 2,
      y: window.y + this.padding,
    };

    window.interactiveMoveResizeStepped.connect(() => {
      window.frameGeometry = window.frameGeometry;
    });

    window.frameGeometryChanged.connect((oldGeometry) => {
      if (window.move) window.frameGeometry = oldGeometry;
    });

    this.windows.push(window);
  }

  deleteWindow(newWindow: KWin.AbstractClient) {
    const newWindows = [];
    for (const window of this.windows) {
      if (newWindow.internalId === window.internalId) continue;
      newWindows.push(window);
    }

    this.windows = newWindows;
    return this.windows.length;
  }

  setXPos(number: number) {
    //Each window should already have padding applied to their width, height, and y value. It only needs to be reapplied to their X value
    for (const window of this.windows) {
      window.frameGeometry = {
        width: window.width,
        height: window.height,
        x: number + this.padding,
        y: window.y,
      };
    }

    this.xPosStart = number;
  }

  maximize(): QRect["x"] | void {
    // KWin.WorkspaceWrapper.ClientAreaOption.MaximizeArea;
    const maxGeometry = workspace.clientArea(2, this.windows[0]);
    print(maxGeometry);

    if (!maxGeometry) return print("KS: No Max Geometry found");
    for (const window of this.windows) {
      window.frameGeometry = {
        width: maxGeometry.width - this.padding * 2,
        height: maxGeometry.height - this.padding * 2,
        x: maxGeometry.x + this.padding,
        y: maxGeometry.y + this.padding,
      };
    }

    this.xPosStart = maxGeometry.x;
    this.width = maxGeometry.width;
    return maxGeometry.width;
  }

  getXPosEnd() {
    return this.xPosStart + this.width;
  }
}
