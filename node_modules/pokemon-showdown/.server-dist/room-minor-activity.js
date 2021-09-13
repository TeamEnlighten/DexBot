"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * Minor activities
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Minor activities are representations of non-game activities that rooms
 * regularly use, such as polls and announcements. Rooms are limited to
 * one minor activity at a time.
 *
 * Minor activities keep track of users in the form of userids and IPs.
 * If a player votes for a poll under one IP, they cannot vote for the same
 * poll again.
 *
 * The user-tracking system is not implemented at the base level: Announcements
 * do not have a reason to keep track of users' IPs/IDs because they're just used
 * to broadcast a message to a room.
 *
 * @license MIT
 */


















// globally Rooms.MinorActivity
 class MinorActivity {
	
	

	
	
	
	
	
	
	constructor(room) {
		this.timeout = null;
		this.timeoutMins = 0;
		this.timerEnd = 0;
		this.roomid = room.roomid;
		this.room = room;
		this.supportHTML = false;
	}

	setTimer(options) {
		if (this.timeout) clearTimeout(this.timeout);

		this.timeoutMins = options.timeoutMins || 0;
		if (!this.timeoutMins) {
			this.timerEnd = 0;
			this.timeout = null;
			return;
		}

		const now = Date.now();
		this.timerEnd = options.timerEnd || now + this.timeoutMins * 60000;
		this.timeout = setTimeout(() => {
			const room = this.room;
			if (!room) return; // someone forgot to `.destroy()`

			this.end(room);
		}, this.timerEnd - now);
		this.save();
	}

	end(room, MinorActivityClass) {
		_optionalChain([room, 'access', _ => _.minorActivity, 'optionalAccess', _2 => _2.destroy, 'call', _3 => _3()]);
		if (_optionalChain([room, 'access', _4 => _4.minorActivityQueue, 'optionalAccess', _5 => _5.length])) {
			const pollData = room.minorActivityQueue.shift();
			if (!room.minorActivityQueue.length) room.clearMinorActivityQueue();
			if (!_optionalChain([room, 'access', _6 => _6.settings, 'access', _7 => _7.minorActivityQueue, 'optionalAccess', _8 => _8.length])) {
				delete room.settings.minorActivityQueue;
				room.saveSettings();
			}

			if (pollData.activityid !== 'poll') throw new Error(`Unexpected Minor Activity (${pollData.activityid}) in queue`);

			room.add(`|c|&|/log ${room.tr`The queued poll was started.`}`).update();
			room.modlog({
				action: 'POLL',
				note: '(queued)',
			});

			if (!MinorActivityClass) {
				if (pollData.activityid === 'poll') {
					const {Poll} = require('./chat-plugins/poll');
					room.setMinorActivity(new Poll(room, pollData));
				}
			} else {
				room.setMinorActivity(new MinorActivityClass(room, pollData));
			}
		}
	}

	endTimer() {
		if (!this.timeout) return false;
		clearTimeout(this.timeout);
		this.timeoutMins = 0;
		this.timerEnd = 0;
		return true;
	}

	





} exports.MinorActivity = MinorActivity;

 //# sourceMappingURL=sourceMaps/room-minor-activity.js.map