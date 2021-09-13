"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// Gen 2 Stadium fixes Dragon Fang and Dragon Scale having the wrong effects.
 const Items = {
	dragonfang: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _ => _.type]) === 'Dragon') {
				return damage * 1.1;
			}
		},
	},
	dragonscale: {
		inherit: true,
		onBasePower() {},
	},
}; exports.Items = Items;

 //# sourceMappingURL=sourceMaps/items.js.map