export async function dragElement(elmnt: any, callback: any, name: any) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const title = `<div style="text-align: left;padding-left:10px;cursor:move;background-color:#1A1A1A;color:#fff;margin-block-start: 0px;margin-block-end: 0px">${name}</div>`;
    elmnt.insertAdjacentHTML('afterbegin', title);
    const titleBar = elmnt.children[0];

    if (callback) {
      titleBar.insertAdjacentHTML('afterbegin', '<span style="margin-block-start: 0px;cursor:default;move;float:right;display:inline-block;padding:0px 5px;background:#1A1A1A;">x</span>');
      const exitButton = titleBar.children[0];
      exitButton.onmousedown = callback;
    }

    titleBar.onpointerdown  = dragMouseDown;
    titleBar.onpointerup   = closeDragElement;

    function dragMouseDown(e: any) {
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      titleBar.onpointermove  = elementDrag;
      titleBar.setPointerCapture(e.pointerId);
    }

    function elementDrag(e: any) {
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.setProperty('top', (elmnt.offsetTop - pos2) + "px");
      elmnt.style.setProperty('left', (elmnt.offsetLeft - pos1) + "px");
    }

    function closeDragElement(e:any) {
      /* stop moving when mouse button is released:*/
      titleBar.onpointermove  = null;
      titleBar.releasePointerCapture(e.pointerId);
    }
}