import { lint } from './src/linter';

let globalObject = (() => {
	if (typeof self !== 'undefined') {
		return self;
	} else if (typeof window !== 'undefined') {
		return window;
	} else if (typeof global !== 'undefined') {
		return global;
	} else {
		return Function('return this')();
	}
})();

globalObject.lint = lint;
