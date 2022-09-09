/* [Imports] */
import { COLOUR_CYAN } from "./constants.js";
import { getDevStorage } from "./storage.js";



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
	let isDevStorage = await getDevStorage();

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
