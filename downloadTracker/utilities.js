/* [Imports] */
import { REGEX_CANVAS } from "../constants.js";
import { l } from "../utilities.js";
import { REGEX_COURSE_ID } from "./constants.js";



/* [Exports] */
export function isCanvas(url) {
	return REGEX_CANVAS.test(url);
}

export function isCanvasDetails(details) {
	return isCanvas(details.initiator);
}

export function extractCourseId(tab) {
	let result = REGEX_COURSE_ID.exec(tab.url);
	if (result === null) return -1;

	return parseInt(result.groups.id);
}

export async function extractCourseIdTabless(tabId) {
	return extractCourseId(
		await chrome.tabs.get(tabId)
	);
}

export function getTimestamp() {
	return (new Date())
		.toISOString();
}

export function markCanvasFilePage(tab) {
	if (!isCanvas(tab.url)) return;

	let courseId = extractCourseId(tab);
	if (courseId === -1) return;

	chrome.scripting.executeScript({
		target: {
			tabId: tab.id
		},
		files: ["./downloadTracker/marker.js"]
	});
	l(`For course ${courseId}, file page marked`);
}
