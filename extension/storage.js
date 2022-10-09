/* [Imports] */
import { KEY_DEV_STORAGE, KEY_DEV_TOOLS } from "./constants.js";
import { getLocal, setLocal } from "./storageBase.js";



/* [Exports] */
export function getDevTools() {
	return getLocal(KEY_DEV_TOOLS);
}

export function setDevTools(isDevTools) {
	return setLocal(KEY_DEV_TOOLS, isDevTools);
}

export function getDevStorage() {
	return getLocal(KEY_DEV_STORAGE);
}

export function setDevStorage(isDevStorage) {
	return setLocal(KEY_DEV_STORAGE, isDevStorage);
}
