/* [Imports] */
import { REGEX_CANVAS, REGEX_COURSE_ID, REGEX_FILE_ID } from "./constants.js";
import { getLink, getTab } from "./utilities.js";



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
	let result = REGEX_FILE_ID.exec(link);
	if (result === null) return -1;

	return parseInt(result.groups.id);
}

export async function isFilesPage(tabOrId) {
	let tab = await getTab(tabOrId);

	if (!isCanvas(tab.url)) return false;

	let courseId = await extractCourseId(tab.url);
	if (courseId === -1) return false;

	return true;
}
