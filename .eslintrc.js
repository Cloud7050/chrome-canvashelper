/* eslint-env node */



module.exports = {
	"extends": ["./.eslintrc.base.js"],

	"root": true,
	"globals": {
		chrome: "readonly",
		React: "readonly",
		ReactDOM: "readonly"
	},

	"overrides": [
		{
			"files": ["*.jsx"],

			"extends": ["./.eslintrc.react.js"]
		}
	]
};
