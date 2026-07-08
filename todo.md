1. Resizing Columns - DONE
2. Add system for sizing initial windows seperate from window.add(): - DONE

Sizing strategy:

1. Main.ts automatically calculates what should be the XPos of the windows via their stacking order
2. Use this as the x position in the column
3. Get the max area, and set windows width, height, and y, to the leastMaxArea
4. Make sure this is done seperately outside of the window.add() function. Probably just in the constructor

4) Window Pager. Add XPos, ResurceClass, and columns windows per column. When you do this, get rid of the annoying logs the spam journalctl and kwin grep
   This will help with debugging the below ->
5) Figure out why sometimes it completely loses focus.
   Its possible this is because a window becomes out of focus then no window is returned by the getColumnWithActiveWindow() function

6) Figure out why opening windows dont work on initial login

7) Width Presets
8) Research how to make desktop effect for advanced switcher
