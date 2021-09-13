"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * Code to manage username prefixes that force battles to be public or disable modchat.
 * @author Annika
 */

var _lib = require('../../.lib-dist');

const PREFIXES_FILE = 'config/chat-plugins/username-prefixes.json';

 class PrefixManager {
	constructor() {
		// after a restart/newly using the plugin, load prefixes from config.js
		if (!Chat.oldPlugins['username-prefixes']) this.refreshConfig(true);
	}

	save() {
		_lib.FS.call(void 0, PREFIXES_FILE).writeUpdate(() => JSON.stringify(Config.forcedprefixes || {}));
	}

	refreshConfig(configJustLoaded = false) {
		if (!Config.forcedprefixes) Config.forcedprefixes = {};
		if (configJustLoaded) {
			// if we just loaded the config file, ensure that all prefixes are IDs
			if (Config.forcedprefixes.privacy) Config.forcedprefixes.privacy = Config.forcedprefixes.privacy.map(toID);
			if (Config.forcedprefixes.modchat) Config.forcedprefixes.modchat = Config.forcedprefixes.modchat.map(toID);
		}

		let data;
		try {
			data = JSON.parse(_lib.FS.call(void 0, PREFIXES_FILE).readSync());
		} catch (e) {
			if (e.code !== 'ENOENT') throw e;
			return;
		}
		for (const [type, prefixes] of Object.entries(data)) {
			if (!_optionalChain([prefixes, 'optionalAccess', _ => _.length])) continue;
			if (!Config.forcedprefixes[type]) Config.forcedprefixes[type] = [];
			for (const prefix of prefixes) {
				if (Config.forcedprefixes[type].includes(prefix)) continue;
				Config.forcedprefixes[type].push(prefix);
			}
		}
	}

	addPrefix(prefix, type) {
		if (!Config.forcedprefixes[type]) Config.forcedprefixes[type] = [];
		if (Config.forcedprefixes[type].includes(prefix)) {
			throw new Chat.ErrorMessage(`Username prefix '${prefix}' is already configured to force ${type}.`);
		}

		Config.forcedprefixes[type].push(prefix);
		this.save();
	}

	removePrefix(prefix, type) {
		if (!_optionalChain([Config, 'access', _2 => _2.forcedprefixes, 'access', _3 => _3[type], 'optionalAccess', _4 => _4.includes, 'call', _5 => _5(prefix)])) {
			throw new Chat.ErrorMessage(`Username prefix '${prefix}' is not configured to force ${type}!`);
		}

		Config.forcedprefixes[type] = Config.forcedprefixes[type].filter((curPrefix) => curPrefix !== prefix);
		this.save();
	}

	validateType(type) {
		if (type !== 'privacy' && type !== 'modchat') {
			throw new Chat.ErrorMessage(`'${type}' is not a valid type of forced prefix. Valid types are 'privacy' and 'modchat'.`);
		}
		return type;
	}
} exports.PrefixManager = PrefixManager;

 const prefixManager = new PrefixManager(); exports.prefixManager = prefixManager;

 const commands = {
	forcedprefix: 'usernameprefix',
	forcedprefixes: 'usernameprefix',
	usernameprefixes: 'usernameprefix',
	usernameprefix: {
		help: '',
		''() {
			this.parse(`/help forcedprefix`);
		},

		delete: 'add',
		remove: 'add',
		add(target, room, user, connection, cmd) {
			this.checkCan('rangeban');

			const isAdding = cmd.includes('add');

			const [prefix, type] = target.split(',').map(toID);
			if (!prefix || !type) return this.parse(`/help usernameprefix`);
			if (prefix.length > 18) {
				throw new Chat.ErrorMessage(`Specified prefix '${prefix}' is longer than the maximum user ID length.`);
			}

			if (isAdding) {
				exports.prefixManager.addPrefix(prefix, exports.prefixManager.validateType(type));
			} else {
				exports.prefixManager.removePrefix(prefix, exports.prefixManager.validateType(type));
			}

			this.globalModlog(`FORCEDPREFIX ${isAdding ? 'ADD' : 'REMOVE'}`, null, `'${prefix}' ${isAdding ? 'to' : 'from'} ${type}`);
			this.addGlobalModAction(`${user.name} set the username prefix ${prefix} to${isAdding ? '' : ' no longer'} disable ${type}.`);
		},

		view(target) {
			this.checkCan('rangeban');

			const types = target ? [exports.prefixManager.validateType(toID(target))] : ['privacy', 'modchat'];

			return this.sendReplyBox(types.map(type => {
				const info = Config.forcedprefixes[type].length ?
					`<code>${Config.forcedprefixes[type].join('</code>, <code>')}</code>` : `none`;
				return `Username prefixes that disable <strong>${type}</strong>: ${info}.`;
			}).join(`<br />`));
		},
	},
	usernameprefixhelp() {
		return this.sendReplyBox(
			`<code>/usernameprefix add [prefix], [type]</code>: Sets the username prefix [prefix] to disable privacy or modchat on battles where at least one player has the prefix.<br />` +
			`<code>/usernameprefix remove [prefix], [type]</code>: Removes a prefix configuration.<br />` +
			`<code>/usernameprefix view [optional type]</code>: Displays the currently configured username prefixes.<br />` +
			`Valid types are <code>privacy</code> (which forces battles to take place in public rooms) and <code>modchat</code> (which prevents players from setting moderated chat).<br />` +
			`Requires: &`
		);
	},
}; exports.commands = commands;

 //# sourceMappingURL=sourceMaps/username-prefixes.js.map