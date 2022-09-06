/* eslint-env node */



module.exports = {
	"extends": ["plugin:react/recommended", "plugin:react-hooks/recommended"],

	"globals": {
		React: "readonly",
		ReactDOM: "readonly"
	},

	"rules": {
		// [React Recommended]
		"react/display-name": 1,
		"react/jsx-key": 1,
		"react/jsx-no-comment-textnodes": 1,
		"react/jsx-no-duplicate-props": 1,
		"react/jsx-no-target-blank": 1,
		"react/jsx-no-undef": 1,
		"react/jsx-uses-react": 1,
		"react/jsx-uses-vars": 1,
		"react/no-children-prop": 1,
		"react/no-danger-with-children": 1,
		"react/no-deprecated": 1,
		"react/no-direct-mutation-state": 1,
		"react/no-find-dom-node": 1,
		"react/no-is-mounted": 1,
		"react/no-render-return-value": 1,
		"react/no-string-refs": 1,
		"react/no-unescaped-entities": 1,
		"react/no-unknown-property": 1,
		"react/prop-types": 1,
		"react/react-in-jsx-scope": 1,
		"react/require-render-return": 1,

		// [React Hooks Recommended]
		"react-hooks/rules-of-hooks": 1,
		"react-hooks/exhaustive-deps": 1
	}
};
