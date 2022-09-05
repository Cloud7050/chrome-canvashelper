/* [Imports] */
import { REGEX_CANVAS } from "../constants.js";
import { l } from "../utilities.js";
import { REGEX_COURSE_ID, REGEX_SINGLE_DOWNLOAD } from "./constants.js";



/* [Exports] */
export function isCanvas(link) {
	return REGEX_CANVAS.test(link);
}

export function isCanvasDetails(details) {
	return isCanvas(details.initiator);
}

export function extractCourseId(link) {
	let result = REGEX_COURSE_ID.exec(link);
	if (result === null) return -1;

	return parseInt(result.groups.id);
}

export async function extractCourseIdTabless(tabId) {
	let tab = await chrome.tabs.get(tabId);
	return extractCourseId(tab.url);
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

export function markCanvasFilePage(tab) {
	if (!isCanvas(tab.url)) return;

	let courseId = extractCourseId(tab.url);
	if (courseId === -1) return;

	chrome.scripting.executeScript({
		target: {
			tabId: tab.id
		},
		files: ["./downloadTracker/marker.js"]
	});
	l(`For course ${courseId}, file page marked`);
}