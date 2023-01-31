import { GetWidgetOptions, LaunchOptions } from './types';

const launch = (options: LaunchOptions, callback: (r: unknown) => void) => {
    if (window.OWF.Launcher) {
        window.OWF.Launcher.launch(options, callback);
    } else {
        throw new Error('No launch implementation available.');
    }
};

const getLaunchData = () => {
    if (window.OWF.Launcher) {
        return window.OWF.Launcher.getLaunchData();
    } else {
        throw new Error('No getLaunchData implementation available.');
    }
};

const closeWidget = () => {
    if (window.Ozone) {
        window.Ozone.state.WidgetState.getInstance().closeWidget();
    } else {
        throw new Error('No closeWidget implementation available.');
    }
};

const getWidget = (options: GetWidgetOptions) => {
    if (window.OWF.Preferences) {
        window.OWF.Preferences.getWidget(options);
    } else {
        throw new Error('No getWidget implementation available.');
    }
};

export { launch, getLaunchData, closeWidget, getWidget };
