import { LaunchOptions } from './types';
import { v4 as uuidv4 } from 'uuid';
import { registerPortalPanel } from './lib/registerPortalPanel';

/**
 * Launch the window specified in options, or focus it if already opened
 * and launchOnlyIfClosed is true.
 * 
 * @param options the options for the launch, including the url and window name
 * @param callback function to call after launching window
 */
const launch = (options: LaunchOptions, callback?: () => void) => {
    let o: any = options

    if(options.scaffold && options.extensionOptions) {
        launchPanel(options, callback);
        return;
    }

    if (!options.launchOnlyIfClosed) {
        // Force a new window
        o = { ... options, _instance: uuidv4() }
    }
    const encodedName = JSON.stringify(o)

    if (!options.launchOnlyIfClosed) {
        window.open(options.url, encodedName, options.features);
    } else {
        const w = window.open('', encodedName, options.features);
        if (!nameWasFound(w)) {
            window.open(options.url, encodedName, options.features);
        } else {
            w.focus()
        }
    }
    callback && callback();
};

const launchPanel = async (options: LaunchOptions, callback?: () => void) => {
    //Separate scaffold out of options. Was causing a runtime error when running JSON.stringiy(o)
    let {scaffold, ...tmp } = options; 
    let o: any = tmp;
    let extensionOptions = options.extensionOptions;

    if (!options.launchOnlyIfClosed) {
        o = { ... tmp, _instance: uuidv4() }
    }

    if (document.getElementById(extensionOptions.id)) {
        if(scaffold.chrome.panels.isPanelHidden(extensionOptions.id)) {
            scaffold.chrome.panels.togglePanel(extensionOptions.id);
        }
        return;
    }

    if(extensionOptions.iframeSource) {
        const encodedName = JSON.stringify(o);
        const div = await scaffold.chrome.panels.addPanel(extensionOptions);
        const iframe = document.getElementById(extensionOptions.id)?.shadowRoot?.querySelector("iframe");
        iframe.contentWindow.name = encodedName;

        if(options.dialog) {
            registerPortalPanel(div, extensionOptions.id, '450px', '700px', '5px', '55px', extensionOptions.title, scaffold);
        }
    } else {
        console.error("iframe source is missing")
    }
    callback && callback();
};

function nameWasFound(w?: Window) {
    try {
        return w && w.location && w.location.href !== 'about:blank'
    } catch (e) {
        // cross-origin, but we did find it
        console.log('Ignoring error', e)
        return true
    }
}

function getLaunchData() {
    const encodedName = window.name
    try {
        const o = JSON.parse(encodedName)
        return o.data
    } catch (e) {
        return null
    }
}

export { launch, getLaunchData };
