"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * Neural net chatfilters.
 * These are in a separate file so that they don't crash the other filters.
 * (issues with globals, etc)
 * by Mia.
 * @author mia-pi-git
 */

var _processmanager = require('../../.lib-dist/process-manager');
var _ = require('../../.lib-dist/');
var _configloader = require('../config-loader');
var _repl = require('../../.lib-dist/repl');
var _chatformatter = require('../chat-formatter');

const PATH = "config/chat-plugins/net.json";
const NUM_PROCESSES = _configloader.Config.netfilterprocesses || 1;
const PM_TIMEOUT = 2 * 60 * 60 * 1000; // training can be _really_ slow
const WHITELIST = ["mia"];















function modelExists() {
	try {
		require.resolve('brain.js');
	} catch (e) {
		return false;
	}
	return true;
}

function toRoomID(room) {
	return ("" + room).toLowerCase().replace(/[^a-z0-9-]+/g, '');
}

 class NeuralNetChecker {
	
	constructor(path) {
		try {
			this.model = new (require('brain.js').recurrent.LSTM)();
		} catch (e) {
			this.model = null;
		}
		if (path) this.load(path);
	}
	async train(data, iterations) {
		// 200 has good perf but is still effective
		if (!iterations) iterations = 200;
		const now = Date.now();
		if (_.FS.call(void 0, PATH).existsSync()) await _.FS.call(void 0, PATH).copyFile(PATH + '.backup');
		if (!this.model) throw new Error(`Attempting to train with no model installed`);
		for (const line of data) {
			try {
				this.model.train([line], {iterations});
			} catch (e) {
				Monitor.crashlog(e, "a netfilter training process", {
					line: JSON.stringify(line),
				});
				process.exit();
			}
		}
		this.save();
		return Date.now() - now; // time data is helpful for training
	}
	static sanitizeChatLines(content, result) {
		return content.split('\n').map(line => {
			const message = this.parseChatLine(line);
			if (!message) return null;
			return {output: `|${result}`, input: message};
		}).filter(Boolean) ;
	}
	static sanitizeLine(content) {
		return content.replace(_chatformatter.linkRegex, '').replace(/<<[a-z0-9-]+>>/ig, '');
	}
	static parseChatLine(line) {
		const parts = _.Utils.splitFirst(line, '|', 4).map(i => i.trim());
		if (
			parts[1] !== 'c' || (parts[3].startsWith('/') && !parts[3].startsWith('/me')) ||
			parts[3].startsWith('!') || parts[3].length < 3
		) {
			return null;
		}
		return this.sanitizeLine(parts[3]);
	}
	save(path = PATH) {
		if (!this.model) return {};
		const state = this.model.toJSON();
		_.FS.call(void 0, path).writeUpdate(() => JSON.stringify(state));
		return state;
	}
	load(path) {
		if (!_.FS.call(void 0, path).existsSync()) return;
		const data = JSON.parse(_.FS.call(void 0, path).readSync());
		_optionalChain([this, 'access', _2 => _2.model, 'optionalAccess', _3 => _3.fromJSON, 'call', _4 => _4(data)]);
	}
	run(data) {
		let result = '';
		if (!this.model) return result;
		try {
			result = this.model.run(data);
		} catch (e) {}
		// usually means someone didn't train it, carry on
		// acceptable to drop since training is very slow
		return result;
	}
	static async train(data) {
		// do the training in its own process
		const result = await exports.PM.queryTemporaryProcess({type: 'train', data});
		// load it into the main process that we're querying
		for (const sub of exports.PM.processes) {
			await sub.query({type: 'load', data: PATH});
		}
		return result;
	}
} exports.NeuralNetChecker = NeuralNetChecker;

