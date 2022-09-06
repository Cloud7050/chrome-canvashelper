/* [Imports] */
import { l } from "../logging.js";
import { isQuizResults } from "../recogniser.js";



/* [Exports] */
export function checkForQuizResults(tab) {
	let isRelevant = isQuizResults(tab.url);
	if (!isRelevant) return;

	//TODO context menu for only this tab, and ensure remove once navigate away
	l("Found quiz results tab");

	// let quizId = extractQuizId(tab.url);

	// chrome.scripting.executeScript({
	// 	target: {
	// 		tabId: tab.id
	// 	},
	// 	files: ["./quizTransferer/extractor.js"]
	// });
	// l(`Extracting for quiz ${quizId}...`);
}

export function checkForQuizOngoing(tab) {
	//TODO
}

export function checkForQuiz(tab) {
	checkForQuizResults(tab);
	checkForQuizOngoing(tab);
}

export async function checkAllTabs() {
	let tabs = await chrome.tabs.query({});
	for (let tab of tabs) checkForQuiz(tab);
}
