# widget-launch
## Background
The `widget-launch` library is an npm library providing a simple wrapper around and replacement for the widget launching functions of OWF. This library is intended to ease the transition away from OWF by providing a replacement for direct calls to OWF that will function inside or outside OWF. It is not intended as a complete replacement for OWF; OWF capabilities unrelated to widget launching are outside the scope of this library.

## Usage

### Launching Widget/Page

```ts
const widgetLauncher = new WidgetLauncher();

widgetLauncher.launch({
    universalName: 'openedWidget',
    url: 'fakeurl',
    guid: 'fake',
    title: 'fake',
    data: '{}',
    launchOnlyIfClosed: false,
}, () => {})
```

### Launched Widget/Page

```ts
const widgetLauncher = new WidgetLauncher();

const launchData = await widgetLauncher.getLaunchData();

widgetLauncher.closeWidget();
```

## Methods
The library exposes a single class, `WidgetLauncher`. `WidgetLauncher` contains the following methods:

* `isInOwf`: Reports whether the current page is running in `OWF`, 
  by checking for the existence of `window.OWF` and checking `OWF.Util.isRunningInOWF`.
  This is used internally to detect `OWF`, but also made available to clients of this library.

* `launch`: Launches a widget according to the `LaunchOptions` passed. 
  In `OWF`, this is a thin wrapper around `OWF.Launcher.launch` with the same signature. 
  Outside `OWF`, this call may use the `ozp-iwc` library or `browser-only` 
  implementation along with calling `window.open`. 

  > Note that outside OWF you must pass the `universalName` 
  > and the `url` of the widget inside the `LaunchOptions` in order to launch the widget.

  > Note: `ozp-iwc` is the same library that may be used by `@moesol/inter-widget-communication`. 
  > However, `ozp-iwc` is deprecated and `BroadcastChannel` (via `provider: 'broadcast'`) is 
  > the new preferred implementation in `@moesol/inter-widget-communication`

* `getWidget`: Gets a widget according to the GetWidgetOptions passed. 
  In OWF, this is a thin wrapper around `OWF.Preferences.getWidget` with the same signature. 
  Outside OWF, this function immediately passes through to the `onSuccess` callback - 
  this is here for compatibility with `OWF` where you would typically call `getWidget` with `launch` as the `onSuccess` callback.

* `getLaunchData`: Gets the launch data for the widget. 
  In OWF, this is a thin wrapper around `OWF.Launcher.getLaunchData` with the same signature. 
  Outside OWF, this uses the `ozp-iwc` library (the same library used by `@moesol/inter-widget-communication`). 
  > Note that unlike `OWF.Launcher.getLaunchData`, this is an asynchronous function 
  > because `ozp-iwc`'s `get` is an asynchronous operation.

* `closeWidget`: Closes the current widget. 
  In OWF, this is a thin wrapper around `Ozone.state.WidgetState.getInstance().closeWidget` with the same signature. 
  Outside OWF, this simply calls `window.close`.

## Limitations with Using `ozp-iwc` (deprecated)
Please note the following requirements and limitations of the library when used outside OWF (Future contributors can address these as needed):

* In this mode, IWC is used to check whether there are running instances of the widget before opening, 
  for use with the `launchOnlyIfClosed` option. 

* Usage outside of OWF currently requires the `ozp-iwc` library. 
  This library is not available as a module and so must be included in a `<script>` tag on any page wanting to use the `WidgetLauncher` outside OWF.

* If intending to use outside of OWF, the `WidgetLauncher` should be initialized with an instance of the `ozp-iwc` client 
  passed to it - this can be obtained by calling `new window.ozpIwc.Client({ peerUrl: '...' })`. The first pass involved instantiating the client inside the `WidgetLauncher` constructor, but this resulted in a new bus iframe being created every time a `WidgetLauncher` was created on the same page.

* Outside OWF, the `window.name` of opened widgets is used to store the universal name (for checking if open) and
  a generated id (to get the launch data). If this property is overwritten the widget will no longer be recognized as open and will not be able to retrieve launch data.

* For a page to be recognized as open for the purposes of the `launch` function, it must initialize a `WidgetLauncher` 
  at least once when it loads.

* Pages navigated to directly by a user will not be able to use `getLaunchData` or `closeWidget` - `getLaunchData` 
  will not have any launch data set and the `window.close` method used by `closeWidget` cannot close pages that were not opened by javascript. Such pages can use the other functions of the `WidgetLauncher` as normal.

## Limitations when Using `browser-only`
If neither `OWF` or `ozp-iwc` are available, this library falls back to using the Browser's `window.open` API.

* For this mode call `const widgetLauncher = new WidgetLauncher();` with no additional parameters

* As with `ozp-iwc`, the `window.name` of opened widgets is used to store information (including the launch data)
  If this property is overwritten the widget will no longer be recognized as open and will not be able to retrieve launch data.

* The option `launchOnlyIfClosed` behaves differently than in OWF or `ozp-iwc`.
  Pages launched from different browser sessions that contain the same `universalName` will not be detected as `open`.
  Thus, another window will open in this case.
  
  > Note: however, if the same session uses `launchOnlyIfClosed` then the already open window is used unless,
  > the launch data is different

  Pages launched with different launch data will always open a new window.

* The function `getWidget` behaves differently as described in **Methods**

* The browser may limit the size of the `window.name` property, so passing large JSON (> 4K bytes) data should be avoided.

* In this `browser-only` mode `options.features` is passed as the
  last parameter to `window.open`.
  This allows `popup` or other features to be specified.
  `options.features` is ignored in `OWF` or when using `ozp-iwc`.
