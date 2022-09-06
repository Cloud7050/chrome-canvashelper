/* [Imports] */
import { URL_MULTI_DOWNLOAD, URL_SINGLE_DOWNLOAD } from "./downloadTracker/constants.js";
import { rememberDownloadFile, rememberDownloadFiles } from "./downloadTracker/storage.js";
import { extractCourseId, extractFileId, isCanvas, markAllTabs, markIfFilesPage } from "./downloadTracker/utilities.js";
import { d, l, refreshBadge } from "./utilities.js";



/* [Main] */
l("☁️");
refreshBadge();

// Download Tracker: Extension start
markAllTabs();

// Download Tracker: Single download
chrome.webRequest.onBeforeRedirect.addListener(
	async (details) => {
		if (!isCanvas(details.initiator)) return;

		let courseId = await extractCourseId(details.tabId);
		if (courseId === -1) return;

		let fileId = extractFileId(details.url);

		l(`From course ${courseId}, downloading single file: ${fileId}`);
		await rememberDownloadFile(courseId, fileId);

		markAllTabs();
	},
	{
		urls: [URL_SINGLE_DOWNLOAD]
	}
);

// Download Tracker: Multi download
chrome.webRequest.onBeforeRequest.addListener(
	async (details) => {
		if (!isCanvas(details.initiator)) return;

		let courseId = await extractCourseId(details.tabId);
		if (courseId === -1) return;

		let { formData } = details.requestBody;
		let fileIds = formData["select[files][]"] ?? [];
		let folderIds = formData["select[folders][]"] ?? [];

		if (fileIds.length !== 0) {
			l(`From course ${courseId}, downloading files as zip: ${fileIds}`);
			await rememberDownloadFiles(courseId, fileIds);
		}
		if (folderIds.length !== 0) {
			l(`From course ${courseId}, downloading folders as zip: ${folderIds}`);
			//NOTE See TODOs for current limitation
		}

		markAllTabs();
	},
	{
		urls: [URL_MULTI_DOWNLOAD]
	},
	["requestBody"]
);

// Download Tracker: Page change
chrome.tabs.onUpdated.addListener(
	(tabId, changeInfo, tab) => {
		if (changeInfo.url === undefined) return;

		d("Tab link changed");
		// Tab link changed immediately. This may or may not involve web navigation.
		// • If it doesn't (eg clicking a folder in the sidebar, back/forward cache), marking only
		// fires here
		// • If it does (eg clicking a folder row, back/forward without cache, entering a different
		// link), marking will also fire in chrome.webNavigation at around the same time

		// There is a delay after the link changes, before the rows actually get replaced. Need to
		// ignore processed rows, and wait to mark only unprocessed ones
		markIfFilesPage(tab, true);
	}
);

chrome.webNavigation.onDOMContentLoaded.addListener(
	(details) => {
		if (details.frameType !== "outermost_frame") return;

		d("DOM completed load");
		// This fires without chrome.tabs firing, eg when refreshing, entering the same link

		markIfFilesPage(details.tabId);
	}
);
