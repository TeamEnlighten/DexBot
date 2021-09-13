"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _fs = require('../.lib-dist/fs');






 const SECTIONLEADER_SYMBOL = '\u25B8'; exports.SECTIONLEADER_SYMBOL = SECTIONLEADER_SYMBOL;
 const PLAYER_SYMBOL = '\u2606'; exports.PLAYER_SYMBOL = PLAYER_SYMBOL;
 const HOST_SYMBOL = '\u2605'; exports.HOST_SYMBOL = HOST_SYMBOL;

 const ROOM_PERMISSIONS = [
	'addhtml', 'announce', 'ban', 'bypassafktimer', 'declare', 'editprivacy', 'editroom', 'exportinputlog', 'game', 'gamemanagement', 'gamemoderation', 'joinbattle', 'kick', 'minigame', 'modchat', 'modlog', 'mute', 'nooverride', 'receiveauthmessages', 'roombot', 'roomdriver', 'roommod', 'roomowner', 'roomsectionleader', 'roomvoice', 'roomprizewinner', 'show', 'showmedia', 'timer', 'tournaments', 'warn',
] ; exports.ROOM_PERMISSIONS = ROOM_PERMISSIONS;

 const GLOBAL_PERMISSIONS = [
	// administrative
	'bypassall', 'console', 'disableladder', 'lockdown', 'potd',
	// other
	'addhtml', 'alts', 'altsself', 'autotimer', 'globalban', 'bypassblocks', 'bypassafktimer', 'forcepromote', 'forcerename', 'forcewin', 'gdeclare', 'hiderank', 'ignorelimits', 'importinputlog', 'ip', 'ipself', 'lock', 'makeroom', 'modlog', 'rangeban', 'promote',
] ; exports.GLOBAL_PERMISSIONS = GLOBAL_PERMISSIONS;





















