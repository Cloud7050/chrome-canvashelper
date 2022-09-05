/* [Main] */
(async () => {
	const { mark } = await import(
		chrome.runtime.getURL("./downloadTracker/marker.js")
	);



	mark(true);
})();
