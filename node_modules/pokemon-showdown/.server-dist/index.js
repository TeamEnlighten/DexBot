"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * Main file
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is the main Pokemon Showdown app, and the file that the
 * `pokemon-showdown` script runs if you start Pokemon Showdown normally.
 *
 * This file sets up our SockJS server, which handles communication
 * between users and your server, and also sets up globals. You can
 * see details in their corresponding files, but here's an overview:
 *
 * Users - from users.ts
 *
 *   Most of the communication with users happens in users.ts, we just
 *   forward messages between the sockets.js and users.ts.
 *
 *   It exports the global tables `Users.users` and `Users.connections`.
 *
 * Rooms - from rooms.ts
 *
 *   Every chat room and battle is a room, and what they do is done in
 *   rooms.ts. There's also a global room which every user is in, and
 *   handles miscellaneous things like welcoming the user.
 *
 *   It exports the global table `Rooms.rooms`.
 *
 * Dex - from .sim-dist/dex.ts
 *
 *   Handles getting data about Pokemon, items, etc.
 *
 * Ladders - from ladders.ts and ladders-remote.ts
 *
 *   Handles Elo rating tracking for players.
 *
 * Chat - from chat.ts
 *
 *   Handles chat and parses chat commands like /me and /ban
 *
 * Sockets - from sockets.js
 *
 *   Used to abstract out network connections. sockets.js handles
 *   the actual server and connection set-up.
 *
 * @license MIT
 */

// NOTE: This file intentionally doesn't use too many modern JavaScript
// features, so that it doesn't crash old versions of Node.js, so we
// can successfully print the "We require Node.js 8+" message.

// Check for version and dependencies
try {
	// I've gotten enough reports by people who don't use the launch
	// script that this is worth repeating here
	[].flatMap(x => x);
} catch (e) {
	throw new Error("We require Node.js version 12 or later; you're using " + process.version);
}

try {
	require.resolve('../.sim-dist/index');
	const sucraseVersion = require('sucrase').getVersion().split('.');
	if (
		parseInt(sucraseVersion[0]) < 3 ||
		(parseInt(sucraseVersion[0]) === 3 && parseInt(sucraseVersion[1]) < 12)
	) {
		throw new Error("Sucrase version too old");
	}
} catch (e) {
	throw new Error("Dependencies are unmet; run `node build` before launching Pokemon Showdown again.");
}

var _lib = require('../.lib-dist');

/*********************************************************
 * Load configuration
 *********************************************************/

var _configloader = require('./config-loader'); var ConfigLoader = _configloader;
global.Config = ConfigLoader.Config;

var _monitor = require('./monitor');
global.Monitor = _monitor.Monitor;
global.__version = {head: ''};
void _monitor.Monitor.version().then((hash) => {
	global.__version.tree = hash;
});

if (Config.watchconfig) {
	_lib.FS.call(void 0, require.resolve('../config/config')).onModify(() => {
		try {
			global.Config = ConfigLoader.load(true);
			// ensure that battle prefixes configured via the chat plugin are not overwritten
			// by battle prefixes manually specified in config.js
			_optionalChain([_chat.Chat, 'access', _ => _.plugins, 'access', _2 => _2['username-prefixes'], 'optionalAccess', _3 => _3.prefixManager, 'access', _4 => _4.refreshConfig, 'call', _5 => _5(true)]);
			_monitor.Monitor.notice('Reloaded ../config/config.js');
		} catch (e) {
			_monitor.Monitor.adminlog("Error reloading ../config/config.js: " + e.stack);
		}
	});
}

/*********************************************************
 * Set up most of our globals
 *********************************************************/

var _dex = require('../.sim-dist/dex');
global.Dex = _dex.Dex;
global.toID = _dex.Dex.toID;

var _teams = require('../.sim-dist/teams');
global.Teams = _teams.Teams;

var _loginserver = require('./loginserver');
global.LoginServer = _loginserver.LoginServer;

var _ladders = require('./ladders');
global.Ladders = _ladders.Ladders;

var _chat = require('./chat');
global.Chat = _chat.Chat;

var _users = require('./users');
global.Users = _users.Users;

var _punishments = require('./punishments');
global.Punishments = _punishments.Punishments;

var _rooms = require('./rooms');
global.Rooms = _rooms.Rooms;
// We initialize the global room here because roomlogs.ts needs the Rooms global
_rooms.Rooms.global = new _rooms.Rooms.GlobalRoomState();

var _verifier = require('./verifier'); var Verifier = _verifier;
global.Verifier = Verifier;
Verifier.PM.spawn();

var _tournaments = require('./tournaments');
global.Tournaments = _tournaments.Tournaments;

var _iptools = require('./ip-tools');
global.IPTools = _iptools.IPTools;
void _iptools.IPTools.loadHostsAndRanges();

if (Config.crashguard) {
	// graceful crash - allow current battles to finish before restarting
	process.on('uncaughtException', (err) => {
		_monitor.Monitor.crashlog(err, 'The main process');
	});

	process.on('unhandledRejection', err => {
		_monitor.Monitor.crashlog(err , 'A main process Promise');
	});
}

/*********************************************************
 * Start networking processes to be connected to
 *********************************************************/

var _sockets = require('./sockets');
global.Sockets = _sockets.Sockets;

 function listen(port, bindAddress, workerCount) {
	_sockets.Sockets.listen(port, bindAddress, workerCount);
} exports.listen = listen;

if (require.main === module) {
	// Launch the server directly when app.js is the main module. Otherwise,
	// in the case of app.js being imported as a module (e.g. unit tests),
	// postpone launching until app.listen() is called.
	let port;
	for (const arg of process.argv) {
		if (/^[0-9]+$/.test(arg)) {
			port = parseInt(arg);
			break;
		}
	}
	_sockets.Sockets.listen(port);
}

/*********************************************************
 * Set up our last global
 *********************************************************/

var _teamvalidatorasync = require('./team-validator-async'); var TeamValidatorAsync = _teamvalidatorasync;
global.TeamValidatorAsync = TeamValidatorAsync;
TeamValidatorAsync.PM.spawn();

/*********************************************************
 * Start up the REPL server
 *********************************************************/

// eslint-disable-next-line no-eval
_lib.Repl.start('app', cmd => eval(cmd));

/*********************************************************
 * Fully initialized, run startup hook
 *********************************************************/

if (Config.startuphook) {
	process.nextTick(Config.startuphook);
}

if (Config.ofemain) {
	try {
		require.resolve('node-oom-heapdump');
	} catch (e) {
		if (e.code !== 'MODULE_NOT_FOUND') throw e; // should never happen
		throw new Error(
			'node-oom-heapdump is not installed, but it is a required dependency if Config.ofe is set to true! ' +
			'Run npm install node-oom-heapdump and restart the server.'
		);
	}

	// Create a heapdump if the process runs out of memory.
	global.nodeOomHeapdump = (require )('node-oom-heapdump')({
		addTimestamp: true,
	});
}

 //# sourceMappingURL=sourceMaps/index.js.map