/**
 * Auth table - a Map for which users are in which groups.
 *
 * Notice that auth.get will return the default group symbol if the
 * user isn't in a group.
 */
 class Auth extends Map {
	/**
	 * Will return the default group symbol if the user isn't in a group.
	 *
	 * Passing a User will read `user.group`, which is relevant for unregistered
	 * users with temporary global auth.
	 */
	get(user) {
		if (typeof user !== 'string') return user.tempGroup;
		return super.get(user) || Auth.defaultSymbol();
	}
	isStaff(userid) {
		if (this.has(userid)) {
			const rank = this.get(userid);
			// At one point bots used to be ranked above drivers, so this checks
			// driver rank to make sure this function works on servers that
			// did not reorder the ranks.
			return Auth.atLeast(rank, '*') || Auth.atLeast(rank, '%');
		} else {
			return false;
		}
	}
	atLeast(user, group) {
		if (user.hasSysopAccess()) return true;
		if (group === 'trusted' || group === 'autoconfirmed') {
			if (user.trusted && group === 'trusted') return true;
			if (user.autoconfirmed && group === 'autoconfirmed') return true;
			group = Config.groupsranking[1];
		}
		if (user.locked || user.semilocked) return false;
		if (group === 'unlocked') return true;
		if (group === 'whitelist' && this.has(user.id)) {
			return true;
		}
		if (!Config.groups[group]) return false;
		if (this.get(user.id) === ' ' && group !== ' ') return false;
		return Auth.atLeast(this.get(user.id), group);
	}

	static defaultSymbol() {
		return Config.groupsranking[0] ;
	}
	

	static getGroup(symbol, fallback) {
		if (Config.groups[symbol]) return Config.groups[symbol];

		if (fallback !== undefined) return fallback;

		// unidentified groups are treated as voice
		return {
			...(Config.groups['+'] || {}),
			symbol,
			id: 'voice',
			name: symbol,
		};
	}
	getEffectiveSymbol(user) {
		const group = this.get(user);
		if (this.has(user.id) && group === Auth.defaultSymbol()) {
			return 'whitelist';
		}
		return group;
	}
	static hasPermission(
		user,
		permission,
		target,
		room,
		cmd
	) {
		if (user.hasSysopAccess()) return true;

		const auth = room ? room.auth : Users.globalAuth;

		const symbol = auth.getEffectiveSymbol(user);

		let targetSymbol;
		if (!target) {
			targetSymbol = null;
		} else if (typeof target === 'string' && !toID(target)) { // empty ID -> target is a group symbol
			targetSymbol = target ;
		} else {
			targetSymbol = auth.get(target );
		}
		if (!targetSymbol || ['whitelist', 'trusted', 'autoconfirmed'].includes(targetSymbol)) {
			targetSymbol = Auth.defaultSymbol();
		}

		const group = Auth.getGroup(symbol);
		if (group['root']) return true;

		let jurisdiction = group[permission ];
		if (jurisdiction === true && permission !== 'jurisdiction') {
			jurisdiction = group['jurisdiction'] || true;
		}
		const roomPermissions = room ? room.settings.permissions : null;
		if (roomPermissions) {
			let foundSpecificPermission = false;
			if (cmd) {
				const namespace = cmd.slice(0, cmd.indexOf(' '));
				if (roomPermissions[`/${cmd}`]) {
					// this checks sub commands and command objects, but it checks to see if a sub-command
					// overrides (should a perm for the command object exist) first
					if (!auth.atLeast(user, roomPermissions[`/${cmd}`])) return false;
					jurisdiction = 'u';
					foundSpecificPermission = true;
				} else if (roomPermissions[`/${namespace}`]) {
					// if it's for one command object
					if (!auth.atLeast(user, roomPermissions[`/${namespace}`])) return false;
					jurisdiction = 'u';
					foundSpecificPermission = true;
				}
			}
			if (!foundSpecificPermission && roomPermissions[permission]) {
				if (!auth.atLeast(user, roomPermissions[permission])) return false;
				jurisdiction = 'u';
			}
		}
		return Auth.hasJurisdiction(symbol, jurisdiction, targetSymbol );
	}
	static atLeast(symbol, symbol2) {
		return Auth.getGroup(symbol).rank >= Auth.getGroup(symbol2).rank;
	}
	static supportedRoomPermissions(room = null) {
		const handlers = Chat.allCommands().filter(c => c.hasRoomPermissions);
		const commands = [];
		for (const handler of handlers) {
			commands.push(`/${handler.fullCmd}`);
			if (handler.aliases.length) {
				for (const alias of handler.aliases) {
					// kind of a hack but this is the only good way i could think of to
					// overwrite the alias without making assumptions about the string
					commands.push(`/${handler.fullCmd.replace(handler.cmd, alias)}`);
				}
			}
		}
		return [
			...exports.ROOM_PERMISSIONS,
			...commands,
		];
	}
	static hasJurisdiction(
		symbol,
		jurisdiction,
		targetSymbol
	) {
		if (!targetSymbol) {
			return !!jurisdiction;
		}
		if (typeof jurisdiction !== 'string') {
			return !!jurisdiction;
		}
		if (jurisdiction.includes(targetSymbol)) {
			return true;
		}
		if (jurisdiction.includes('a')) {
			return true;
		}
		if (jurisdiction.includes('u') && Auth.getGroup(symbol).rank > Auth.getGroup(targetSymbol).rank) {
			return true;
		}
		return false;
	}
	static listJurisdiction(user, permission) {
		const symbols = Object.keys(Config.groups) ;
		return symbols.filter(targetSymbol => Auth.hasPermission(user, permission, targetSymbol));
	}
	static isValidSymbol(symbol) {
		if (symbol.length !== 1) return false;
		return !/[A-Za-z0-9|,]/.test(symbol);
	}
	static isAuthLevel(level) {
		if (Config.groupsranking.includes(level )) return true;
		return ['‽', '!', 'unlocked', 'trusted', 'autoconfirmed', 'whitelist'].includes(level);
	}
	static __initStatic() {this.ROOM_PERMISSIONS = exports.ROOM_PERMISSIONS}
	static __initStatic2() {this.GLOBAL_PERMISSIONS = exports.GLOBAL_PERMISSIONS}
} Auth.__initStatic(); Auth.__initStatic2(); exports.Auth = Auth;

 class RoomAuth extends Auth {
	
	constructor(room) {
		super();
		this.room = room;
	}
	get(userOrID) {
		const id = typeof userOrID === 'string' ? userOrID : userOrID.id;

		const parentAuth = this.room.parent ? this.room.parent.auth :
			this.room.settings.isPrivate !== true ? Users.globalAuth : null;
		const parentGroup = parentAuth ? parentAuth.get(userOrID) : Auth.defaultSymbol();

		if (this.has(id)) {
			// authority is whichever is higher between roomauth and global auth
			const roomGroup = this.getDirect(id);
			let group = Config.greatergroupscache[`${roomGroup}${parentGroup}`];
			if (!group) {
				// unrecognized groups always trump higher global rank
				const roomRank = Auth.getGroup(roomGroup, {rank: Infinity}).rank;
				const globalRank = Auth.getGroup(parentGroup).rank;
				if (roomGroup === Users.PLAYER_SYMBOL || roomGroup === Users.HOST_SYMBOL || roomGroup === '#') {
					// Player, Host, and Room Owner always trump higher global rank
					group = roomGroup;
				} else {
					group = (roomRank > globalRank ? roomGroup : parentGroup);
				}
				Config.greatergroupscache[`${roomGroup}${parentGroup}`] = group;
			}
			return group;
		}

		return parentGroup;
	}
	getEffectiveSymbol(user) {
		const symbol = super.getEffectiveSymbol(user);
		if (!this.room.persist && symbol === user.tempGroup) {
			const replaceGroup = Auth.getGroup(symbol).globalGroupInPersonalRoom;
			if (replaceGroup) return replaceGroup;
		}
		return symbol;
	}
	/** gets the room group without inheriting */
	getDirect(id) {
		return super.get(id);
	}
	save() {
		// construct auth object
		const auth = Object.create(null);
		for (const [userid, groupSymbol] of this) {
			auth[userid] = groupSymbol;
		}
		(this.room.settings ).auth = auth;
		this.room.saveSettings();
	}
	load() {
		for (const userid in this.room.settings.auth) {
			super.set(userid , this.room.settings.auth[userid]);
		}
	}
	set(id, symbol) {
		if (symbol === 'whitelist' ) {
			symbol = Auth.defaultSymbol();
		}
		super.set(id, symbol);
		this.room.settings.auth[id] = symbol;
		this.room.saveSettings();

		const user = Users.get(id);
		if (user) this.room.onUpdateIdentity(user);
		return this;
	}
	delete(id) {
		if (!this.has(id)) return false;
		super.delete(id);
		delete this.room.settings.auth[id];
		this.room.saveSettings();
		return true;
	}
} exports.RoomAuth = RoomAuth;

 class GlobalAuth extends Auth {
	__init() {this.usernames = new Map()}
	__init2() {this.sectionLeaders = new Map()}
	constructor() {
		super();GlobalAuth.prototype.__init.call(this);GlobalAuth.prototype.__init2.call(this);;
		this.load();
	}
	save() {
		_fs.FS.call(void 0, 'config/usergroups.csv').writeUpdate(() => {
			let buffer = '';
			for (const [userid, groupSymbol] of this) {
				buffer += `${this.usernames.get(userid) || userid},${groupSymbol},${this.sectionLeaders.get(userid) || ''}\n`;
			}
			return buffer;
		});
	}
	load() {
		const data = _fs.FS.call(void 0, 'config/usergroups.csv').readIfExistsSync();
		for (const row of data.split("\n")) {
			if (!row) continue;
			const [name, symbol, sectionid] = row.split(",");
			const id = toID(name);
			this.usernames.set(id, name);
			if (sectionid) this.sectionLeaders.set(id, sectionid );

			// handle glitched entries where a user has two entries in usergroups.csv due to bugs
			const newSymbol = symbol.charAt(0) ;
			const preexistingSymbol = super.get(id);
			// take a user's highest rank in usergroups.csv
			if (preexistingSymbol && Auth.atLeast(preexistingSymbol, newSymbol)) continue;
			super.set(id, newSymbol);
		}
	}
	set(id, group, username) {
		if (!username) username = id;
		const user = Users.get(id);
		if (user) {
			user.tempGroup = group;
			user.updateIdentity();
			username = user.name;
			Rooms.global.checkAutojoin(user);
		}
		this.usernames.set(id, username);
		super.set(id, group);
		void this.save();
		return this;
	}
	delete(id) {
		if (!super.has(id)) return false;
		super.delete(id);
		const user = Users.get(id);
		if (user) {
			user.tempGroup = ' ';
		}
		this.usernames.delete(id);
		this.save();
		return true;
	}
	setSection(id, sectionid, username) {
		if (!username) username = id;
		const user = Users.get(id);
		if (user) {
			user.updateIdentity();
			username = user.name;
			Rooms.global.checkAutojoin(user);
		}
		if (!super.has(id)) this.set(id, ' ', username);
		this.sectionLeaders.set(id, sectionid);
		void this.save();
		return this;
	}
	deleteSection(id) {
		if (!this.sectionLeaders.has(id)) return false;
		this.sectionLeaders.delete(id);
		if (super.get(id) === ' ') {
			return this.delete(id);
		}
		const user = Users.get(id);
		if (user) {
			user.updateIdentity();
			Rooms.global.checkAutojoin(user);
		}
		this.save();
		return true;
	}
} exports.GlobalAuth = GlobalAuth;

 //# sourceMappingURL=sourceMaps/user-groups.js.map