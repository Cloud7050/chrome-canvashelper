/* [Imports] */
import { KEY_ALL, KEY_DOWNLOADS } from "./constants.js";
import { d, getTimestamp } from "./utilities.js";



/* [Main] */
function clearStorage() {
	return chrome.storage.sync.clear();
}

async function getDownloads(initialiseCourseId = null) {
	let downloads = (await chrome.storage.sync.get(KEY_DOWNLOADS))?.[KEY_DOWNLOADS] ?? {};
	if (initialiseCourseId !== null) {
		downloads[initialiseCourseId] = downloads[initialiseCourseId] ?? {
			[KEY_ALL]: null
		};
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

export function rememberDownloadFiles(courseId, fileIds) {
	for (let fileId of fileIds) rememberDownloadFile(courseId, fileId);
}

export async function rememberDownloadFolder(courseId, folderId) {
	//TODO no folder ID, need to compare breadcrumb/URL with sidebar to find a
	// matching ID, then use newer of current folder or file's timestamp for
	// each file. BUT, scheduled/hidden files can show up delayed while
	// backdated, ie we think it's downloaded but it's actually not (bad false
	// positive)
}
