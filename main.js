/* [Imports] */
import { REGEX_SINGLE_DOWNLOAD, URL_MULTI_DOWNLOAD, URL_SINGLE_DOWNLOAD } from "./constants.js";
import { rememberDownloadFile, rememberDownloadFiles } from "./storage.js";
import { d, extractCourseId, isCanvas, l } from "./utilities.js";



/* [Main] */
l("☁️");

// Single download
chrome.webRequest.onBeforeRedirect.addListener(
	async (details) => {
		if (!isCanvas(details)) return;

		let courseId = await extractCourseId(details.tabId);
		if (courseId === -1) return;

		let result = REGEX_SINGLE_DOWNLOAD.exec(details.url);
		let fileId = parseInt(result.groups.id);

		l(`From course ${courseId}, downloading single file: ${fileId}`);
		rememberDownloadFile(courseId, fileId);
	},
	{
		urls: [URL_SINGLE_DOWNLOAD]
	}
);

// Multi download
chrome.webRequest.onBeforeRequest.addListener(
	async (details) => {
		if (!isCanvas(details)) return;

		let courseId = await extractCourseId(details.tabId);
		if (courseId === -1) return;

		let { formData } = details.requestBody;
		let fileIds = formData["select[files][]"] ?? [];
		let folderIds = formData["select[folders][]"] ?? [];

		if (fileIds.length !== 0) {
			l(`From course ${courseId}, downloading files as zip: ${fileIds}`);
			rememberDownloadFiles(courseId, fileIds);
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

// Folder navigation
// chrome.tabs.onUpdated.addListener(
// 	(tabId, changeInfo, _tab) => {
// 		console.log(changeInfo);
// 		console.log(_tab);
// 		if (changeInfo.url === undefined) return;

// 		console.log(changeInfo.url);
// 	}
// );
