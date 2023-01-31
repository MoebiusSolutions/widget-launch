declare global {
    interface Window {
        OWF: any;
        Ozone: any;
        ozpIwc: any;
    }
}

window.OWF = {
    Launcher: {
        launch: jest.fn(),
        getLaunchData: jest.fn(),
    },
    Preferences: {
        getWidget: jest.fn(),
    },
    Util: {
        isRunningInOWF: jest.fn(),
    },
};

const mockWidgetInstance = {
    closeWidget: jest.fn(),
};

window.Ozone = {
    state: {
        WidgetState: {
            getInstance: () => mockWidgetInstance,
        },
    },
};

let clientDataStore = {};

window.ozpIwc = {
    Client: jest.fn(() => ({
        data: {
            Reference: jest.fn((key: string) => ({
                get: jest.fn(() =>
                    clientDataStore[key]
                        ? Promise.resolve(clientDataStore[key])
                        : Promise.reject()
                ),
                bulkGet: jest.fn(() =>
                    Promise.resolve(
                        Object.keys(clientDataStore)
                            .filter((dataKey) => dataKey.startsWith(key))
                            .map((dataKey) => clientDataStore[dataKey])
                    )
                ),
                list: jest.fn(() =>
                    Promise.resolve(
                        Object.keys(clientDataStore).filter((dataKey) =>
                            dataKey.startsWith(key)
                        )
                    )
                ),
                set: jest.fn((value: any) => {
                    clientDataStore[key] = value;
                    return Promise.resolve();
                }),
                delete: jest.fn(() => {
                    delete clientDataStore[key];
                    return Promise.resolve();
                }),
            })),
        },
        logStore: () => console.log(clientDataStore),
        clearStore: () => (clientDataStore = {}),
    })),
};

export {};
