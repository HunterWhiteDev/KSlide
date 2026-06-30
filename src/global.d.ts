import "kwin-types";
import Column from "./Column";

export declare global {
  // declare const getColumnWithActiveWindow = () => [Column, index];
  namespace KWin {
    interface QtScriptWorkspaceWrapper {
      __globals: {
        getColumnWithActiveWindow: () => [Column, index] | null;
        getColumnsSortedByXPos(): Column[];
        grid: Grid;
        padding: number;
      };
      stackingOrder: KWin.AbstractClient[];
      activeScreen: Output;
      activeWindow: KWin.AbstractClient;
      screens: Output[];
      windowAdded: Signal<(window: KWin.AbstractClient) => void>;
      windowRemoved: Signal<(window: KWin.AbstractClient) => void>;
    }

    interface AbstractClient {
      resourceName: string;
      resourceClass: string;
      output: KWin.AbstractClient;
      interactiveMoveResizeStarted: Signal<() => void>;
      interactiveMoveResizeStepped: Signal<() => void>;
      interactiveMoveResizeFinished: Signal<() => void>;
    }

    interface Output {
      geometry: QRect;
      devicePixelRatio: number;
      name: string;
      manufacturer: string;
      model: string;
      serialNumber: string;
    }
  }
}

export { };
