"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/*
 * Announcements chat plugin
 * By Spandamn
 */












 class Announcement extends Rooms.MinorActivity {
	 __init() {this.activityid = 'announcement' }
	__init2() {this.name = 'Announcement'}
	
	
	constructor(room, options) {
		super(room);Announcement.prototype.__init.call(this);Announcement.prototype.__init2.call(this);;
		this.activityNumber = options.activityNumber || room.nextGameNumber();
		this.source = options.source;
		this.setTimer(options);
	}

	generateAnnouncement() {
		return `<div class="broadcast-blue"><p style="margin: 2px 0 5px 0"><strong style="font-size:11pt">${this.source}</strong></p></div>`;
	}

	displayTo(user, connection = null) {
		const recipient = connection || user;
		recipient.sendTo(this.room, `|uhtml|announcement${this.activityNumber}|${this.generateAnnouncement()}`);
	}

	display() {
		const announcement = this.generateAnnouncement();
		for (const id in this.room.users) {
			const thisUser = this.room.users[id];
			thisUser.sendTo(this.room, `|uhtml|announcement${this.activityNumber}|${announcement}`);
		}
	}

	onConnect(user, connection = null) {
		this.displayTo(user, connection);
	}

	destroy() {
		this.room.send(`|uhtmlchange|announcement${this.activityNumber}|<div class="infobox">(${this.room.tr`The announcement has ended.`})</div>`);
		this.room.setMinorActivity(null);
	}

	toJSON() {
		return {
			source: this.source,
			activityNumber: this.activityNumber,
			timeoutMins: this.timeoutMins,
			timerEnd: this.timerEnd,
			activityid: 'announcement',
		};
	}

	save() {
		this.room.settings.minorActivity = this.toJSON();
		this.room.saveSettings();
	}
} exports.Announcement = Announcement;

 const commands = {
	announcement: {
		htmlcreate: 'new',
		create: 'new',
		new(target, room, user, connection, cmd, message) {
			room = this.requireRoom();
			if (!target) return this.parse('/help announcement new');
			target = target.trim();
			if (room.battle) return this.errorReply(this.tr`Battles do not support announcements.`);

			const text = this.filter(target);
			if (target !== text) return this.errorReply(this.tr`You are not allowed to use filtered words in announcements.`);

			const supportHTML = cmd === 'htmlcreate';

			this.checkCan('minigame', null, room);
			if (supportHTML) this.checkCan('declare', null, room);
			this.checkChat();
			if (room.minorActivity) {
				return this.errorReply(this.tr`There is already a poll or announcement in progress in this room.`);
			}

			const source = supportHTML ? this.checkHTML(Chat.collapseLineBreaksHTML(target)) : Chat.formatText(target, true);

			room.setMinorActivity(new Announcement(room, {source}));

			this.roomlog(`${user.name} used ${message}`);
			this.modlog('ANNOUNCEMENT');
			return this.privateModAction(room.tr`An announcement was started by ${user.name}.`);
		},
		newhelp: [`/announcement create [announcement] - Creates an announcement. Requires: % @ # &`],

		timer(target, room, user) {
			room = this.requireRoom();
			const announcement = this.requireMinorActivity(Announcement);

			if (target) {
				this.checkCan('minigame', null, room);
				if (target === 'clear') {
					if (!announcement.endTimer()) return this.errorReply(this.tr`There is no timer to clear.`);
					return this.add(this.tr`The announcement timer was turned off.`);
				}
				const timeoutMins = parseFloat(target);
				if (isNaN(timeoutMins) || timeoutMins <= 0 || timeoutMins > 7 * 24 * 60) {
					return this.errorReply(this.tr`Time should be a number of minutes less than one week.`);
				}
				announcement.setTimer({timeoutMins});
				room.add(`The announcement timer was turned on: the announcement will end in ${timeoutMins} minute${Chat.plural(timeoutMins)}.`);
				this.modlog('ANNOUNCEMENT TIMER', null, `${timeoutMins} minutes`);
				return this.privateModAction(`The announcement timer was set to ${timeoutMins} minute${Chat.plural(timeoutMins)} by ${user.name}.`);
			} else {
				if (!this.runBroadcast()) return;
				if (announcement.timeout) {
					return this.sendReply(`The announcement timer is on and will end in ${announcement.timeoutMins} minute${Chat.plural(announcement.timeoutMins)}.`);
				} else {
					return this.sendReply(this.tr`The announcement timer is off.`);
				}
			}
		},
		timerhelp: [
			`/announcement timer [minutes] - Sets the announcement to automatically end after [minutes] minutes. Requires: % @ # &`,
			`/announcement timer clear - Clears the announcement's timer. Requires: % @ # &`,
		],

		close: 'end',
		stop: 'end',
		end(target, room, user) {
			room = this.requireRoom();
			this.checkCan('minigame', null, room);
			this.checkChat();
			const announcement = this.requireMinorActivity(Announcement);
			announcement.end(room);
			this.modlog('ANNOUNCEMENT END');
			this.privateModAction(room.tr`The announcement was ended by ${user.name}.`);
		},
		endhelp: [`/announcement end - Ends a announcement and displays the results. Requires: % @ # &`],

		show: '',
		display: '',
		''(target, room, user, connection) {
			room = this.requireRoom();
			const announcement = this.requireMinorActivity(Announcement);
			if (!this.runBroadcast()) return;
			room.update();

			if (this.broadcasting) {
				announcement.display();
			} else {
				announcement.displayTo(user, connection);
			}
		},
		displayhelp: [`/announcement display - Displays the announcement`],
	},
	announcementhelp: [
		`/announcement allows rooms to run their own announcements. These announcements are limited to one announcement at a time per room.`,
		`Accepts the following commands:`,
		`/announcement create [announcement] - Creates a announcement. Requires: % @ # &`,
		`/announcement htmlcreate [announcement] - Creates a announcement, with HTML allowed. Requires: # &`,
		`/announcement timer [minutes] - Sets the announcement to automatically end after [minutes]. Requires: % @ # &`,
		`/announcement display - Displays the announcement`,
		`/announcement end - Ends a announcement. Requires: % @ # &`,
	],
}; exports.commands = commands;

process.nextTick(() => {
	Chat.multiLinePattern.register('/announcement (new|create|htmlcreate) ');
});

// should handle restarts and also hotpatches
for (const room of Rooms.rooms.values()) {
	if (_optionalChain([room, 'access', _ => _.settings, 'access', _2 => _2.minorActivity, 'optionalAccess', _3 => _3.activityid]) === 'announcement') {
		room.setMinorActivity(new Announcement(room, room.settings.minorActivity), true);
	}
}

 //# sourceMappingURL=sourceMaps/announcements.js.map