function checkAllowed(context) {
	if (!modelExists()) throw new Chat.ErrorMessage(`Net filters are disabled - install brain.js to use them.`);
	const user = context.user;
	if (WHITELIST.includes(user.id)) return true;
	return context.canUseConsole();
}

 let net = null; exports.net = net;
 let disabled = false; exports.disabled = disabled;

 const hits = (() => {
	const cache = Object.create(null);
	if (global.Chat) {
		if (_optionalChain([Chat, 'access', _5 => _5.plugins, 'access', _6 => _6['net-filters'], 'optionalAccess', _7 => _7.hits])) {
			Object.assign(cache, Chat.plugins['net-filters'].hits);
		}
	}
	return cache;
})(); exports.hits = hits;

 const chatfilter = function (message, user, room, connection) {
	if (exports.disabled || !modelExists()) return;
	// not awaited as so to not hold up the filters (additionally we can wait on this)
	void (async () => {
		if (!room || room.persist || room.roomid.startsWith('help-')) return;
		const result = await exports.PM.query({type: "run", data: message});
		if (_optionalChain([result, 'optionalAccess', _8 => _8.endsWith, 'call', _9 => _9("|flag")])) {
			if (!exports.hits[room.roomid]) exports.hits[room.roomid] = {};
			if (!exports.hits[room.roomid][user.id]) exports.hits[room.roomid][user.id] = 0;
			exports.hits[room.roomid][user.id]++;
			const minCount = _configloader.Config.netfilterlimit || 20;
			if (exports.hits[room.roomid][user.id] >= minCount) {
				_optionalChain([Rooms, 'access', _10 => _10.get, 'call', _11 => _11('upperstaff'), 'optionalAccess', _12 => _12.add, 'call', _13 => _13(
					`|c|&|/log [ERPMonitor] Suspicious messages detected in <<${room.roomid}>>`
				), 'access', _14 => _14.update, 'call', _15 => _15()]);
				exports.hits[room.roomid][user.id] = 0; // so they can't spam messages
				if ('uploadReplay' in (room )) {
					void (room ).uploadReplay(user, connection, "silent");
				}
			}
		}
	})();
	return undefined;
}; exports.chatfilter = chatfilter;

 const PM = new _processmanager.QueryProcessManager(module, async query => {
	if (!exports.net) throw new Error("Neural net not intialized");
	const {data, type, options} = query;
	switch (type) {
	case 'run':
		let response = '';
		try {
			response = exports.net.run(data );
		} catch (e) {} // uninitialized (usually means intializing, which can be slow) - drop it for now
		return response;
	case 'train':
		return exports.net.train(data , _optionalChain([options, 'optionalAccess', _16 => _16.iterations]));
	case 'save':
		return exports.net.save();
	case 'load':
		try {
			exports.net.load(data );
		} catch (e) {
			return e.message;
		}
		return 'success';
	case 'trainfrom':
		const {path: targetPath, result} = data ;
		const content = _.FS.call(void 0, targetPath).readSync();
		const lines = NeuralNetChecker.sanitizeChatLines(content, result);
		const time = await exports.net.train(lines);
		return [time, lines.length];
	}
}, PM_TIMEOUT); exports.PM = PM;

