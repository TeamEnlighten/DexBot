"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * Teams
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Functions for converting and generating teams.
 *
 * @license MIT
 */

var _dex = require('./dex');





























































































 const Teams = new class Teams {
	pack(team) {
		if (!team) return '';

		function getIv(ivs, s) {
			return ivs[s] === 31 || ivs[s] === undefined ? '' : ivs[s].toString();
		}

		let buf = '';
		for (const set of team) {
			if (buf) buf += ']';

			// name
			buf += (set.name || set.species);

			// species
			const id = this.packName(set.species || set.name);
			buf += '|' + (this.packName(set.name || set.species) === id ? '' : id);

			// item
			buf += '|' + this.packName(set.item);

			// ability
			buf += '|' + this.packName(set.ability);

			// moves
			buf += '|' + set.moves.map(this.packName).join(',');

			// nature
			buf += '|' + (set.nature || '');

			// evs
			let evs = '|';
			if (set.evs) {
				evs = '|' + (set.evs['hp'] || '') + ',' + (set.evs['atk'] || '') + ',' + (set.evs['def'] || '') + ',' + (set.evs['spa'] || '') + ',' + (set.evs['spd'] || '') + ',' + (set.evs['spe'] || '');
			}
			if (evs === '|,,,,,') {
				buf += '|';
			} else {
				buf += evs;
			}

			// gender
			if (set.gender) {
				buf += '|' + set.gender;
			} else {
				buf += '|';
			}

			// ivs
			let ivs = '|';
			if (set.ivs) {
				ivs = '|' + getIv(set.ivs, 'hp') + ',' + getIv(set.ivs, 'atk') + ',' + getIv(set.ivs, 'def') +
					',' + getIv(set.ivs, 'spa') + ',' + getIv(set.ivs, 'spd') + ',' + getIv(set.ivs, 'spe');
			}
			if (ivs === '|,,,,,') {
				buf += '|';
			} else {
				buf += ivs;
			}

			// shiny
			if (set.shiny) {
				buf += '|S';
			} else {
				buf += '|';
			}

			// level
			if (set.level && set.level !== 100) {
				buf += '|' + set.level;
			} else {
				buf += '|';
			}

			// happiness
			if (set.happiness !== undefined && set.happiness !== 255) {
				buf += '|' + set.happiness;
			} else {
				buf += '|';
			}

			if (set.pokeball || set.hpType || set.gigantamax) {
				buf += ',' + (set.hpType || '');
				buf += ',' + this.packName(set.pokeball || '');
				buf += ',' + (set.gigantamax ? 'G' : '');
			}
		}

		return buf;
	}

	unpack(buf) {
		if (!buf) return null;
		if (typeof buf !== 'string') return buf;
		if (buf.startsWith('[') && buf.endsWith(']')) {
			buf = this.pack(JSON.parse(buf));
		}

		const team = [];
		let i = 0;
		let j = 0;

		// limit to 24
		for (let count = 0; count < 24; count++) {
			const set = {} ;
			team.push(set);

			// name
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.name = buf.substring(i, j);
			i = j + 1;

			// species
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.species = this.unpackName(buf.substring(i, j), _dex.Dex.species) || set.name;
			i = j + 1;

			// item
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.item = this.unpackName(buf.substring(i, j), _dex.Dex.items);
			i = j + 1;

			// ability
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			const ability = buf.substring(i, j);
			const species = _dex.Dex.species.get(set.species);
			set.ability = ['', '0', '1', 'H', 'S'].includes(ability) ?
				species.abilities[ability  || '0'] || (ability === '' ? '' : '!!!ERROR!!!') :
				this.unpackName(ability, _dex.Dex.abilities);
			i = j + 1;

			// moves
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.moves = buf.substring(i, j).split(',', 24).map(name => this.unpackName(name, _dex.Dex.moves));
			i = j + 1;

			// nature
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			set.nature = this.unpackName(buf.substring(i, j), _dex.Dex.natures);
			i = j + 1;

			// evs
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (j !== i) {
				const evs = buf.substring(i, j).split(',', 6);
				set.evs = {
					hp: Number(evs[0]) || 0,
					atk: Number(evs[1]) || 0,
					def: Number(evs[2]) || 0,
					spa: Number(evs[3]) || 0,
					spd: Number(evs[4]) || 0,
					spe: Number(evs[5]) || 0,
				};
			}
			i = j + 1;

			// gender
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.gender = buf.substring(i, j);
			i = j + 1;

			// ivs
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (j !== i) {
				const ivs = buf.substring(i, j).split(',', 6);
				set.ivs = {
					hp: ivs[0] === '' ? 31 : Number(ivs[0]) || 0,
					atk: ivs[1] === '' ? 31 : Number(ivs[1]) || 0,
					def: ivs[2] === '' ? 31 : Number(ivs[2]) || 0,
					spa: ivs[3] === '' ? 31 : Number(ivs[3]) || 0,
					spd: ivs[4] === '' ? 31 : Number(ivs[4]) || 0,
					spe: ivs[5] === '' ? 31 : Number(ivs[5]) || 0,
				};
			}
			i = j + 1;

			// shiny
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.shiny = true;
			i = j + 1;

			// level
			j = buf.indexOf('|', i);
			if (j < 0) return null;
			if (i !== j) set.level = parseInt(buf.substring(i, j));
			i = j + 1;

			// happiness
			j = buf.indexOf(']', i);
			let misc;
			if (j < 0) {
				if (i < buf.length) misc = buf.substring(i).split(',', 4);
			} else {
				if (i !== j) misc = buf.substring(i, j).split(',', 4);
			}
			if (misc) {
				set.happiness = (misc[0] ? Number(misc[0]) : 255);
				set.hpType = misc[1] || '';
				set.pokeball = this.unpackName(misc[2] || '', _dex.Dex.items);
				set.gigantamax = !!misc[3];
			}
			if (j < 0) break;
			i = j + 1;
		}

		return team;
	}

	/** Very similar to toID but without the lowercase conversion */
	packName(name) {
		if (!name) return '';
		return name.replace(/[^A-Za-z0-9]+/g, '');
	}

	/** Will not entirely recover a packed name, but will be a pretty readable guess */
	unpackName(name, dexTable) {
		if (!name) return '';
		if (dexTable) {
			const obj = dexTable.get(name);
			if (obj.exists) return obj.name;
		}
		return name.replace(/([0-9]+)/g, ' $1 ').replace(/([A-Z])/g, ' $1').replace(/[ ][ ]/g, ' ').trim();
	}

	/**
	 * Exports a team in human-readable PS export format
	 */
	export(team, options) {
		let output = '';
		for (const set of team) {
			output += this.exportSet(set, options) + `\n`;
		}
		return output;
	}

	exportSet(set, {hideStats} = {}) {
		let out = ``;

		// core
		if (set.name && set.name !== set.species) {
			out += `${set.name} (${set.species})`;
		} else {
			out += set.species;
		}
		if (set.gender === 'M') out += ` (M)`;
		if (set.gender === 'F') out += ` (F)`;
		if (set.item) out += ` @ ${set.item}`;
		out += `  \n`;

		if (set.ability) {
			out += `Ability: ${set.ability}  \n`;
		}

		// details
		if (set.level && set.level !== 100) {
			out += `Level: ${set.level}  \n`;
		}
		if (set.shiny) {
			out += `Shiny: Yes  \n`;
		}
		if (typeof set.happiness === `number` && set.happiness !== 255 && !isNaN(set.happiness)) {
			out += `Happiness: ${set.happiness}  \n`;
		}
		if (set.pokeball) {
			out += `Pokeball: ${set.pokeball}  \n`;
		}
		if (set.hpType) {
			out += `Hidden Power: ${set.hpType}  \n`;
		}
		if (set.gigantamax) {
			out += `Gigantamax: Yes  \n`;
		}

		// stats
		if (!hideStats) {
			if (set.evs) {
				const stats = _dex.Dex.stats.ids().map(
					stat => set.evs[stat] ?
						`${set.evs[stat]} ${_dex.Dex.stats.shortNames[stat]}` : ``
				).filter(Boolean);
				if (stats.length) {
					out += `EVs: ${stats.join(" / ")}  \n`;
				}
			}
			if (set.nature) {
				out += `${set.nature} Nature  \n`;
			}
			if (set.ivs) {
				const stats = _dex.Dex.stats.ids().map(
					stat => (set.ivs[stat] !== 31 && set.ivs[stat] !== undefined) ?
						`${set.ivs[stat] || 0} ${_dex.Dex.stats.shortNames[stat]}` : ``
				).filter(Boolean);
				if (stats.length) {
					out += `IVs: ${stats.join(" / ")}  \n`;
				}
			}
		}

		// moves
		for (let move of set.moves) {
			if (move.startsWith(`Hidden Power `) && move.charAt(13) !== '[') {
				move = `Hidden Power [${move.slice(13)}]`;
			}
			out += `- ${move}  \n`;
		}

		return out;
	}

	parseExportedTeamLine(line, isFirstLine, set) {
		if (isFirstLine) {
			let item;
			[line, item] = line.split(' @ ');
			if (item) {
				set.item = item;
				if (_dex.toID.call(void 0, set.item) === 'noitem') set.item = '';
			}
			if (line.endsWith(' (M)')) {
				set.gender = 'M';
				line = line.slice(0, -4);
			}
			if (line.endsWith(' (F)')) {
				set.gender = 'F';
				line = line.slice(0, -4);
			}
			if (line.endsWith(')') && line.includes('(')) {
				const [name, species] = line.slice(0, -1).split('(');
				set.species = _dex.Dex.species.get(species).name;
				set.name = name.trim();
			} else {
				set.species = _dex.Dex.species.get(line).name;
				set.name = '';
			}
		} else if (line.startsWith('Trait: ')) {
			line = line.slice(7);
			set.ability = line;
		} else if (line.startsWith('Ability: ')) {
			line = line.slice(9);
			set.ability = line;
		} else if (line === 'Shiny: Yes') {
			set.shiny = true;
		} else if (line.startsWith('Level: ')) {
			line = line.slice(7);
			set.level = +line;
		} else if (line.startsWith('Happiness: ')) {
			line = line.slice(11);
			set.happiness = +line;
		} else if (line.startsWith('Pokeball: ')) {
			line = line.slice(10);
			set.pokeball = line;
		} else if (line.startsWith('Hidden Power: ')) {
			line = line.slice(14);
			set.hpType = line;
		} else if (line === 'Gigantamax: Yes') {
			set.gigantamax = true;
		} else if (line.startsWith('EVs: ')) {
			line = line.slice(5);
			const evLines = line.split('/');
			set.evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
			for (const evLine of evLines) {
				const [statValue, statName] = evLine.trim().split(' ');
				const statid = _dex.Dex.stats.getID(statName);
				if (!statid) continue;
				const value = parseInt(statValue);
				set.evs[statid] = value;
			}
		} else if (line.startsWith('IVs: ')) {
			line = line.slice(5);
			const ivLines = line.split('/');
			set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
			for (const ivLine of ivLines) {
				const [statValue, statName] = ivLine.trim().split(' ');
				const statid = _dex.Dex.stats.getID(statName);
				if (!statid) continue;
				let value = parseInt(statValue);
				if (isNaN(value)) value = 31;
				set.ivs[statid] = value;
			}
		} else if (/^[A-Za-z]+ (N|n)ature/.test(line)) {
			let natureIndex = line.indexOf(' Nature');
			if (natureIndex === -1) natureIndex = line.indexOf(' nature');
			if (natureIndex === -1) return;
			line = line.substr(0, natureIndex);
			if (line !== 'undefined') set.nature = line;
		} else if (line.startsWith('-') || line.startsWith('~')) {
			line = line.slice(line.charAt(1) === ' ' ? 2 : 1);
			if (line.startsWith('Hidden Power [')) {
				const hpType = line.slice(14, -1);
				line = 'Hidden Power ' + hpType;
				if (!set.ivs && _dex.Dex.types.isName(hpType)) {
					set.ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
					const hpIVs = _dex.Dex.types.get(hpType).HPivs || {};
					for (const statid in hpIVs) {
						set.ivs[statid ] = hpIVs[statid ];
					}
				}
			}
			if (line === 'Frustration' && set.happiness === undefined) {
				set.happiness = 0;
			}
			set.moves.push(line);
		}
	}
	/** Accepts a team in any format (JSON, packed, or exported) */
	import(buffer) {
		if (buffer.startsWith('[')) {
			try {
				const team = JSON.parse(buffer);
				if (!Array.isArray(team)) throw new Error(`Team should be an Array but isn't`);
				for (const set of team) {
					set.name = _dex.Dex.getName(set.name);
					set.species = _dex.Dex.getName(set.species);
					set.item = _dex.Dex.getName(set.item);
					set.ability = _dex.Dex.getName(set.ability);
					set.gender = _dex.Dex.getName(set.gender);
					set.nature = _dex.Dex.getName(set.nature);
					const evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
					if (set.evs) {
						for (const statid in evs) {
							if (typeof set.evs[statid] === 'number') evs[statid ] = set.evs[statid];
						}
					}
					set.evs = evs;
					const ivs = {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31};
					if (set.ivs) {
						for (const statid in ivs) {
							if (typeof set.ivs[statid] === 'number') ivs[statid ] = set.ivs[statid];
						}
					}
					set.ivs = ivs;
					if (!Array.isArray(set.moves)) {
						set.moves = [];
					} else {
						set.moves = set.moves.map(_dex.Dex.getName);
					}
				}
				return team;
			} catch (e) {}
		}

		const lines = buffer.split("\n");

		const sets = [];
		let curSet = null;

		while (lines.length && !lines[0]) lines.shift();
		while (lines.length && !lines[lines.length - 1]) lines.pop();

		if (lines.length === 1 && lines[0].includes('|')) {
			return this.unpack(lines[0]);
		}
		for (let line of lines) {
			line = line.trim();
			if (line === '' || line === '---') {
				curSet = null;
			} else if (line.startsWith('===')) {
				// team backup format; ignore
			} else if (!curSet) {
				curSet = {
					name: '', species: '', item: '', ability: '', gender: '',
					nature: '',
					evs: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
					ivs: {hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31},
					level: 100,
					moves: [],
				};
				sets.push(curSet);
				this.parseExportedTeamLine(line, true, curSet);
			} else {
				this.parseExportedTeamLine(line, false, curSet);
			}
		}
		return sets;
	}

	getGenerator(format, seed = null) {
		const TeamGenerator = require(_dex.Dex.forFormat(format).dataDir + '/random-teams').default;
		return new TeamGenerator(format, seed);
	}

	generate(format, options = null) {
		return this.getGenerator(format, _optionalChain([options, 'optionalAccess', _ => _.seed])).getTeam(options);
	}
}; exports.Teams = Teams;

exports. default = exports.Teams;

 //# sourceMappingURL=sourceMaps/teams.js.map