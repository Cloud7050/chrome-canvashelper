/* [Imports] */
import { KEY_DEV_STORAGE } from "../constants.js";
import { clearDownloads } from "../downloadTracker/storage.js";
import { markAllTabs } from "../downloadTracker/utilities.js";
import { get, set } from "../storageSync.js";
import { refreshBadge } from "../utilities.js";



/* [Main] */
let devStorageCheckbox = document.querySelector("#devStorage");
let clearDownloadsButton = document.querySelector("#clearDownloads");

get(KEY_DEV_STORAGE)
	.then(
		(isDevStorage) => {
			devStorageCheckbox.checked = isDevStorage;
		}
	);

devStorageCheckbox.addEventListener(
	"click",
	async (_mouseEvent) => {
		await set(
			KEY_DEV_STORAGE,
			devStorageCheckbox.checked
		);
		refreshBadge();

		markAllTabs();
	}
);
clearDownloadsButton.addEventListener(
	"click",
	async (_mouseEvent) => {
		await clearDownloads();

		markAllTabs();
	}
);
