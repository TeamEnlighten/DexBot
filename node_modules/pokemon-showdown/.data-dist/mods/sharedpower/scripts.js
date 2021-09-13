"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } const Scripts = {
	gen: 8,
	field: {
		suppressingWeather() {
			for (const pokemon of this.battle.getAllActive()) {
				const innates = Object.keys(pokemon.volatiles).filter(x => x.startsWith('ability:'));
				if (pokemon && !pokemon.ignoringAbility() &&
					(pokemon.getAbility().suppressWeather || innates.some(x => this.battle.dex.abilities.get(x).suppressWeather))) {
					return true;
				}
			}
			return false;
		},
	},
	pokemon: {
		hasAbility(ability) {
			if (this.ignoringAbility()) return false;
			if (Array.isArray(ability)) return ability.some(abil => this.hasAbility(abil));
			const abilityid = this.battle.toID(ability);
			return this.ability === abilityid || !!this.volatiles['ability:' + abilityid];
		},
		ignoringAbility() {
			// Check if any active pokemon have the ability Neutralizing Gas
			let neutralizinggas = false;
			for (const pokemon of this.battle.getAllActive()) {
				// can't use hasAbility because it would lead to infinite recursion
				if (
					(pokemon.ability === ('neutralizinggas' ) || _optionalChain([pokemon, 'access', _ => _.m, 'access', _2 => _2.abils, 'optionalAccess', _3 => _3.includes, 'call', _4 => _4('ability:neutralizinggas')])) &&
					!pokemon.volatiles['gastroacid'] && !pokemon.abilityState.ending
				) {
					neutralizinggas = true;
					break;
				}
			}

			return !!(
				(this.battle.gen >= 5 && !this.isActive) ||
				((this.volatiles['gastroacid'] ||
					(neutralizinggas && (this.ability !== ('neutralizinggas' ) ||
						_optionalChain([this, 'access', _5 => _5.m, 'access', _6 => _6.abils, 'optionalAccess', _7 => _7.includes, 'call', _8 => _8('ability:neutralizinggas')]))
					)) && !this.getAbility().isPermanent
				)
			);
		},
	},
}; exports.Scripts = Scripts;

 //# sourceMappingURL=sourceMaps/scripts.js.map