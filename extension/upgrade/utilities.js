/* [Imports] */
import { KEY_DEV_STORAGE, KEY_DEV_TOOLS, KEY_DOWNLOADS, KEY_DOWNLOADS_DEV } from "../constants.js";
import { d, l } from "../logging.js";
import { clearSync, getLocal, getSync, setLocal } from "../storageBase.js";



/* [Main] */
function mergeDownloads(baseDownloads, overwritingDownloads) {
	let mergedDownloads = { ...baseDownloads };
	for (let courseId in overwritingDownloads) {
		// If both downloads tracked the file (both have the key of the tracked file ID), let the
		// overwriting downloads take precedence (by spreading it after the base downloads)
		mergedDownloads[courseId] = {
			...mergedDownloads[courseId],
			...overwritingDownloads[courseId]
		};
	}
	return mergedDownloads;
}



/* [Exports] */
/*
	This upgrade is for <= V0.2.0.

	Changes:
	• Moved download tracking to unlimited local extension storage, due to pretty limited synced
	extension storage
	• Similarly, switching to dev storage is now tracked locally instead
	• Fixed values for enabling dev tools and switching to dev storage being treated as true by
	default (when no value was stored)

	Problems:
	• Users would lose existing downloads tracked in synced extension storage
	• Users are likely tracking their downloads in dev storage due to it being on ever since
	installation
	• Users may have toggled the dev options but then decided to leave them back at their "wrong"
	default state, meaning the suboptimal setting is now explicitly stored

	Solutions:
	• Transfer downloads to local extension storage, merging any new downloads (local) atop old dev
	downloads (synced) atop old downloads (synced), then clear the old downloads
	• Clear dev tools and switching to dev storage
*/
export async function tryUpgrade() {
	let oldDownloads = await getSync(KEY_DOWNLOADS);
	let oldDownloadsDev = await getSync(KEY_DOWNLOADS_DEV);
	let oldDownloadsBoth = mergeDownloads(oldDownloads, oldDownloadsDev);
	if (Object.keys(oldDownloadsBoth).length === 0) {
		// Already upgraded, or had nothing stored prior
		return;
	}

	let newDownloads = await getLocal(KEY_DOWNLOADS);
	let mergedDownloads = mergeDownloads(oldDownloadsBoth, newDownloads);
	await Promise.all([
		setLocal(
			KEY_DOWNLOADS,
			mergedDownloads
		),
		clearSync(KEY_DOWNLOADS),
		clearSync(KEY_DOWNLOADS_DEV),

		clearSync(KEY_DEV_TOOLS),
		clearSync(KEY_DEV_STORAGE)
	]);

	l("Extension upgrade complete");
	d(JSON.stringify(oldDownloads));
	d(JSON.stringify(oldDownloadsDev));
	d(oldDownloadsBoth);
	d(JSON.stringify(newDownloads));
	d(mergedDownloads);
}
