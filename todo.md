1. Resizing Columns - DONE
2. Add system for sizing initial windows seperate from window.add(): - DONE

Sizing strategy:

1. Main.ts automatically calculates what should be the XPos of the windows via their stacking order
2. Use this as the x position in the column
3. Get the max area, and set windows width, height, and y, to the leastMaxArea
4. Make sure this is done seperately outside of the window.add() function. Probably just in the constructor

4) Window Pager. Add XPos, ResurceClass, and columns windows per column. When you do this, get rid of the annoying logs the spam journalctl and kwin grep -- DONE
   This will help with debugging the below ->
5) When a window can't be resized "maximize accordingly -- DONE

6) For removeWindow() function setup better scrolling.
   if removing first window, and no other windows are on screen, scroll to the next one.
   Do the same for if on last window in opposite direction.
   Every other situation should scroll the _last half_ of the columns to the left -- DONE

7) If window is opened and not currently on screen, scroll to it -- DONE

8) In the addWindow() function in main.ts make it so that xPosStart is calculated from the maximizableArea -- DONE

9) Imrpove focus in the following situations:

- Opening new window -- DONE

- No Window currently selected:
  For this, try to do something like this: When focus keyboard shortcuts are pushed, foucs the first or last column based on if the users focuses to the left or to the right

6. Figure out why opening windows dont work on initial login (I think this is resolved?)

7. Width Presets
8. Icons in pager
9. Research how to make desktop effect for advanced switcher
