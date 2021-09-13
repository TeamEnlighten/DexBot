"use strict";Object.defineProperty(exports, "__esModule", {value: true});/**
 * Dex Data
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */
var _lib = require('../.lib-dist');

/**
* Converts anything to an ID. An ID must have only lowercase alphanumeric
* characters.
*
* If a string is passed, it will be converted to lowercase and
* non-alphanumeric characters will be stripped.
*
* If an object with an ID is passed, its ID will be returned.
* Otherwise, an empty string will be returned.
*
* Generally assigned to the global toID, because of how
* commonly it's used.
*/
 function toID(text) {
	// The sucrase transformation of optional chaining is too expensive to be used in a hot function like this.
	/* eslint-disable @typescript-eslint/prefer-optional-chain */
	if (text && text.id) {
		text = text.id;
	} else if (text && text.userid) {
		text = text.userid;
	} else if (text && text.roomid) {
		text = text.roomid;
	}
	if (typeof text !== 'string' && typeof text !== 'number') return '';
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '') ;
	/* eslint-enable @typescript-eslint/prefer-optional-chain */
} exports.toID = toID;

 class BasicEffect  {
	/**
	 * ID. This will be a lowercase version of the name with all the
	 * non-alphanumeric characters removed. So, for instance, "Mr. Mime"
	 * becomes "mrmime", and "Basculin-Blue-Striped" becomes
	 * "basculinbluestriped".
	 */
	
	/**
	 * Name. Currently does not support Unicode letters, so "Flabébé"
	 * is "Flabebe" and "Nidoran♀" is "Nidoran-F".
	 */
	
	/**
	 * Full name. Prefixes the name with the effect type. For instance,
	 * Leftovers would be "item: Leftovers", confusion the status
	 * condition would be "confusion", etc.
	 */
	
	/** Effect type. */
	
	/**
	 * Does it exist? For historical reasons, when you use an accessor
	 * for an effect that doesn't exist, you get a dummy effect that
	 * doesn't do anything, and this field set to false.
	 */
	
	/**
	 * Dex number? For a Pokemon, this is the National Dex number. For
	 * other effects, this is often an internal ID (e.g. a move
	 * number). Not all effects have numbers, this will be 0 if it
	 * doesn't. Nonstandard effects (e.g. CAP effects) will have
	 * negative numbers.
	 */
	
	/**
	 * The generation of Pokemon game this was INTRODUCED (NOT
	 * necessarily the current gen being simulated.) Not all effects
	 * track generation; this will be 0 if not known.
	 */
	
	/**
	 * A shortened form of the description of this effect.
	 * Not all effects have this.
	 */
	
	/** The full description for this effect. */
	
	/**
	 * Is this item/move/ability/pokemon nonstandard? Specified for effects
	 * that have no use in standard formats: made-up pokemon (CAP),
	 * glitches (MissingNo etc), Pokestar pokemon, etc.
	 */
	
	/** The duration of the condition - only for pure conditions. */
	
	/** Whether or not the condition is ignored by Baton Pass - only for pure conditions. */
	
	/** Whether or not the condition affects fainted Pokemon. */
	
	/** Moves only: what status does it set? */
	
	/** Moves only: what weather does it set? */
	
	/** ??? */
	

	constructor(data) {
		this.exists = true;
		Object.assign(this, data);

		this.name = _lib.Utils.getString(data.name).trim();
		this.id = data.realMove ? toID(data.realMove) : toID(this.name); // Hidden Power hack
		this.fullname = _lib.Utils.getString(data.fullname) || this.name;
		this.effectType = _lib.Utils.getString(data.effectType)  || 'Condition';
		this.exists = !!(this.exists && this.id);
		this.num = data.num || 0;
		this.gen = data.gen || 0;
		this.shortDesc = data.shortDesc || '';
		this.desc = data.desc || '';
		this.isNonstandard = data.isNonstandard || null;
		this.duration = data.duration;
		this.noCopy = !!data.noCopy;
		this.affectsFainted = !!data.affectsFainted;
		this.status = data.status  || undefined;
		this.weather = data.weather  || undefined;
		this.sourceEffect = data.sourceEffect || '';
	}

	toString() {
		return this.name;
	}
} exports.BasicEffect = BasicEffect;

 class Nature extends BasicEffect  {
	
	
	
	constructor(data) {
		super(data);
		data = this;

		this.fullname = `nature: ${this.name}`;
		this.effectType = 'Nature';
		this.gen = 3;
		this.plus = data.plus || undefined;
		this.minus = data.minus || undefined;
	}
} exports.Nature = Nature;

 class DexNatures {
	
	 __init() {this.natureCache = new Map()}
	__init2() {this.allCache = null}

	constructor(dex) {;DexNatures.prototype.__init.call(this);DexNatures.prototype.__init2.call(this);
		this.dex = dex;
	}

	get(name) {
		if (name && typeof name !== 'string') return name;

		return this.getByID(toID(name));
	}
	getByID(id) {
		let nature = this.natureCache.get(id);
		if (nature) return nature;

		if (this.dex.data.Aliases.hasOwnProperty(id)) {
			nature = this.get(this.dex.data.Aliases[id]);
			if (nature.exists) {
				this.natureCache.set(id, nature);
			}
			return nature;
		}
		if (id && this.dex.data.Natures.hasOwnProperty(id)) {
			const natureData = this.dex.data.Natures[id];
			nature = new Nature(natureData);
			if (nature.gen > this.dex.gen) nature.isNonstandard = 'Future';
		} else {
			nature = new Nature({name: id, exists: false});
		}

		if (nature.exists) this.natureCache.set(id, nature);
		return nature;
	}

	all() {
		if (this.allCache) return this.allCache;
		const natures = [];
		for (const id in this.dex.data.Natures) {
			natures.push(this.getByID(id ));
		}
		this.allCache = natures;
		return this.allCache;
	}
} exports.DexNatures = DexNatures;



 class TypeInfo  {
	/**
	 * ID. This will be a lowercase version of the name with all the
	 * non-alphanumeric characters removed. e.g. 'flying'
	 */
	
	/** Name. e.g. 'Flying' */
	
	/** Effect type. */
	
	/**
	 * Does it exist? For historical reasons, when you use an accessor
	 * for an effect that doesn't exist, you get a dummy effect that
	 * doesn't do anything, and this field set to false.
	 */
	
	/**
	 * The generation of Pokemon game this was INTRODUCED (NOT
	 * necessarily the current gen being simulated.) Not all effects
	 * track generation; this will be 0 if not known.
	 */
	
	/**
	 * Set to 'Future' for types before they're released (like Fairy
	 * in Gen 5 or Dark in Gen 1).
	 */
	
	/**
	 * Type chart, attackingTypeName:result, effectid:result
	 * result is: 0 = normal, 1 = weakness, 2 = resistance, 3 = immunity
	 */
	
	/** The IVs to get this Type Hidden Power (in gen 3 and later) */
	
	/** The DVs to get this Type Hidden Power (in gen 2). */
	

	constructor(data) {
		this.exists = true;
		Object.assign(this, data);

		this.name = data.name;
		this.id = data.id;
		this.effectType = _lib.Utils.getString(data.effectType)  || 'Type';
		this.exists = !!(this.exists && this.id);
		this.gen = data.gen || 0;
		this.isNonstandard = data.isNonstandard || null;
		this.damageTaken = data.damageTaken || {};
		this.HPivs = data.HPivs || {};
		this.HPdvs = data.HPdvs || {};
	}

	toString() {
		return this.name;
	}
} exports.TypeInfo = TypeInfo;

 class DexTypes {
	
	 __init3() {this.typeCache = new Map()}
	__init4() {this.allCache = null}
	__init5() {this.namesCache = null}

	constructor(dex) {;DexTypes.prototype.__init3.call(this);DexTypes.prototype.__init4.call(this);DexTypes.prototype.__init5.call(this);
		this.dex = dex;
	}

	get(name) {
		if (name && typeof name !== 'string') return name;
		return this.getByID(toID(name));
	}

	getByID(id) {
		let type = this.typeCache.get(id);
		if (type) return type;

		const typeName = id.charAt(0).toUpperCase() + id.substr(1);
		if (typeName && this.dex.data.TypeChart.hasOwnProperty(id)) {
			type = new TypeInfo({name: typeName, id, ...this.dex.data.TypeChart[id]});
		} else {
			type = new TypeInfo({name: typeName, id, exists: false, effectType: 'EffectType'});
		}

		if (type.exists) this.typeCache.set(id, type);
		return type;
	}

	names() {
		if (this.namesCache) return this.namesCache;

		this.namesCache = this.all().filter(type => !type.isNonstandard).map(type => type.name);

		return this.namesCache;
	}

	isName(name) {
		const id = name.toLowerCase();
		const typeName = id.charAt(0).toUpperCase() + id.substr(1);
		return name === typeName && this.dex.data.TypeChart.hasOwnProperty(id);
	}

	all() {
		if (this.allCache) return this.allCache;
		const types = [];
		for (const id in this.dex.data.TypeChart) {
			types.push(this.getByID(id ));
		}
		this.allCache = types;
		return this.allCache;
	}
} exports.DexTypes = DexTypes;

