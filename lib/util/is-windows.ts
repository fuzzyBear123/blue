let isWindowsConst = /^win/.test(globalThis.process ? globalThis.process.platform : "");
export let isWindows = () => isWindowsConst;