if (!exports.PM.isParentProcess) {
	global.Config = _configloader.Config;

	global.Monitor = {
		crashlog(error, source = 'A netfilter process', details = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	};
	process.on('uncaughtException', err => {
		if (_configloader.Config.crashguard) {
			Monitor.crashlog(err, 'A net filter child process');
		}
	});
	// we only want to spawn one network, when it's the subprocess
	// otherwise, we use the PM for interfacing with the network
	exports.net = new NeuralNetChecker(PATH);
	// eslint-disable-next-line no-eval
	_repl.Repl.start('netfilters', cmd => eval(cmd));
} else {
	exports.PM.spawn(NUM_PROCESSES);
}

 const commands = {
	netfilter: {
		limit(target, room, user) {
			checkAllowed(this);
			const int = parseInt(target);
			if (isNaN(int)) {
				return this.errorReply("Invalid number");
			}
			if (int < 20) {
				return this.errorReply("Too low.");
			}
			_configloader.Config.netfilterlimit = int;
			this.privateGlobalModAction(`${user.name} temporarily set the net filter trigger limit to ${int}`);
			this.globalModlog(`NETFILTER LIMIT`, null, int.toString());
		},
		async train(target, room, user) {
			checkAllowed(this);
			const data = [];
			const parts = target.split('\n').filter(Boolean);
			for (const line of parts) {
				const [input, output] = _.Utils.splitFirst(line, '|');
				if (!['ok', 'flag'].some(i => output === i)) {
					return this.errorReply(`Malformed line: ${line} - output must be 'ok' or 'flag'.`);
				}
				if (!input.trim()) {
					return this.errorReply(`Malformed line: ${line} - input must be a string`);
				}
				data.push({input, output: `|${output}`});
			}
			if (!data.length) {
				return this.errorReply(`You need to provide some sort of data`);
			}
			this.sendReply(`Initiating training...`);
			const results = await NeuralNetChecker.train(data.filter(Boolean));
			this.sendReply(`Training completed in ${Chat.toDurationString(results)}`);
			this.privateGlobalModAction(`${user.name} trained the net filters on ${Chat.count(data.length, 'lines')}`);
			this.stafflog(`${data.map(i => `(lines: '${i.input}' => '${i.output}'`).join('; ')})`);
		},
		async rollback(target, room, user) {
			checkAllowed(this);
			const backup = _.FS.call(void 0, PATH + '.backup');
			if (!backup.existsSync()) return this.errorReply(`No backup exists.`);
			await backup.copyFile(PATH);
			const result = await exports.PM.query({type: "load", data: PATH});
			if (result && result !== 'success') {
				return this.errorReply(`Rollback failed: ${result}`);
			}
			this.privateGlobalModAction(`${user.name} rolled the net filters back to last backup`);
		},
		async test(target, room, user) {
			checkAllowed(this);
			const result = await exports.PM.query({type: 'run', data: target});
			return this.sendReply(`Result for '${target}': ${result}`);
		},
		enable: 'disable',
		disable(target, room, user, connection, cmd) {
			checkAllowed(this);
			let logMessage;
			if (cmd === 'disable') {
				if (exports.disabled) return this.errorReply(`Net filters are already disabled.`);
				exports.disabled = true;
				this.globalModlog(`NETFILTER DISABLE`);
				logMessage = `${user.name} disabled the net filters`;
			} else {
				if (!exports.disabled) return this.errorReply(`The net filters are already enabled`);
				exports.disabled = false;
				this.globalModlog(`NETFILTER ENABLE`);
				logMessage = `${user.name} enabled the net filters`;
			}
			this.privateGlobalModAction(logMessage);
		},
		async trainfrom(target, room, user) {
			checkAllowed(this);
			let [roomid, date, result] = _.Utils.splitFirst(target, ',', 2).map(i => i.trim());
			roomid = toRoomID(roomid );
			if (!_.FS.call(void 0, 'logs/chat/' + roomid.toLowerCase()).existsSync()) {
				return this.errorReply(`Logs for that roomid not found.`);
			}
			if (!/\b[0-9]{4}-[0-9]{2}-[0-9]{2}\b/ig.test(date)) {
				return this.errorReply(`Invalid date`);
			}
			if (!['ok', 'flag'].includes(toID(result))) {
				return this.errorReply(`Invalid output`);
			}
			const targetPath = _.FS.call(void 0, `logs/chat/${roomid}/${date.slice(0, -3)}/${date}.txt`);
			if (!targetPath.existsSync()) return this.errorReply(`Logs for that date not found`);
			this.sendReply(`Initating training...`);
			const response = await exports.PM.query({data: {path: targetPath.path, result}, type: 'trainfrom'});
			this.sendReply(`Training completed in ${Chat.toDurationString(response[0])}`);
			this.privateGlobalModAction(
				`${user.name} trained the net filters on logs from ${roomid} (${date} - ${Chat.count(response[1], 'lines')})`
			);
			this.stafflog(`Result: ${result} | Time: ${response[0]}ms`);
		},
	},
}; exports.commands = commands;

if (global.Chat) {
	process.nextTick(() => Chat.multiLinePattern.register('/netfilter train '));
}

 //# sourceMappingURL=sourceMaps/net-filters.js.map