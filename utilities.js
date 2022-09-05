/* [Exports] */
export function l(content, group = false) {
	let consoleFunction = (!group) ? console.log : console.group;
	consoleFunction(
		// Skip instanceof check for type object + class String from new String()s
		(typeof content !== "string")
			? content
			: `>>> ${content}`
	);
}

export function w(content) {
	console.warn(
		(typeof content !== "string")
			? content
			: `[!] ${content}!`
	);
}

export function e(content) {
	console.error(
		(typeof content !== "string")
			? content
			: `ERR ${content}!`
	);
}

export function d(content) {
	console.debug(
		(typeof content !== "string")
			? content
			: `*** ${content}`
	);
}
