/* [Imports] */
import { REGEX_CANVAS } from "../constants.js";
import { e, getLink, getTab, l } from "../utilities.js";
import { REGEX_COURSE_ID, REGEX_SINGLE_DOWNLOAD } from "./constants.js";



/* [Exports] */
export function isCanvas(link) {
	return REGEX_CANVAS.test(link);
}

export async function extractCourseId(linkOrTabId) {
	let link = await getLink(linkOrTabId);

	let result = REGEX_COURSE_ID.exec(link);
	if (result === null) return -1;

	return parseInt(result.groups.id);
}

export function extractFileId(link) {
	let result = REGEX_SINGLE_DOWNLOAD.exec(link);
	if (result === null) return -1;

	return parseInt(result.groups.id);
}

export function getTimestamp() {
	return (new Date())
		.toISOString();
}

export async function markIfFilesPage(tabOrId, awaitUnprocessed = false) {
	let tab = await getTab(tabOrId);

	if (!isCanvas(tab.url)) return;

	let courseId = await extractCourseId(tab.url);
	if (courseId === -1) return;

	chrome.scripting.executeScript({
		target: {
			tabId: tab.id
		},
		files: [
			awaitUnprocessed
				? "./downloadTracker/markerAwait.js"
				: "./downloadTracker/markerNoAwait.js"
		]
	});
	l(`Marking for course ${courseId}...`);
}

export async function markAllTabs() {
	let tabs = await chrome.tabs.query({});
	for (let tab of tabs) markIfFilesPage(tab);
}
