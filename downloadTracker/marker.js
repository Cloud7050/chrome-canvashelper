/* [Main] */
//FIXME wait for files to load into DOM, also have a timeout
//TODO fire marking again after saved download
(async () => {
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
		chrome.runtime.getURL("./storage.js")
	);



	l("Marking...");

	let courseId = extractCourseId(window.location.href);
	if (courseId === -1) return;
	let downloads = await getDownloads(courseId);
	let trackedDownloads = downloads[courseId];

	let directory = document.querySelector("div.ef-directory");
	if (directory === null) return;

	let rows = directory.querySelectorAll("div.ef-item-row");
	for (let row of rows) {
		let anchor = row.querySelector("a.ef-name-col__link");
		if (anchor === null) continue;

		let modifiedTime = row.querySelector("div.ef-date-modified-col time");
		if (modifiedTime === null) continue;
		let modifiedDate = new Date(
			modifiedTime.getAttribute("datetime")
		);
		d("Modified "+modifiedDate)

		let link = anchor.href;
		let fileId = extractFileId(link);
		if (fileId === -1) {
			// Likely a folder
			continue;
		}

		let isNew = true;
		let isModified = true;
		let trackedTimestamp = trackedDownloads[fileId] ?? null;
		if (trackedTimestamp !== null) {
			let trackedDate = new Date(trackedTimestamp);
			d("    Tracked "+trackedDate)
			isNew = false;
			isModified = modifiedDate > trackedDate;
		}

		let nameHolder = row.querySelector("span.ef-name-col__text");
		if (nameHolder !== null) {
			let nameHolderStyle = nameHolder.style;
			if (isNew || isModified) {
				nameHolderStyle.color = "#FFAA00";
				if (isNew) nameHolderStyle["font-weight"] = "bolder";
			} else {
				nameHolderStyle.color = null;
				nameHolderStyle["font-weight"] = null;
			}
		}

		let createdTime = row.querySelector("div.ef-date-created-col time");
		if (createdTime !== null) {
			let createdTimeStyle = createdTime.style;
			if (isNew) {
				createdTimeStyle.color = "#FFAA00";
				createdTimeStyle["font-weight"] = "bolder";
			} else {
				createdTimeStyle.color = null;
				createdTimeStyle["font-weight"] = null;
			}
		}

		let modifiedTimeStyle = modifiedTime.style;
		if (isNew || isModified) {
			modifiedTimeStyle.color = "#FFAA00";
			if (isNew) modifiedTimeStyle["font-weight"] = "bolder";
		} else {
			modifiedTimeStyle.color = null;
			modifiedTimeStyle["font-weight"] = null;
		}
	}
})();
