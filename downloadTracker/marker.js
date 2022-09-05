/* [Main] */
//FIXME wait for files to load into DOM, also have a timeout
//TODO fire marking again after saved download
(async () => {
	const { ORANGE } = await import(
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
		let trackedTimestamp = trackedDownloads[fileId] ?? null;
		if (trackedTimestamp !== null) {
			let trackedDate = new Date(trackedTimestamp);
			isNew = false;
			isModified = modifiedDate > trackedDate;
		}

		if (isNew || isModified) {
			nameHolder.style.color = ORANGE;

			if (isNew) {
				createdTime.style.color = ORANGE;

				nameHolder.style["font-weight"] = "bolder";
				createdTime.style["font-weight"] = "bolder";
			} else modifiedTime.style.color = ORANGE;
		} else {
			nameHolder.style.color = null;
			nameHolder.style["font-weight"] = null;

			createdTime.style.color = null;
			createdTime.style["font-weight"] = null;

			modifiedTime.style.color = null;
		}
	}
})();
