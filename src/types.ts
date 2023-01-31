import type { ExtensionScaffoldApi, AddPanelOptions } from '@moesol/es-runtime/build/es-api';

/**
 * @internal
 */
declare global {
    interface Window {
        OWF: {
            Launcher: {
                launch: (
                    options: LaunchOptions,
                    callback: (r: unknown) => void
                ) => void;
                getLaunchData: () => any;
            };
            Preferences: {
                getWidget: (options: GetWidgetOptions) => void;
            };
            Util: {
                isRunningInOWF: () => boolean;
            };
            ready: (onReady: () => void) => void;
        };
        Ozone: {
            state: {
                WidgetState: {
                    getInstance: () => {
                        closeWidget: () => void;
                    };
                };
            };
        };
        ozpIwc: {
            Client: {
                new (options: { peerUrl: string }): IwcClient;
            };
        };
    }
}

/**
 * @public
 */
export interface IwcClient {
    data: {
        Reference: {
            new (resource: string): {
                get: () => Promise<any>;
                bulkGet: () => Promise<any[]>;
                list: () => Promise<string[]>;
                set: (value: any) => Promise<void>;
                delete: () => Promise<void>;
                watch: (
                    callback: (
                        change: { deleted: boolean },
                        done: () => void
                    ) => void
                ) => Promise<any>;
            };
        };
    };
}

/**
 * @public
 */
export interface LaunchOptions {
    universalName?: string;
    url?: string;
    guid: string | null;
    title: string;
    launchOnlyIfClosed: boolean;
    data: string;
    opener?: string;
    scaffold?: ExtensionScaffoldApi;
    dialog?: boolean;
    extensionOptions?: AddPanelOptions; 
    /**
     * When not in OWF, `features` is passed to window.open(url, name, features)
     */
    features?: string 
}

/**
 * @public
 */
export interface GetWidgetOptions {
    universalName: string;
    onSuccess: (r: unknown) => void;
    onFailure: (r: unknown) => void;
}
