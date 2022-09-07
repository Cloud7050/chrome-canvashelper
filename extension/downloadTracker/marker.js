import { FileStatus } from "./constants.js";

/* [Exports] */
export async function mark(awaitUnprocessed) {
	const { TAG_PROCESSED } = await import(
		chrome.runtime.getURL("./downloadTracker/constants.js")
	);
	const { getDownloads } = await import(
		chrome.runtime.getURL("./downloadTracker/storage.js")
	);
	const {
		COLOUR_HIGHLIGHT,
		COLOUR_DULL
	} = await import(
		chrome.runtime.getURL("../constants.js")
	);
	const { l } = await import(
		chrome.runtime.getURL("./logging.js")
	);
	const {
		extractCourseId,
		extractFileId
	} = await import(
		chrome.runtime.getURL("../recogniser.js")
	);



	function getRows() {
		let directory = document.querySelector("div.ef-directory");
		if (directory === null) return null;

		let header = directory.querySelector("header.ef-directory-header");
		if (header === null) {
			// Rows are not done loading.
			// Assumption: An empty folder will still have the header
			return null;
		}

		let rows = directory.querySelectorAll("div.ef-item-row");
		if (rows.length === 0) return [];

		if (
			awaitUnprocessed
			&& rows[0].getAttribute(TAG_PROCESSED) !== null
		) return null;

		return rows;
	}

	function observeToMark(courseId) {
		if (globalThis.mutationObserver !== undefined) {
			l("Already observing");
			return;
		}

		l("Observing to mark...");
		globalThis.mutationObserver = new MutationObserver(() => {
			let rows = getRows();
			if (rows === null) return;

			l("Done observing, marking...");
			markNow(courseId, rows);
		});
		globalThis.mutationObserver.observe(
			document.body,
			{
				subtree: true,
				childList: true
			}
		);
	}

	async function markNow(courseId, rows) {
		function resetStyle(element) {
			element.style = null;
		}

		if (globalThis.mutationObserver !== undefined) {
			globalThis.mutationObserver.disconnect();
			delete globalThis.mutationObserver;
		}

		let downloads = await getDownloads(courseId);
		let trackedFileIds = downloads[courseId];

		for (let row of rows) {
			row.setAttribute(TAG_PROCESSED, "");

			let anchor = row.querySelector("a.ef-name-col__link");
			if (anchor === null) continue;

			let nameHolder = row.querySelector("span.ef-name-col__text");
			if (nameHolder === null) return;

			let createdTime = row.querySelector("div.ef-date-created-col time");
			if (createdTime === null) return;

			let modifiedTime = row.querySelector("div.ef-date-modified-col time");
			if (modifiedTime === null) continue;

			let link = anchor.href;
			let fileId = extractFileId(link);
			if (fileId === -1) {
				// Likely a folder
				continue;
			}

			let fileStatus = FileStatus.NEW;
			let trackedTimestamp = trackedFileIds[fileId] ?? null;
			if (trackedTimestamp !== null) {
				// Definitely downloaded, but was it modified since?
				let modifiedDate = new Date(
					modifiedTime.getAttribute("datetime")
				);
				let trackedDate = new Date(trackedTimestamp);
				let isModified = modifiedDate > trackedDate;

				fileStatus = isModified
					? FileStatus.DOWNLOADED_MODIFIED
					: FileStatus.DOWNLOADED;
			}

			resetStyle(nameHolder);
			resetStyle(createdTime);
			resetStyle(modifiedTime);
			switch (fileStatus) {
				case FileStatus.NEW:
					nameHolder.style.color = COLOUR_HIGHLIGHT;
					nameHolder.style["font-weight"] = "bolder";

					createdTime.style.color = COLOUR_HIGHLIGHT;
					createdTime.style["font-weight"] = "bolder";

					break;
				case FileStatus.DOWNLOADED_MODIFIED:
					nameHolder.style.color = COLOUR_HIGHLIGHT;

					modifiedTime.style.color = COLOUR_HIGHLIGHT;

					break;
				case FileStatus.DOWNLOADED:
					nameHolder.style.color = COLOUR_DULL;
					nameHolder.style["font-style"] = "italic";

					modifiedTime.style.color = COLOUR_DULL;
					modifiedTime.style["font-style"] = "italic";

					break;
			}
		}
	}



	let courseId = await extractCourseId(window.location.href);
	if (courseId === -1) return;

	let rows = getRows();
	if (rows === null) {
		observeToMark(courseId);
		return;
	}

	l("Marking now...");
	markNow(courseId, rows);
}
