/* [Imports] */
import { URL_MULTI_DOWNLOAD, URL_SINGLE_DOWNLOAD } from "./constants.js";
import { rememberDownloadFile, rememberDownloadFiles } from "./downloadTracker/storage.js";
import { markAllTabs, markIfFilesPage } from "./downloadTracker/utilities.js";
import { d, l } from "./logging.js";
import { notifyDownloadsChanged } from "./messenger.js";
import { checkAllTabs, checkForQuiz } from "./quizTransferer/utilities.js";
import { extractCourseId, extractFileId, isCanvas } from "./recogniser.js";
import { tryUpgrade } from "./upgrade/utilities.js";
import { refreshBadge } from "./utilities.js";



/* [Main] */
(async () => {
	l("☁️");
	await tryUpgrade();

	l("☁️☁️");
	refreshBadge();

	// Download Tracker: Extension start
	markAllTabs();

	// Quiz Transferer: Extension start
	checkAllTabs();

	// Download Tracker: Single download
	chrome.webRequest.onBeforeRedirect.addListener(
		async (details) => {
			d(details);

			if (!isCanvas(details.url)) return;

			let courseId = await extractCourseId(details.tabId);
			if (courseId === -1) return;

			let fileId = extractFileId(details.url);

			l(`From course ${courseId}, downloading single file: ${fileId}`);
			await rememberDownloadFile(courseId, fileId);

			notifyDownloadsChanged();
		},
		{
			urls: [URL_SINGLE_DOWNLOAD]
		}
	);

	// Download Tracker: Multi download
	chrome.webRequest.onBeforeRequest.addListener(
		async (details) => {
			d(details);

			if (!isCanvas(details.url)) return;

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

			notifyDownloadsChanged();
		},
		{
			urls: [URL_MULTI_DOWNLOAD]
		},
		["requestBody"]
	);

	/*
		Potentially relevant events:
		1) Tab URL change (subset of loading status)
		2) Tab complete status
		3) Outermost DOM loaded

		Marking responses:
		A) Mark now or await
		B) Mark or await unprocessed rows (ignore processed, require unprocessed)

		Page changes:
		• Click sidebar same folder, back/forward cache same folder:
			• Fires 2
		• Click sidebar different folder, back/forward cache different folder:
			• Requires B, fires 1 2
		• Enter same link, refresh:
			• Requires A, fires 2 3
		• Back/forward uncached different folder:
			• Requires B, fires 1 2 3
		• Enter different link, middle-click link, click folder row, back/forward uncached different
		folder:
			• Requires B, fires 1 2 3

		Therefore:
		• 2 is unusable as it will cause indefinite waiting for unprocessed rows, when no row change
		will happen
		• 1 can handle B
		• 3 can handle A
		• In some cases, 1 will fire as B, then 3 will fire as A. Observer is coded to check if already
		observing, though sometimes both will mark now, or it may even still double observe
	*/

	// Download Tracker: Page change
	chrome.tabs.onUpdated.addListener(
		(tabId, changeInfo, tab) => {
			d(changeInfo);

			if (changeInfo.url === undefined) return;

			// 1: Tab link changed immediately. This may or may not involve web navigation
			l("Tab link changed");

			// B: There is a delay after the link changes, before the rows actually get replaced. Need
			// to ignore processed rows, and wait to mark only unprocessed ones
			markIfFilesPage(tab, true);

			checkForQuiz(tab);
		}
	);
	chrome.webNavigation.onDOMContentLoaded.addListener(
		(details) => {
			d(details);

			if (details.frameType !== "outermost_frame") return;

			// 3: (Although 1 may fire before this or at around the same time)
			l("DOM completed load");

			// A:
			markIfFilesPage(details.tabId);
		}
	);

	l("Extension listeners registered");
})();
