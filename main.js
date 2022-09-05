/* [Imports] */
import { ID_FORGET_DOWNLOADS } from "./constants.js";
import { URL_MULTI_DOWNLOAD, URL_SINGLE_DOWNLOAD } from "./downloadTracker/constants.js";
import { extractCourseIdTabless, extractFileId, isCanvasDetails, markCanvasFilePage } from "./downloadTracker/utilities.js";
import { clearDownloads, rememberDownloadFile } from "./storage.js";
import { l } from "./utilities.js";



/* [Main] */
l("☁️");

// Download Tracker: Context menus
chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: ID_FORGET_DOWNLOADS,
		title: "🗑️ Forget all tracked downloads",
		contexts: ["action"]
	});
});
chrome.contextMenus.onClicked.addListener((info, _tab) => {
	let id = info.menuItemId;

	if (id === ID_FORGET_DOWNLOADS) clearDownloads();
});

// Download Tracker: Single download
chrome.webRequest.onBeforeRedirect.addListener(
	async (details) => {
		if (!isCanvasDetails(details)) return;

		let courseId = await extractCourseIdTabless(details.tabId);
		if (courseId === -1) return;

		let fileId = extractFileId(details.url);

		l(`From course ${courseId}, downloading single file: ${fileId}`);
		rememberDownloadFile(courseId, fileId);
	},
	{
		urls: [URL_SINGLE_DOWNLOAD]
	}
);

// Download Tracker: Multi download
chrome.webRequest.onBeforeRequest.addListener(
	async (details) => {
		if (!isCanvasDetails(details)) return;

		let courseId = await extractCourseIdTabless(details.tabId);
		if (courseId === -1) return;

		let { formData } = details.requestBody;
		let fileIds = formData["select[files][]"] ?? [];
		let folderIds = formData["select[folders][]"] ?? [];

		if (fileIds.length !== 0) {
			l(`From course ${courseId}, downloading files as zip: ${fileIds}`);
			for (let fileId of fileIds) rememberDownloadFile(courseId, fileId);
		}
		if (folderIds !== 0) {
			l(`From course ${courseId}, downloading folders as zip: ${folderIds}`);
			//NOTE See TODOs for current limitation
		}
	},
	{
		urls: [URL_MULTI_DOWNLOAD]
	},
	["requestBody"]
);

// Download Tracker: Extension start
(async () => {
	let tabs = await chrome.tabs.query({});
	for (let tab of tabs) markCanvasFilePage(tab);
})();

// Download Tracker: Page load
chrome.tabs.onUpdated.addListener(
	(tabId, changeInfo, tab) => {
		if (changeInfo.status !== "complete") return;

		markCanvasFilePage(tab);
	}
);
