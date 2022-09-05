/* [Imports] */
import { KEY_DOWNLOADS, KEY_DOWNLOADS_DEV } from "./constants.js";
import { getTimestamp } from "./downloadTracker/utilities.js";
import { d, l } from "./utilities.js";



/* [Main] */
async function getKey() {
	let extensionInfo = await chrome.management.getSelf();
	let isDev = extensionInfo.installType === "development";
	return isDev ? KEY_DOWNLOADS_DEV : KEY_DOWNLOADS;
}

async function setDownloads(downloads) {
	chrome.storage.sync.set(
		{
			[await getKey()]: downloads
		}
	);
}



/* [Exports] */
export function clearStorage() {
	return chrome.storage.sync.clear();
}

export async function getDownloads(initialiseCourseId = null) {
	let key = getKey();
	let result = await chrome.storage.sync.get(key);

	let downloads = result?.[key] ?? {};
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
	return setDownloads(downloads);
}

export async function clearDownloads() {
	return chrome.storage.sync.remove(
		await getKey()
	);
}
