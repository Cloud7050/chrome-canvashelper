/* [Imports] */
import { KEY_DOWNLOADS, KEY_DOWNLOADS_DEV } from "../constants.js";
import { d } from "../logging.js";
import { getDevStorage } from "../storage.js";
import { clear, get, set } from "../storageSync.js";
import { getTimestamp } from "./utilities.js";



/* [Main] */
async function getKey() {
	let isDevStorage = await getDevStorage();
	return isDevStorage ? KEY_DOWNLOADS_DEV : KEY_DOWNLOADS;
}



/* [Exports] */
export async function getDownloads(initialiseCourseId = null) {
	let downloads = await get(
		await getKey()
	);
	if (initialiseCourseId !== null) {
		downloads[initialiseCourseId] = downloads[initialiseCourseId] ?? {};
	}
	return downloads;
}

export function rememberDownloadFile(courseId, fileId) {
	return rememberDownloadFiles(courseId, [fileId]);
}

export async function rememberDownloadFiles(courseId, fileIds) {
	let downloads = await getDownloads(courseId);
	let trackedFileIds = downloads[courseId];

	let timestamp = getTimestamp();
	for (let fileId of fileIds) trackedFileIds[fileId] = timestamp;

	d(downloads);
	return set(
		await getKey(),
		downloads
	);
}

export async function clearDownloads() {
	return clear(
		await getKey()
	);
}
