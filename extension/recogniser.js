/* [Imports] */
import { DOMAIN_NAME, REGEX_COURSE_ID, REGEX_DOMAIN, REGEX_FILE_ID, REGEX_QUIZ_ID } from "./constants.js";
import { getLink, getTab } from "./utilities.js";



/* [Exports] */
export function isCanvas(link) {
	let result = REGEX_DOMAIN.exec(link);
	if (result === null) return false;

	let { domain } = result.groups;
	return domain === DOMAIN_NAME;
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

export function extractQuizId(link) {
	let result = REGEX_QUIZ_ID.exec(link);
	if (result === null) return -1;

	return parseInt(result.groups.id);
}

export function isQuizResults(link) {
	if (!isCanvas(link)) return false;

	let quizId = extractQuizId(link);
	if (quizId === -1) return false;

	return true;
}
