"use strict";Object.defineProperty(exports, "__esModule", {value: true});
var _dexdata = require('./dex-data');

















 class Item extends _dexdata.BasicEffect  {
	

	/** just controls location on the item spritesheet */
	

	/**
	 * A Move-like object depicting what happens when Fling is used on
	 * this item.
	 */
	
	/**
	 * If this is a Drive: The type it turns Techno Blast into.
	 * undefined, if not a Drive.
	 */
	
	/**
	 * If this is a Memory: The type it turns Multi-Attack into.
	 * undefined, if not a Memory.
	 */
	
	/**
	 * If this is a mega stone: The name (e.g. Charizard-Mega-X) of the
	 * forme this allows transformation into.
	 * undefined, if not a mega stone.
	 */
	
	/**
	 * If this is a mega stone: The name (e.g. Charizard) of the
	 * forme this allows transformation from.
	 * undefined, if not a mega stone.
	 */
	
	/**
	 * If this is a Z crystal: true if the Z Crystal is generic
	 * (e.g. Firium Z). If species-specific, the name
	 * (e.g. Inferno Overdrive) of the Z Move this crystal allows
	 * the use of.
	 * undefined, if not a Z crystal.
	 */
	
	/**
	 * If this is a generic Z crystal: The type (e.g. Fire) of the
	 * Z Move this crystal allows the use of (e.g. Fire)
	 * undefined, if not a generic Z crystal
	 */
	
	/**
	 * If this is a species-specific Z crystal: The name
	 * (e.g. Play Rough) of the move this crystal requires its
	 * holder to know to use its Z move.
	 * undefined, if not a species-specific Z crystal
	 */
	
	/**
	 * If this is a species-specific Z crystal: An array of the
	 * species of Pokemon that can use this crystal's Z move.
	 * Note that these are the full names, e.g. 'Mimikyu-Busted'
	 * undefined, if not a species-specific Z crystal
	 */
	
	/** Is this item a Berry? */
	
	/** Whether or not this item ignores the Klutz ability. */
	
	/** The type the holder will change into if it is an Arceus. */
	
	/** Is this item a Gem? */
	
	/** Is this item a Pokeball? */
	

	
	
	
	
	
	

	
	
	

	constructor(data) {
		super(data);
		data = this;

		this.fullname = `item: ${this.name}`;
		this.effectType = 'Item';
		this.fling = data.fling || undefined;
		this.onDrive = data.onDrive || undefined;
		this.onMemory = data.onMemory || undefined;
		this.megaStone = data.megaStone || undefined;
		this.megaEvolves = data.megaEvolves || undefined;
		this.zMove = data.zMove || undefined;
		this.zMoveType = data.zMoveType || undefined;
		this.zMoveFrom = data.zMoveFrom || undefined;
		this.itemUser = data.itemUser || undefined;
		this.isBerry = !!data.isBerry;
		this.ignoreKlutz = !!data.ignoreKlutz;
		this.onPlate = data.onPlate || undefined;
		this.isGem = !!data.isGem;
		this.isPokeball = !!data.isPokeball;

		if (!this.gen) {
			if (this.num >= 689) {
				this.gen = 7;
			} else if (this.num >= 577) {
				this.gen = 6;
			} else if (this.num >= 537) {
				this.gen = 5;
			} else if (this.num >= 377) {
				this.gen = 4;
			} else {
				this.gen = 3;
			}
			// Due to difference in gen 2 item numbering, gen 2 items must be
			// specified manually
		}

		if (this.isBerry) this.fling = {basePower: 10};
		if (this.id.endsWith('plate')) this.fling = {basePower: 90};
		if (this.onDrive) this.fling = {basePower: 70};
		if (this.megaStone) this.fling = {basePower: 80};
		if (this.onMemory) this.fling = {basePower: 50};
	}
} exports.Item = Item;

 class DexItems {
	
	 __init() {this.itemCache = new Map()}
	__init2() {this.allCache = null}

	constructor(dex) {;DexItems.prototype.__init.call(this);DexItems.prototype.__init2.call(this);
		this.dex = dex;
	}

	get(name) {
		if (name && typeof name !== 'string') return name;

		name = (name || '').trim();
		const id = _dexdata.toID.call(void 0, name);
		return this.getByID(id);
	}

	getByID(id) {
		let item = this.itemCache.get(id);
		if (item) return item;
		if (this.dex.data.Aliases.hasOwnProperty(id)) {
			item = this.get(this.dex.data.Aliases[id]);
			if (item.exists) {
				this.itemCache.set(id, item);
			}
			return item;
		}
		if (id && !this.dex.data.Items[id] && this.dex.data.Items[id + 'berry']) {
			item = this.getByID(id + 'berry' );
			this.itemCache.set(id, item);
			return item;
		}
		if (id && this.dex.data.Items.hasOwnProperty(id)) {
			const itemData = this.dex.data.Items[id] ;
			const itemTextData = this.dex.getDescs('Items', id, itemData);
			item = new Item({
				name: id,
				...itemData,
				...itemTextData,
			});
			if (item.gen > this.dex.gen) {
				(item ).isNonstandard = 'Future';
			}
			// hack for allowing mega evolution in LGPE
			if (this.dex.currentMod === 'letsgo' && !item.isNonstandard && !item.megaStone) {
				(item ).isNonstandard = 'Past';
			}
		} else {
			item = new Item({name: id, exists: false});
		}

		if (item.exists) this.itemCache.set(id, item);
		return item;
	}

	all() {
		if (this.allCache) return this.allCache;
		const items = [];
		for (const id in this.dex.data.Items) {
			items.push(this.getByID(id ));
		}
		this.allCache = items;
		return this.allCache;
	}
} exports.DexItems = DexItems;

 //# sourceMappingURL=sourceMaps/dex-items.js.map