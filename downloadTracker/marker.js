/* [Exports] */
export async function mark(awaitUnprocessed) {
	const {
		TAG_PROCESSED,
		COLOUR_HIGHLIGHT
	} = await import(
		chrome.runtime.getURL("./downloadTracker/constants.js")
	);
	const {
		extractCourseId,
		extractFileId
	} = await import(
		chrome.runtime.getURL("./downloadTracker/utilities.js")
	);
	const { l, d } = await import(
		chrome.runtime.getURL("./utilities.js")
	);
	const { getDownloads } = await import(
		chrome.runtime.getURL("./downloadTracker/storage.js")
	);



	function getRows() {
		let directory = document.querySelector("div.ef-directory");
		if (directory === null) return null;

		let rows = directory.querySelectorAll("div.ef-item-row");
		if (rows.length === 0) {
			// Limitation: An actually empty folder is thought to still be loading its files
			return null;
		}

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
		let mutationObserver = new MutationObserver(() => {
			let rows = getRows();
			if (rows === null) return;

			l("Done observing, marking...");
			markNow(courseId, rows);
		});
		mutationObserver.observe(
			document.body,
			{
				subtree: true,
				childList: true
			}
		);
		globalThis.mutationObserver = mutationObserver;
	}

	async function markNow(courseId, rows) {
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
			let modifiedDate = new Date(
				modifiedTime.getAttribute("datetime")
			);

			let link = anchor.href;
			let fileId = extractFileId(link);
			if (fileId === -1) {
				// Likely a folder
				continue;
			}

			let isNew = true;
			let isModified = true;
			let trackedTimestamp = trackedFileIds[fileId] ?? null;
			if (trackedTimestamp !== null) {
				let trackedDate = new Date(trackedTimestamp);
				isNew = false;
				isModified = modifiedDate > trackedDate;
			}

			// Reset styles
			nameHolder.style.color = null;
			nameHolder.style["font-weight"] = null;

			createdTime.style.color = null;
			createdTime.style["font-weight"] = null;

			modifiedTime.style.color = null;

			if (isNew || isModified) {
				nameHolder.style.color = COLOUR_HIGHLIGHT;

				if (isNew) {
					createdTime.style.color = COLOUR_HIGHLIGHT;

					nameHolder.style["font-weight"] = "bolder";
					createdTime.style["font-weight"] = "bolder";
				} else modifiedTime.style.color = COLOUR_HIGHLIGHT;
			}
		}
	}



	let courseId = extractCourseId(window.location.href);
	if (courseId === -1) return;

	let rows = getRows();
	if (rows === null) {
		observeToMark(courseId);
		return;
	}

	l("Marking now...");
	markNow(courseId, rows);
}
