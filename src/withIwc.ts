import { v4 as uuidv4 } from 'uuid';
import {
    getWindowName,
    getUniversalNameFromWindowName,
    getIdFromWindowName,
} from './windowNameUtils';
import { IwcClient, LaunchOptions } from './types';

const setupWidget = async (iwcClient: IwcClient) => {
    if (window.name) {
        try {
            const universalName = getUniversalNameFromWindowName(window.name);
            new iwcClient.data.Reference(
                `/isOpen/${universalName}/refresh`
            ).watch((change, done) => {
                if (change.deleted) return;
                new iwcClient.data.Reference(`/isOpen/${universalName}`).set(
                    true
                );
            });
        } catch (error) {
            // If we weren't able to determine the widget's name and id, just do nothing
        }
    }
};

const launch = async (
    options: LaunchOptions,
    callback: () => void,
    iwcClient: IwcClient
) => {
    if (options.launchOnlyIfClosed) {
        await new iwcClient.data.Reference(
            `/isOpen/${options.universalName}`
        ).delete();
        await new iwcClient.data.Reference(
            `/isOpen/${options.universalName}/refresh`
        ).set(true);
        await new iwcClient.data.Reference(
            `/isOpen/${options.universalName}/refresh`
        ).delete();
        let widgetOpen;

        try {
            widgetOpen = await new iwcClient.data.Reference(
                `/isOpen/${options.universalName}`
            ).get();
        } catch (error) {
            widgetOpen = false;
        }

        // Launch only if there are no instances of this widget already open
        if (!widgetOpen) {
            launchInternal(options, callback, iwcClient);
        }
    } else {
        launchInternal(options, callback, iwcClient);
    }
};

const launchInternal = async (
    options: LaunchOptions,
    callback: () => void,
    iwcClient: IwcClient
) => {
    const widgetId = uuidv4();
    const windowName = getWindowName(options.universalName, widgetId);

    await new iwcClient.data.Reference(`/launchData/${widgetId}`).set(
        options.data
    );

    window.open(options.url, windowName, 'noopener');
    callback();
};

const getLaunchData = async (iwcClient: IwcClient) => {
    if (window.name) {
        try {
            const windowId = getIdFromWindowName(window.name);

            return await new iwcClient.data.Reference(
                `/launchData/${windowId}`
            ).get();
        } catch (error) {
            return null;
        }
    } else {
        return null;
    }
};

export { setupWidget, launch, getLaunchData };
