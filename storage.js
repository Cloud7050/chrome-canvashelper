/* [Imports] */
import { KEY_DOWNLOADS } from "./downloadTracker/constants.js";
import { getTimestamp } from "./downloadTracker/utilities.js";
import { d } from "./utilities.js";



/* [Main] */
function clearStorage() {
	return chrome.storage.sync.clear();
}

async function getDownloads(initialiseCourseId = null) {
	let downloads = (await chrome.storage.sync.get(KEY_DOWNLOADS))?.[KEY_DOWNLOADS] ?? {};
	if (initialiseCourseId !== null) {
		downloads[initialiseCourseId] = downloads[initialiseCourseId] ?? {};
	}
	return downloads;
}

function setDownloads(downloads) {
	chrome.storage.sync.set(
		{
			[KEY_DOWNLOADS]: downloads
		}
	);
}



/* [Exports] */
export async function rememberDownloadFile(courseId, fileId) {
	let downloads = await getDownloads(courseId);
	downloads[courseId][fileId] = getTimestamp();
	setDownloads(downloads);
	d(downloads);
}
