/* [Imports] */
import { KEY_DOWNLOADS } from "./constants.js";
import { getTimestamp } from "./downloadTracker/utilities.js";
import { d } from "./utilities.js";



/* [Main] */
function setDownloads(downloads) {
	chrome.storage.sync.set(
		{
			[KEY_DOWNLOADS]: downloads
		}
	);
}



/* [Exports] */
export async function getDownloads(initialiseCourseId = null) {
	let downloads = (await chrome.storage.sync.get(KEY_DOWNLOADS))?.[KEY_DOWNLOADS] ?? {};
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

export function clearDownloads() {
	return chrome.storage.sync.remove(KEY_DOWNLOADS);
}

export function clearStorage() {
	return chrome.storage.sync.clear();
}
