"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } const Rulesets = {
	obtainablemoves: {
		inherit: true,
		banlist: [
			// https://www.smogon.com/forums/threads/implementing-all-old-gens-in-ps-testers-required.3483261/post-5420130
			// confirmed by Marty
			'Kakuna + Poison Sting + Harden', 'Kakuna + String Shot + Harden',
			'Beedrill + Poison Sting + Harden', 'Beedrill + String Shot + Harden',

			// https://www.smogon.com/forums/threads/rby-and-gsc-illegal-movesets.78638/
			'Nidoking + Fury Attack + Thrash',
			'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp',
			'Eevee + Tackle + Growl',
			'Vaporeon + Tackle + Growl',
			'Jolteon + Tackle + Growl', 'Jolteon + Focus Energy + Thunder Shock',
			'Flareon + Tackle + Growl', 'Flareon + Focus Energy + Ember',
		],
	},
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: [
			'Hypnosis + Mean Look',
			'Hypnosis + Spider Web',
			'Lovely Kiss + Mean Look',
			'Lovely Kiss + Spider Web',
			'Sing + Mean Look',
			'Sing + Spider Web',
			'Sleep Powder + Mean Look',
			'Sleep Powder + Spider Web',
			'Spore + Mean Look',
			'Spore + Spider Web',
		],
	},
	nintendocup2000movelegality: {
		effectType: 'ValidatorRule',
		name: 'Nintendo Cup 2000 Move Legality',
		desc: "Prevents Pok\u00e9mon from having moves that would only be obtainable in Pok\u00e9mon Crystal.",
		onValidateSet(set) {
			const illegalCombos = {
				arbok: {crunch: 'E'},
				sandslash: {metalclaw: 'E'},
				golduck: {crosschop: 'E'},
				marowak: {swordsdance: 'E'},
				electabuzz: {crosschop: 'E'},
				magmar: {crosschop: 'E'},
				jolteon: {batonpass: 'L'},
				vaporeon: {batonpass: 'L'},
				flareon: {batonpass: 'L'},
				espeon: {batonpass: 'L'},
				umbreon: {batonpass: 'L'},
				dragonite: {extremespeed: 'S'},
				meganium: {swordsdance: 'E'},
				typhlosion: {submission: 'E'},
				ariados: {agility: 'L'},
				yanma: {wingattack: 'L'},
				murkrow: {skyattack: 'E'},
				qwilfish: {spikes: 'L'},
				sneasel: {metalclaw: 'L'},
				ursaring: {metalclaw: 'E'},
				piloswine: {amnesia: 'L'},
				skarmory: {skyattack: 'E'},
				donphan: {watergun: 'E'},
				suicune: {aurorabeam: 'L'},
				dugtrio: {triattack: 'L'},
				magneton: {triattack: 'L'},
				cloyster: {spikes: 'L'},
			};
			const notUsableAsTM = ['icebeam', 'flamethrower', 'thunderbolt'];
			const species = this.dex.species.get(set.species || set.name);
			const learnsetData = {...(_optionalChain([this, 'access', _ => _.dex, 'access', _2 => _2.data, 'access', _3 => _3.Learnsets, 'access', _4 => _4[species.id], 'optionalAccess', _5 => _5.learnset]) || {})};
			const legalityList = illegalCombos[species.id];
			if (!legalityList) return;
			const problems = [];
			let prevo = species.prevo;
			while (prevo) {
				const prevoSpecies = this.dex.species.get(prevo);
				const prevoLsetData = _optionalChain([this, 'access', _6 => _6.dex, 'access', _7 => _7.data, 'access', _8 => _8.Learnsets, 'access', _9 => _9[prevoSpecies.id], 'optionalAccess', _10 => _10.learnset]) || {};
				for (const moveid in prevoLsetData) {
					if (!(moveid in learnsetData)) {
						learnsetData[moveid] = prevoLsetData[moveid];
					} else {
						learnsetData[moveid].push(...prevoLsetData[moveid]);
					}
				}
				prevo = prevoSpecies.prevo;
			}
			for (const moveid of set.moves.map(this.toID)) {
				// Diglett Magnemite Shellder
				if (!learnsetData[moveid]) continue;
				const list = learnsetData[moveid].filter(x => !x.includes(legalityList[moveid]));
				if (!list.length) {
					switch (legalityList[moveid]) {
					case 'L':
						// Converted to a set to remove duplicate entries
						const levels = new Set(learnsetData[moveid].filter(x => x.includes(legalityList[moveid])).map(x => x.slice(2)));
						problems.push(
							`${species.name} can't learn ${this.dex.moves.get(moveid).name}.`,
							`(It learns ${this.dex.moves.get(moveid).name} in Pok\u00e9mon Crystal at the following levels: ${[...levels].join(', ')})`
						);
						break;
					case 'S':
						problems.push(
							`${species.name} can't learn ${this.dex.moves.get(moveid).name}.`,
							`(It only learns ${this.dex.moves.get(moveid).name} in Pok\u00e9mon Crystal via special in-game events.)`
						);
						break;
					case 'E':
						problems.push(
							`${species.name} can't learn ${this.dex.moves.get(moveid).name}.`,
							`(It only learns ${this.dex.moves.get(moveid).name} as an egg move in Pok\u00e9mon Crystal only.)`
						);
						break;
					}
				}
				for (const id of notUsableAsTM) {
					if (moveid === id && learnsetData[id] && !learnsetData[id].filter(x => !x.includes('2T')).length) {
						problems.push(`${species.name} can't learn ${this.dex.moves.get(id).name}.`);
					}
				}
			}
			if (problems.some(x => notUsableAsTM.map(y => this.dex.moves.get(y).name).some(z => x.includes(z)))) {
				problems.push(
					`(${notUsableAsTM.map(y => this.dex.moves.get(y).name).join(' / ')} aren't learnable outside of Pok\u00e9mon Crystal.)`
				);
			}
			return problems;
		},
	},
}; exports.Rulesets = Rulesets;

 //# sourceMappingURL=sourceMaps/rulesets.js.map