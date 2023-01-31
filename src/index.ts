import * as withOwf from './withOwf';
import * as withIwc from './withIwc';
import * as withBrowser from './withBrowser';
import { LaunchOptions, GetWidgetOptions, IwcClient } from './types';

/**
 * The Widget Launcher class
 * Switches between using OWF and using OZP-IWC depending on environment the page is running in
 * @public
 */
export class WidgetLauncher {
    iwcClient: IwcClient = null;

    constructor(iwcClient?: IwcClient) {
        if (iwcClient) {
            this.iwcClient = iwcClient;
            withIwc.setupWidget(this.iwcClient);
        }
    }

    isInOwf() {
        if (window.OWF?.Util?.isRunningInOWF?.()) return true;
        return false;
    }

    launch(options: LaunchOptions, callback: (r?: unknown) => void) {
        if (this.isInOwf()) {
            withOwf.launch(options, callback);
        } else if (this.iwcClient) {
            withIwc.launch(options, callback, this.iwcClient);
        } else {
            withBrowser.launch(options, callback)
        }
    }

    async getLaunchData() {
        if (this.isInOwf()) {
            return withOwf.getLaunchData();
        } else if (this.iwcClient) {
            return withIwc.getLaunchData(this.iwcClient);
        } else {
            return withBrowser.getLaunchData();
        }
    }

    closeWidget() {
        if (this.isInOwf()) {
            return withOwf.closeWidget();
        } else {
            try {
                window.close();
            } catch (error) {
                throw new Error('Failed to close widget.');
            }
        }
    }

    getWidget(options: GetWidgetOptions) {
        if (this.isInOwf()) {
            withOwf.getWidget(options);
        } else {
            options.onSuccess({ path: null });
        }
    }
}

export type { IwcClient, LaunchOptions, GetWidgetOptions };
