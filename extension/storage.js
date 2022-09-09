/* [Imports] */
import { KEY_DEV_STORAGE } from "./constants.js";
import { get, set } from "./storageSync.js";



/* [Exports] */
export function getDevStorage() {
	return get(KEY_DEV_STORAGE);
}

export function setDevStorage(isDevStorage) {
	return set(KEY_DEV_STORAGE, isDevStorage);
}
