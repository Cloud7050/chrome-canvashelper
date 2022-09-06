/* [Exports] */
export function clearAll() {
	return chrome.storage.sync.clear();
}

export async function get(key, defaultValue = {}) {
	let result = await chrome.storage.sync.get(key);
	if (result === {}) return null;

	let object = result[key] ?? defaultValue;
	return object;
}

export function set(key, value) {
	return chrome.storage.sync.set(
		{
			[key]: value
		}
	);
}

export function clear(key) {
	return chrome.storage.sync.remove(key);
}
