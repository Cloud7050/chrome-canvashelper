/* [Imports] */
import { COLOUR_CYAN, KEY_DEV_STORAGE } from "./constants.js";
import { get } from "./storageSync.js";



/* [Exports] */
export function getTab(tabOrId) {
	if (!Number.isInteger(tabOrId)) return tabOrId;

	return chrome.tabs.get(tabOrId);
}

export async function getLink(linkOrTabId) {
	if (!Number.isInteger(linkOrTabId)) return linkOrTabId;

	let tab = await chrome.tabs.get(linkOrTabId);
	return tab.url;
}

export async function refreshBadge() {
	let isDevStorage = await get(KEY_DEV_STORAGE);

	chrome.action.setBadgeText(
		{
			text: isDevStorage ? "DEV" : ""
		}
	);
	chrome.action.setBadgeBackgroundColor(
		{
			color: COLOUR_CYAN
		}
	);
}

export function singularPlural(count, singular, plural) {
	if (count === 1) return singular;

	return plural;
}
