const getWindowName = (universalName: string, id: string) => {
    return JSON.stringify({ universalName, id });
};

const getUniversalNameFromWindowName = (windowName: string) => {
    return JSON.parse(windowName).universalName;
};

const getIdFromWindowName = (windowName: string) => {
    return JSON.parse(windowName).id;
};

export { getWindowName, getUniversalNameFromWindowName, getIdFromWindowName };
