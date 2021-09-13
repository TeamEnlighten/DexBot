"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * Utils library
 *
 * Miscellaneous utility functions that don't really have a better place.
 *
 * It'll always be a judgment call whether or not a function goes into a
 * "catch-all" library like this, so here are some guidelines:
 *
 * - It must not have any dependencies
 *
 * - It must conceivably have a use in a wide variety of projects, not just
 *   Pokémon (if it's Pokémon-specific, Dex is probably a good place for it)
 *
 * - A lot of Chat functions are kind of iffy, but I'm going to say for now
 *   that if it's English-specific, it should be left out of here.
 */



/**
 * Safely converts the passed variable into a string. Unlike '' + str,
 * String(str), or str.toString(), Utils.getString is guaranteed not to
 * crash.
 *
 * Specifically, the fear with untrusted JSON is an object like:
 *
 *     let a = {"toString": "this is not a function"};
 *     console.log(`a is ${a}`);
 *
 * This will crash (because a.toString() is not a function). Instead,
 * getString simply returns '' if the passed variable isn't a
 * string or a number.
 */

 function getString(str) {
	return (typeof str === 'string' || typeof str === 'number') ? '' + str : '';
} exports.getString = getString;

 function escapeRegex(str) {
	return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
} exports.escapeRegex = escapeRegex;

/**
 * Escapes HTML in a string.
*/
 function escapeHTML(str) {
	if (str === null || str === undefined) return '';
	return ('' + str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;')
		.replace(/\//g, '&#x2f;')
		.replace(/\n/g, '<br />');
} exports.escapeHTML = escapeHTML;

/**
 * Strips HTML from a string.
 */
 function stripHTML(htmlContent) {
	if (!htmlContent) return '';
	return htmlContent.replace(/<[^>]*>/g, '');
} exports.stripHTML = stripHTML;

/**
 * Visualizes eval output in a slightly more readable form
 */
 function visualize(value, depth = 0) {
	if (value === undefined) return `undefined`;
	if (value === null) return `null`;
	if (typeof value === 'number' || typeof value === 'boolean') {
		return `${value}`;
	}
	if (typeof value === 'string') {
		return `"${value}"`; // NOT ESCAPED
	}
	if (typeof value === 'symbol') {
		return value.toString();
	}
	if (Array.isArray(value)) {
		if (depth > 10) return `[array]`;
		return `[` + value.map(elem => visualize(elem, depth + 1)).join(`, `) + `]`;
	}
	if (value instanceof RegExp || value instanceof Date || value instanceof Function) {
		if (depth && value instanceof Function) return `Function`;
		return `${value}`;
	}
	let constructor = '';
	if (value.constructor && value.constructor.name && typeof value.constructor.name === 'string') {
		constructor = value.constructor.name;
		if (constructor === 'Object') constructor = '';
	} else {
		constructor = 'null';
	}
	// If it has a toString, try to grab the base class from there
	// (This is for Map/Set subclasses like user.auth)
	const baseClass = (_optionalChain([value, 'optionalAccess', _ => _.toString]) && _optionalChain([/\[object (.*)\]/, 'access', _2 => _2.exec, 'call', _3 => _3(value.toString()), 'optionalAccess', _4 => _4[1]])) || constructor;

	switch (baseClass) {
	case 'Map':
		if (depth > 2) return `Map`;
		const mapped = [...value.entries()].map(
			val => `${visualize(val[0], depth + 1)} => ${visualize(val[1], depth + 1)}`
		);
		return `${constructor} (${value.size}) { ${mapped.join(', ')} }`;
	case 'Set':
		if (depth > 2) return `Set`;
		return `${constructor} (${value.size}) { ${[...value].map(v => visualize(v), depth + 1).join(', ')} }`;
	}

	if (value.toString) {
		try {
			const stringValue = value.toString();
			if (typeof stringValue === 'string' &&
					stringValue !== '[object Object]' &&
					stringValue !== `[object ${constructor}]`) {
				return `${constructor}(${stringValue})`;
			}
		} catch (e) {}
	}
	let buf = '';
	for (const key in value) {
		if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
		if (depth > 2 || (depth && constructor)) {
			buf = '...';
			break;
		}
		if (buf) buf += `, `;
		let displayedKey = key;
		if (!/^[A-Za-z0-9_$]+$/.test(key)) displayedKey = JSON.stringify(key);
		buf += `${displayedKey}: ` + visualize(value[key], depth + 1);
	}
	if (constructor && !buf && constructor !== 'null') return constructor;
	return `${constructor}{${buf}}`;
} exports.visualize = visualize;

/**
 * Compares two variables; intended to be used as a smarter comparator.
 * The two variables must be the same type (TypeScript will not check this).
 *
 * - Numbers are sorted low-to-high, use `-val` to reverse
 * - Strings are sorted A to Z case-semi-insensitively, use `{reverse: val}` to reverse
 * - Booleans are sorted true-first (REVERSE of casting to numbers), use `!val` to reverse
 * - Arrays are sorted lexically in the order of their elements
 *
 * In other words: `[num, str]` will be sorted A to Z, `[num, {reverse: str}]` will be sorted Z to A.
 */
 function compare(a, b) {
	if (typeof a === 'number') {
		return a - (b );
	}
	if (typeof a === 'string') {
		return a.localeCompare(b );
	}
	if (typeof a === 'boolean') {
		return (a ? 1 : 2) - (b ? 1 : 2);
	}
	if (Array.isArray(a)) {
		for (let i = 0; i < a.length; i++) {
			const comparison = compare(a[i], (b )[i]);
			if (comparison) return comparison;
		}
		return 0;
	}
	if ('reverse' in a) {
		return compare((b ).reverse, a.reverse);
	}
	throw new Error(`Passed value ${a} is not comparable`);
} exports.compare = compare;

/**
 * Sorts an array according to the callback's output on its elements.
 *
 * The callback's output is compared according to `PSUtils.compare`
 * (numbers low to high, strings A-Z, booleans true-first, arrays in order).
 */









 function sortBy(array, callback) {
	if (!callback) return (array ).sort(compare);
	return array.sort((a, b) => compare(callback(a), callback(b)));
} exports.sortBy = sortBy;





/**
* Like string.split(delimiter), but only recognizes the first `limit`
* delimiters (default 1).
*
* `"1 2 3 4".split(" ", 2) => ["1", "2"]`
*
* `Utils.splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
*
* Returns an array of length exactly limit + 1.
*
*/
 function splitFirst(str, delimiter, limit = 1) {
	const splitStr = [];
	while (splitStr.length < limit) {
		const delimiterIndex = str.indexOf(delimiter);
		if (delimiterIndex >= 0) {
			splitStr.push(str.slice(0, delimiterIndex));
			str = str.slice(delimiterIndex + delimiter.length);
		} else {
			splitStr.push(str);
			str = '';
		}
	}
	splitStr.push(str);
	return splitStr;
} exports.splitFirst = splitFirst;

/**
 * Template string tag function for escaping HTML
 */
 function html(strings, ...args) {
	let buf = strings[0];
	let i = 0;
	while (i < args.length) {
		buf += escapeHTML(args[i]);
		buf += strings[++i];
	}
	return buf;
} exports.html = html;

/**
 * This combines escapeHTML and forceWrap. The combination allows us to use
 * <wbr /> instead of U+200B, which will make sure the word-wrapping hints
 * can't be copy/pasted (which would mess up code).
 */
 function escapeHTMLForceWrap(text) {
	return escapeHTML(forceWrap(text)).replace(/\u200B/g, '<wbr />');
} exports.escapeHTMLForceWrap = escapeHTMLForceWrap;

/**
 * HTML doesn't support `word-wrap: break-word` in tables, but sometimes it
 * would be really nice if it did. This emulates `word-wrap: break-word` by
 * manually inserting U+200B to tell long words to wrap.
 */
 function forceWrap(text) {
	return text.replace(/[^\s]{30,}/g, word => {
		let lastBreak = 0;
		let brokenWord = '';
		for (let i = 1; i < word.length; i++) {
			if (i - lastBreak >= 10 || /[^a-zA-Z0-9([{][a-zA-Z0-9]/.test(word.slice(i - 1, i + 1))) {
				brokenWord += word.slice(lastBreak, i) + '\u200B';
				lastBreak = i;
			}
		}
		brokenWord += word.slice(lastBreak);
		return brokenWord;
	});
} exports.forceWrap = forceWrap;

 function shuffle(arr) {
	// In-place shuffle by Fisher-Yates algorithm
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
} exports.shuffle = shuffle;

 function randomElement(arr) {
	const i = Math.floor(Math.random() * arr.length);
	return arr[i];
} exports.randomElement = randomElement;

/** Forces num to be an integer (between min and max). */
 function clampIntRange(num, min, max) {
	if (typeof num !== 'number') num = 0;
	num = Math.floor(num);
	if (min !== undefined && num < min) num = min;
	if (max !== undefined && num > max) num = max;
	return num;
} exports.clampIntRange = clampIntRange;

 function clearRequireCache(options = {}) {
	const excludes = _optionalChain([options, 'optionalAccess', _5 => _5.exclude]) || [];
	excludes.push('/node_modules/');

	for (const path in require.cache) {
		let skip = false;
		for (const exclude of excludes) {
			if (path.includes(exclude)) {
				skip = true;
				break;
			}
		}

		if (!skip) delete require.cache[path];
	}
} exports.clearRequireCache = clearRequireCache;

 function deepClone(obj) {
	if (obj === null || typeof obj !== 'object') return obj;
	if (Array.isArray(obj)) return obj.map(prop => deepClone(prop));
	const clone = Object.create(Object.getPrototypeOf(obj));
	for (const key of Object.keys(obj)) {
		clone[key] = deepClone(obj[key]);
	}
	return clone;
} exports.deepClone = deepClone;

 function levenshtein(s, t, l) {
	// Original levenshtein distance function by James Westgate, turned out to be the fastest
	const d = [];

	// Step 1
	const n = s.length;
	const m = t.length;

	if (n === 0) return m;
	if (m === 0) return n;
	if (l && Math.abs(m - n) > l) return Math.abs(m - n);

	// Create an array of arrays in javascript (a descending loop is quicker)
	for (let i = n; i >= 0; i--) d[i] = [];

	// Step 2
	for (let i = n; i >= 0; i--) d[i][0] = i;
	for (let j = m; j >= 0; j--) d[0][j] = j;

	// Step 3
	for (let i = 1; i <= n; i++) {
		const si = s.charAt(i - 1);

		// Step 4
		for (let j = 1; j <= m; j++) {
			// Check the jagged ld total so far
			if (i === j && d[i][j] > 4) return n;

			const tj = t.charAt(j - 1);
			const cost = (si === tj) ? 0 : 1; // Step 5

			// Calculate the minimum
			let mi = d[i - 1][j] + 1;
			const b = d[i][j - 1] + 1;
			const c = d[i - 1][j - 1] + cost;

			if (b < mi) mi = b;
			if (c < mi) mi = c;

			d[i][j] = mi; // Step 6
		}
	}

	// Step 7
	return d[n][m];
} exports.levenshtein = levenshtein;

 function waitUntil(time) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), time - Date.now());
	});
} exports.waitUntil = waitUntil;

 class Multiset extends Map {
	add(key) {
		this.set(key, (_nullishCoalesce(this.get(key), () => ( 0))) + 1);
		return this;
	}
	remove(key) {
		const newValue = (_nullishCoalesce(this.get(key), () => ( 0))) - 1;
		if (newValue <= 0) return this.delete(key);
		this.set(key, newValue);
		return true;
	}
} exports.Multiset = Multiset;

// backwards compatibility
 const Utils = {
	waitUntil, html, escapeHTML,
	compare, sortBy, levenshtein,
	shuffle, deepClone, clearRequireCache,
	randomElement, forceWrap, splitFirst,
	stripHTML, visualize, getString,
	escapeRegex, Multiset,
}; exports.Utils = Utils;

 //# sourceMappingURL=sourceMaps/utils.js.map