const idsCache = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const reverseCache = {
	__proto: null ,
	"hitpoints": 'hp',
	"attack": 'atk',
	"defense": 'def',
	"specialattack": 'spa', "spatk": 'spa', "spattack": 'spa', "specialatk": 'spa',
	"special": 'spa', "spc": 'spa',
	"specialdefense": 'spd', "spdef": 'spd', "spdefense": 'spd', "specialdef": 'spd',
	"speed": 'spe',
};
 class DexStats {
	
	
	
	constructor(dex) {
		if (dex.gen !== 1) {
			this.shortNames = {
				__proto__: null, hp: "HP", atk: "Atk", def: "Def", spa: "SpA", spd: "SpD", spe: "Spe",
			} ;
			this.mediumNames = {
				__proto__: null, hp: "HP", atk: "Attack", def: "Defense", spa: "Sp. Atk", spd: "Sp. Def", spe: "Speed",
			} ;
			this.names = {
				__proto__: null, hp: "HP", atk: "Attack", def: "Defense", spa: "Special Attack", spd: "Special Defense", spe: "Speed",
			} ;
		} else {
			this.shortNames = {
				__proto__: null, hp: "HP", atk: "Atk", def: "Def", spa: "Spc", spd: "[SpD]", spe: "Spe",
			} ;
			this.mediumNames = {
				__proto__: null, hp: "HP", atk: "Attack", def: "Defense", spa: "Special", spd: "[Sp. Def]", spe: "Speed",
			} ;
			this.names = {
				__proto__: null, hp: "HP", atk: "Attack", def: "Defense", spa: "Special", spd: "[Special Defense]", spe: "Speed",
			} ;
		}
	}
	getID(name) {
		if (name === 'Spd') return 'spe' ;
		const id = toID(name);
		if (reverseCache[id]) return reverseCache[id];
		if (idsCache.includes(id )) return id ;
		return null;
	}
	ids() {
		return idsCache;
	}
} exports.DexStats = DexStats;

 //# sourceMappingURL=sourceMaps/dex-data.js.map