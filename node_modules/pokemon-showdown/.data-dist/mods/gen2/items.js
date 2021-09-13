"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } const Items = {
	berryjuice: {
		inherit: true,
		isNonstandard: null,
	},
	blackbelt: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _ => _.type]) === 'Fighting') {
				return damage * 1.1;
			}
		},
	},
	blackglasses: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _2 => _2.type]) === 'Dark') {
				return damage * 1.1;
			}
		},
	},
	brightpowder: {
		inherit: true,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy - 20;
		},
	},
	charcoal: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _3 => _3.type]) === 'Fire') {
				return damage * 1.1;
			}
		},
	},
	dragonfang: {
		inherit: true,
		onBasePower() {},
	},
	dragonscale: {
		inherit: true,
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _4 => _4.type]) === 'Dragon') {
				return damage * 1.1;
			}
		},
	},
	focusband: {
		inherit: true,
		onDamage(damage, target, source, effect) {
			if (this.randomChance(30, 256) && damage >= target.hp && effect && effect.effectType === 'Move') {
				this.add('-activate', target, 'item: Focus Band');
				return target.hp - 1;
			}
		},
	},
	hardstone: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _5 => _5.type]) === 'Rock') {
				return damage * 1.1;
			}
		},
	},
	kingsrock: {
		inherit: true,
		onModifyMove(move) {
			const affectedByKingsRock = [
				'absorb', 'aeroblast', 'barrage', 'beatup', 'bide', 'bonerush', 'bonemerang', 'cometpunch', 'counter', 'crabhammer', 'crosschop', 'cut', 'dig', 'doublekick', 'doubleslap', 'doubleedge', 'dragonrage', 'drillpeck', 'eggbomb', 'explosion', 'extremespeed', 'falseswipe', 'feintattack', 'flail', 'fly', 'frustration', 'furyattack', 'furycutter', 'furyswipes', 'gigadrain', 'hiddenpower', 'highjumpkick', 'hornattack', 'hydropump', 'jumpkick', 'karatechop', 'leechlife', 'machpunch', 'magnitude', 'megadrain', 'megakick', 'megapunch', 'megahorn', 'mirrorcoat', 'nightshade', 'outrage', 'payday', 'peck', 'petaldance', 'pinmissile', 'pound', 'present', 'pursuit', 'psywave', 'quickattack', 'rage', 'rapidspin', 'razorleaf', 'razorwind', 'return', 'reversal', 'rockthrow', 'rollout', 'scratch', 'seismictoss', 'selfdestruct', 'skullbash', 'skyattack', 'slam', 'slash', 'snore', 'solarbeam', 'sonicboom', 'spikecannon', 'strength', 'struggle', 'submission', 'superfang', 'surf', 'swift', 'tackle', 'takedown', 'thief', 'thrash', 'triplekick', 'twineedle', 'visegrip', 'vinewhip', 'vitalthrow', 'watergun', 'waterfall', 'wingattack',
			];
			if (affectedByKingsRock.includes(move.id)) {
				if (!move.secondaries) move.secondaries = [];
				// The kingsrock flag allows for differentiation from Snore,
				// which can flinch and is also affected by King's Rock
				move.secondaries.push({
					chance: 12,
					volatileStatus: 'flinch',
					kingsrock: true,
				});
			}
		},
	},
	leftovers: {
		inherit: true,
		onResidualOrder: 5,
		onResidualSubOrder: 1,
	},
	lightball: {
		inherit: true,
		// In Gen 2 this happens in stat calculation directly.
		onModifySpA() {},
	},
	luckypunch: {
		inherit: true,
		onModifyCritRatioPriority: -1,
		onModifyCritRatio(critRatio, user) {
			if (user.species.name === 'Chansey') {
				return 3;
			}
		},
	},
	magnet: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _6 => _6.type]) === 'Electric') {
				return damage * 1.1;
			}
		},
	},
	metalcoat: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _7 => _7.type]) === 'Steel') {
				return damage * 1.1;
			}
		},
	},
	metalpowder: {
		inherit: true,
		// In Gen 2 this happens in stat calculation directly.
		onModifyDef() {},
		onModifySpD() {},
	},
	miracleseed: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _8 => _8.type]) === 'Grass') {
				return damage * 1.1;
			}
		},
	},
	mysticwater: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _9 => _9.type]) === 'Water') {
				return damage * 1.1;
			}
		},
	},
	nevermeltice: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _10 => _10.type]) === 'Ice') {
				return damage * 1.1;
			}
		},
	},
	poisonbarb: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _11 => _11.type]) === 'Poison') {
				return damage * 1.1;
			}
		},
	},
	sharpbeak: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _12 => _12.type]) === 'Flying') {
				return damage * 1.1;
			}
		},
	},
	silverpowder: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _13 => _13.type]) === 'Bug') {
				return damage * 1.1;
			}
		},
	},
	softsand: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _14 => _14.type]) === 'Ground') {
				return damage * 1.1;
			}
		},
	},
	spelltag: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _15 => _15.type]) === 'Ghost') {
				return damage * 1.1;
			}
		},
	},
	stick: {
		inherit: true,
		onModifyCritRatioPriority: -1,
		onModifyCritRatio(critRatio, user) {
			if (user.species.id === 'farfetchd') {
				return 3;
			}
		},
	},
	thickclub: {
		inherit: true,
		// In Gen 2 this happens in stat calculation directly.
		onModifyAtk() {},
	},
	twistedspoon: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _16 => _16.type]) === 'Psychic') {
				return damage * 1.1;
			}
		},
	},
	berserkgene: {
		inherit: true,
		isNonstandard: null,
	},
	berry: {
		inherit: true,
		isNonstandard: null,
	},
	bitterberry: {
		inherit: true,
		isNonstandard: null,
	},
	burntberry: {
		inherit: true,
		isNonstandard: null,
	},
	goldberry: {
		inherit: true,
		isNonstandard: null,
	},
	iceberry: {
		inherit: true,
		isNonstandard: null,
	},
	mintberry: {
		inherit: true,
		isNonstandard: null,
	},
	miracleberry: {
		inherit: true,
		isNonstandard: null,
	},
	mysteryberry: {
		inherit: true,
		isNonstandard: null,
	},
	pinkbow: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _17 => _17.type]) === 'Normal') {
				return damage * 1.1;
			}
		},
		isNonstandard: null,
	},
	polkadotbow: {
		inherit: true,
		onBasePower() {},
		onModifyDamage(damage, source, target, move) {
			if (_optionalChain([move, 'optionalAccess', _18 => _18.type]) === 'Normal') {
				return damage * 1.1;
			}
		},
		isNonstandard: null,
	},
	przcureberry: {
		inherit: true,
		isNonstandard: null,
	},
	psncureberry: {
		inherit: true,
		isNonstandard: null,
	},
}; exports.Items = Items;

 //# sourceMappingURL=sourceMaps/items.js.map