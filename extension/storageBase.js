/* [Main] */
let { sync, local } = chrome.storage;

async function get(storageArea, key, defaultValue = {}) {
	let result = await storageArea.get(key);
	if (result === {}) return null;

	let object = result[key] ?? defaultValue;
	return object;
}

function set(storageArea, key, value) {
	return storageArea.set(
		{
			[key]: value
		}
	);
}

function clear(storageArea, key) {
	return storageArea.remove(key);
}



/* [Exports] */
export function getSync(key, defaultValue = undefined) {
	return get(sync, key, defaultValue);
}

export function setSync(key, value) {
	return set(sync, key, value);
}

export function clearSync(key) {
	return clear(sync, key);
}

export function getLocal(key, defaultValue = undefined) {
	return get(local, key, defaultValue);
}

export function setLocal(key, value) {
	return set(local, key, value);
}

export function clearLocal(key) {
	return clear(local, key);
}
