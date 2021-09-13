"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _fs = require('../../.lib-dist/fs');

const SUSPECTS_FILE = 'config/suspects.json';
const WHITELIST = ["kris"];








 const suspectTests = JSON.parse(_fs.FS.call(void 0, SUSPECTS_FILE).readIfExistsSync() || "{}"); exports.suspectTests = suspectTests;

function saveSuspectTests() {
	_fs.FS.call(void 0, SUSPECTS_FILE).writeUpdate(() => JSON.stringify(exports.suspectTests));
}

function checkPermissions(context) {
	const user = context.user;
	if (WHITELIST.includes(user.id)) return true;
	context.checkCan('gdeclare');
}

 const commands = {
	suspect: 'suspects',
	suspects: {
		''(target, room, user) {
			if (!Object.keys(exports.suspectTests).length) {
				return this.errorReply("There are no suspect tests running.");
			}
			if (!this.runBroadcast()) return;

			let buffer = '<strong>Suspect tests currently running:</strong>';
			for (const i of Object.keys(exports.suspectTests)) {
				const test = exports.suspectTests[i];
				buffer += '<br />';
				buffer += `${test.tier}: <a href="${test.url}">${test.suspect}</a> (${test.date})`;
			}
			return this.sendReplyBox(buffer);
		},

		edit: 'add',
		add(target, room, user) {
			checkPermissions(this);

			const [tier, suspect, date, url] = target.split(',');
			if (!(tier && suspect && date && url)) {
				return this.parse('/help suspects');
			}

			const format = Dex.formats.get(tier);
			if (!format.exists) return this.errorReply(`"${tier}" is not a valid tier.`);

			const suspectString = suspect.trim();

			const [month, day] = date.trim().split(date.includes('-') ? '-' : '/');
			const isValidDate = /[0-1]?[0-9]/.test(month) && /[0-3]?[0-9]/.test(day);
			if (!isValidDate) return this.errorReply("Dates must be in the format MM/DD.");
			const dateActual = `${month}/${day}`;

			const urlActual = url.trim();
			if (!/^https:\/\/www\.smogon\.com\/forums\/(threads|posts)\//.test(urlActual)) {
				throw new Chat.ErrorMessage("Suspect test URLs must be Smogon threads or posts.");
			}

			this.privateGlobalModAction(`${user.name} ${exports.suspectTests[format.id] ? "edited the" : "added a"} ${format.name} suspect test.`);
			this.globalModlog('SUSPECTTEST', null, `${exports.suspectTests[format.id] ? "edited" : "added"} ${format.name}`);

			exports.suspectTests[format.id] = {
				tier: format.name,
				suspect: suspectString,
				date: dateActual,
				url: urlActual,
			};
			saveSuspectTests();
		},

		delete: 'remove',
		remove(target, room, user) {
			checkPermissions(this);

			const format = toID(target);
			const test = exports.suspectTests[format];
			if (!test) return this.errorReply(`There is no suspect test for '${target}'. Check spelling?`);

			this.privateGlobalModAction(`${user.name} removed the ${test.tier} suspect test.`);
			this.globalModlog('SUSPECTTEST', null, `removed ${test.tier}`);

			delete exports.suspectTests[format];
			saveSuspectTests();
		},

		help() {
			return this.parse('/help suspects');
		},
	},

	suspectshelp() {
		this.sendReplyBox(
			`Commands to manage suspect tests:<br />` +
			`<code>/suspects</code>: displays currently running suspect tests.<br />` +
			`<code>/suspects add [tier], [suspect], [date], [link]</code>: adds a suspect test. Date in the format MM/DD. Requires: &<br />` +
			`<code>/suspects remove [tier]</code>: deletes a suspect test. Requires: &`
		);
	},
}; exports.commands = commands;

 //# sourceMappingURL=sourceMaps/suspect-tests.js.map