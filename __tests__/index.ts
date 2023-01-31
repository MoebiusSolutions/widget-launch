import '../__mocks__/mocks';
import { WidgetLauncher } from '../src/index';

describe('Tests of WidgetLauncher', () => {
    describe('Tests of WidgetLauncher in OWF', () => {
        beforeEach(() => {
            window.OWF.Util.isRunningInOWF.mockReturnValue(true);
        });

        const widgetLauncher = new WidgetLauncher();

        test('WidgetLauncher isInOwf', () => {
            expect(widgetLauncher.isInOwf()).toBe(true);

            expect(window.OWF.Util.isRunningInOWF.mock.calls).toHaveLength(1);
        });

        test('WidgetLauncher launch', () => {
            widgetLauncher.launch(
                {
                    universalName: 'fake',
                    guid: 'fake',
                    title: 'fake',
                    data: '{}',
                    launchOnlyIfClosed: false,
                },
                () => {}
            );

            expect(window.OWF.Launcher.launch.mock.calls).toHaveLength(1);
        });

        test('WidgetLauncher getWidget', () => {
            widgetLauncher.getWidget({
                universalName: 'fake',
                onSuccess: () => {},
                onFailure: () => {},
            });

            expect(window.OWF.Preferences.getWidget.mock.calls).toHaveLength(1);
        });

        test('WidgetLauncher getLaunchData', () => {
            widgetLauncher.getLaunchData();

            expect(window.OWF.Launcher.getLaunchData.mock.calls).toHaveLength(
                1
            );
        });

        test('WidgetLauncher closeWidget', () => {
            widgetLauncher.closeWidget();

            expect(
                window.Ozone.state.WidgetState.getInstance().closeWidget.mock
                    .calls
            ).toHaveLength(1);
        });
    });

    describe('Tests of WidgetLauncher using OZP', () => {
        let windowSpy;
        let mockedOpen;
        let mockedClose;

        beforeEach(() => {
            window.OWF.Util.isRunningInOWF.mockReturnValue(false);
            window.ozpIwc.Client().clearStore();
            windowSpy = jest.spyOn(window, 'window', 'get');
            mockedOpen = jest.fn();
            mockedClose = jest.fn();
            const originalWindow = { ...window };
            windowSpy.mockImplementation(() => ({
                ...originalWindow,
                name: JSON.stringify({
                    universalName: 'fakeWidget',
                    id: 'fakeId',
                }),
                open: mockedOpen,
                close: mockedClose,
            }));
        });

        afterEach(() => {
            windowSpy.mockRestore();
        });

        const widgetLauncher = new WidgetLauncher(new window.ozpIwc.Client());

        test('WidgetLauncher launch', async () => {
            widgetLauncher.launch(
                {
                    universalName: 'openedWidget',
                    url: 'fakeurl',
                    guid: 'fake',
                    title: 'fake',
                    data: '{}',
                    launchOnlyIfClosed: false,
                },
                () => {}
            );

            await flushPromises();

            expect(window.open).toHaveBeenCalledTimes(1);
        });

        test('WidgetLauncher getWidget', () => {
            const mockSuccess = jest.fn();
            const mockFailure = jest.fn();
            widgetLauncher.getWidget({
                universalName: 'openedWidget',
                onSuccess: mockSuccess,
                onFailure: mockFailure,
            });

            expect(mockSuccess.mock.calls).toHaveLength(1);
            expect(mockFailure.mock.calls).toHaveLength(0);
        });

        test('WidgetLauncher getLaunchData', async () => {
            const injectedLaunchData = JSON.stringify({ testKey: 'testValue' });

            window.ozpIwc
                .Client()
                .data.Reference('/launchData/fakeId')
                .set(injectedLaunchData);

            const launchData = await widgetLauncher.getLaunchData();

            expect(launchData).toEqual(injectedLaunchData);
        });

        test('WidgetLauncher closeWidget', () => {
            widgetLauncher.closeWidget();

            expect(mockedClose.mock.calls).toHaveLength(1);
        });
    });

    describe('Test of WidgetLauncher using regular browser', () => {
        const widgetLauncher = new WidgetLauncher();

        let windowSpy;
        let mockedOpen;
        let mockedClose;
        let mockedFocus;

        beforeEach(() => {
            window.OWF.Util.isRunningInOWF.mockReturnValue(false);
            windowSpy = jest.spyOn(window, 'window', 'get');
            mockedOpen = jest.fn();
            mockedClose = jest.fn();
            mockedFocus = jest.fn();
            const originalWindow = { ...window };
            windowSpy.mockImplementation(() => ({
                ...originalWindow,
                open: mockedOpen,
                close: mockedClose,
                addEventListener: jest.fn(),
            }));
            mockedOpen.mockReturnValue(windowSpy);
            windowSpy.opener = {};
            windowSpy.addEventListener = jest.fn();
            windowSpy.focus = jest.fn();
        });

        afterEach(() => {
            windowSpy.mockRestore();
            mockedOpen.mockRestore();
        });

        test('WidgetLauncher launch', () => {
            widgetLauncher.launch(
                {
                    universalName: 'testUniversalName',
                    url: 'testUrl',
                    guid: 'testGuid',
                    title: 'testTitle',
                    data: '{}',
                    launchOnlyIfClosed: true,
                    opener: 'testOpener'
                },
                () => {}
            );

            expect(window.open).toHaveBeenCalled();
            expect(windowSpy.focus).not.toHaveBeenCalled();

            // test that second launch attempt focuses existing window
            widgetLauncher.launch(
                {
                    universalName: 'testUniversalName',
                    url: 'testUrl',
                    guid: 'testGuid',
                    title: 'testTitle',
                    data: '{}',
                    launchOnlyIfClosed: true,
                    opener: 'testOpener'
                },
                () => {}
            );

            expect(window.open).toHaveBeenCalled();
            expect(windowSpy.focus).not.toHaveBeenCalled();

            // test that 3rd launch attempt opens new window if launchOnlyIfClosed is false
            widgetLauncher.launch(
                {
                    universalName: 'testUniversalName',
                    url: 'testUrl',
                    guid: 'testGuid',
                    title: 'testTitle',
                    data: '{}',
                    launchOnlyIfClosed: false,
                    opener: 'testOpener'
                },
                () => {}
            );

            expect(window.open).toHaveBeenCalled();
            expect(windowSpy.focus).not.toHaveBeenCalledTimes(1);
        });

    })
});

// https://stackoverflow.com/questions/44741102/how-to-make-jest-wait-for-all-asynchronous-code-to-finish-execution-before-expec
const flushPromises = () => new Promise(setImmediate);

export {};
