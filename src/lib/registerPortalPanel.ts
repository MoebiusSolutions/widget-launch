import { dragElement } from "./dragElement";

export async function registerPortalPanel(div: any, id: any, width: any, height: any, top: any, left: any, name: any, scaffold: any) {
  div.style.setProperty('width', width);
  div.style.setProperty('height', height);
  div.style.setProperty('top', top);
  div.style.setProperty('left', left);
  div.style.setProperty('position', 'relative');

  dragElement(div, () => { 
        scaffold.chrome.panels.removePanel(id)
        scaffold.chrome.panels.closeLocation('portal')
    }, name);
}
