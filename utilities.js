/* [Imports] */
import { REGEX_CANVAS, REGEX_COURSE_ID } from "./constants.js";



/* [Exports] */
export function l(content, group = false) {
	let consoleFunction = (!group) ? console.log : console.group;
	consoleFunction(
		// Skip instanceof check for type object + class String from new String()s
		(typeof content !== "string")
			? content
			: `>>> ${content}`
	);
}

export function w(content) {
	console.warn(
		(typeof content !== "string")
			? content
			: `[!] ${content}!`
	);
}

export function e(content) {
	console.error(
		(typeof content !== "string")
			? content
			: `ERR ${content}!`
	);
}

export function d(content) {
	console.debug(
		(typeof content !== "string")
			? content
			: `*** ${content}`
	);
}

export function isCanvas(details) {
	return REGEX_CANVAS.test(details.initiator);
}

export async function extractCourseId(tabId) {
	let tab = await chrome.tabs.get(tabId);

	let result = REGEX_COURSE_ID.exec(tab.url);
	if (result === null) return -1;

	return parseInt(result.groups.id);
}

export function getTimestamp() {
	return (new Date())
		.toISOString();
}
