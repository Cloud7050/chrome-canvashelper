/* [Imports] */
import { MESSAGE_DOWNLOADS_CHANGED } from "./constants.js";
import { markAllTabs } from "./downloadTracker/utilities.js";



/* [Exports] */
export function notifyDownloadsChanged() {
	//NOTE The message isn't sent to the frame calling this, so if the frame also needs to act on
	// the event elsewhere, that code needs to be run manually
	chrome.runtime
		.sendMessage(
			undefined,
			MESSAGE_DOWNLOADS_CHANGED
		)
		.catch((_error) => {
			// Errors when sending a message while nothing is listening
		});

	markAllTabs();
}

export function onDownloadsChanged(callback) {
	chrome.runtime.onMessage.addListener(
		(message, _sender, _sendResponse) => {
			if (message !== MESSAGE_DOWNLOADS_CHANGED) return;

			callback();
		}
	);
}
