/* [Imports] */
import { l } from "../logging.js";
import { extractCourseId, isFilesPage } from "../recogniser.js";
import { getTab } from "../utilities.js";



/* [Exports] */
export function getTimestamp() {
	return (new Date())
		.toISOString();
}

export async function markIfFilesPage(tabOrId, awaitUnprocessed = false) {
	let isRelevant = await isFilesPage(tabOrId);
	if (!isRelevant) return;

	let tab = await getTab(tabOrId);
	let courseId = await extractCourseId(tab.url);

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
