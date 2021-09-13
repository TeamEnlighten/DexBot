"use strict";Object.defineProperty(exports, "__esModule", {value: true}); const Rulesets = {
	teampreview: {
		inherit: true,
		onBattleStart() {
			// Xerneas isn't in DLC1 but operated this way pre-1.3.2 update
			const formesToLeak = ["zaciancrowned", "zamazentacrowned", "xerneas"];
			for (const pokemon of this.getAllPokemon()) {
				if (!formesToLeak.includes(this.toID(pokemon.baseSpecies.name))) continue;
				const newDetails = pokemon.details.replace(', shiny', '');
				this.add('updatepoke', pokemon, newDetails);
			}
		},
	},
}; exports.Rulesets = Rulesets;

 //# sourceMappingURL=sourceMaps/rulesets.js.map