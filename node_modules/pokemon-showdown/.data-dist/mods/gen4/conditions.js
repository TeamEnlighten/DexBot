"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } const Conditions = {
	brn: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 6,
	},
	par: {
		inherit: true,
		onBeforeMove(pokemon) {
			if (!pokemon.hasAbility('magicguard') && this.randomChance(1, 4)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		effectType: 'Status',
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.effectType === 'Move') {
				this.add('-status', target, 'slp', '[from] move: ' + sourceEffect.name);
			} else {
				this.add('-status', target, 'slp');
			}
			// 1-4 turns
			this.effectState.time = this.random(2, 6);
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusState.time--;
			}
			pokemon.statusState.time--;
			if (pokemon.statusState.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},
	psn: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 6,
	},
	tox: {
		inherit: true,
		onResidualOrder: 10,
		onResidualSubOrder: 6,
	},
	confusion: {
		inherit: true,
		onBeforeMove(pokemon) {
			pokemon.volatiles['confusion'].time--;
			if (!pokemon.volatiles['confusion'].time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.randomChance(1, 2)) {
				return;
			}
			const damage = this.actions.getDamage(pokemon, pokemon, 40);
			if (typeof damage !== 'number') throw new Error("Confusion damage not dealt");
			this.damage(damage, pokemon, pokemon, {
				id: 'confused',
				effectType: 'Move',
				type: '???',
			} );
			return false;
		},
	},
	frz: {
		inherit: true,
		onBeforeMove(pokemon, target, move) {
			if (this.randomChance(1, 5)) {
				pokemon.cureStatus();
				return;
			}
			if (move.flags['defrost']) return;
			this.add('cant', pokemon, 'frz');
			return false;
		},
	},
	substitutebroken: {
		noCopy: true,
	},
	trapped: {
		inherit: true,
		noCopy: false,
	},
	trapper: {
		inherit: true,
		noCopy: false,
	},
	partiallytrapped: {
		inherit: true,
		durationCallback(target, source) {
			if (source.hasItem('gripclaw')) return 6;
			return this.random(3, 7);
		},
		onResidualOrder: 10,
		onResidualSubOrder: 9,
	},
	futuremove: {
		inherit: true,
		onResidualOrder: 11,
	},
	stall: {
		// In gen 3-4, the chance of protect succeeding does not fall below 1/8.
		// See http://upokecenter.dreamhosters.com/dex/?lang=en&move=182
		inherit: true,
		counterMax: 8,
	},
	raindance: {
		inherit: true,
		onFieldResidualOrder: 8,
	},
	sunnyday: {
		inherit: true,
		onFieldResidualOrder: 8,
	},
	sandstorm: {
		inherit: true,
		onFieldResidualOrder: 8,
	},
	hail: {
		inherit: true,
		onFieldResidualOrder: 8,
	},
	// Arceus's true typing for all its formes is Normal, and it's only Multitype
	// that changes its type, but its formes are specified to be their corresponding
	// type in the Pokedex, so that needs to be overridden. Without Multitype it
	// starts as Normal type, but its type can be changed by other effects.
	// This is mainly relevant for Hackmons Cup and Balanced Hackmons.
	arceus: {
		name: 'Arceus',
		onBeforeSwitchIn(pokemon) {
			pokemon.setType('Normal'); // Multitype will prevent this
		},
		onSwitchIn(pokemon) {
			if (pokemon.ability === 'multitype') {
				const item = pokemon.getItem();
				const targetForme = (_optionalChain([item, 'optionalAccess', _ => _.onPlate]) ? 'Arceus-' + item.onPlate : 'Arceus');
				if (pokemon.species.name !== targetForme) {
					pokemon.formeChange(targetForme);
				}
			}
		},
	},
}; exports.Conditions = Conditions;

 //# sourceMappingURL=sourceMaps/conditions.js.map