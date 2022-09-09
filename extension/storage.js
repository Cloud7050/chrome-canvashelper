/* [Imports] */
import { KEY_DEV_STORAGE } from "./constants.js";
import { getSync, setSync } from "./storageBase.js";



/* [Exports] */
export function getDevStorage() {
	return getSync(KEY_DEV_STORAGE);
}

export function setDevStorage(isDevStorage) {
	return setSync(KEY_DEV_STORAGE, isDevStorage);
}
