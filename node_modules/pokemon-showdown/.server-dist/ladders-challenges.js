"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

/**
 * A bundle of:
 - a ID
 * - a battle format
 * - a valid team for that format
 * - misc other preferences for the battle
 *
 * To start a battle, you need one of these for every player.
 */
 class BattleReady {
	
	
	
	
	
	
	constructor(
		userid,
		formatid,
		settings,
		rating = 0,
		challengeType = 'challenge'
	) {
		this.userid = userid;
		this.formatid = formatid;
		this.settings = settings;
		this.rating = rating;
		this.challengeType = challengeType;
		this.time = Date.now();
	}
} exports.BattleReady = BattleReady;

 class AbstractChallenge {
	
	
	
	
	
	
	
	
	
	constructor(from, to, ready, options


 = {}) {
		this.from = from;
		this.to = to;
		this.ready = typeof ready === 'string' ? null : ready;
		this.format = typeof ready === 'string' ? ready : ready.formatid;
		this.acceptCommand = options.acceptCommand || null;
		this.message = options.message || '';
		this.roomid = options.roomid || '';
		this.acceptButton = options.acceptButton || '';
		this.rejectButton = options.rejectButton || '';
	}
	destroy(accepted) {}
} exports.AbstractChallenge = AbstractChallenge;
/**
 * As a regular battle challenge, acceptCommand will be null, but you
 * can set acceptCommand to use this for custom requests wanting a
 * team for something.
 */
 class BattleChallenge extends AbstractChallenge {
	
	
} exports.BattleChallenge = BattleChallenge;
 class GameChallenge extends AbstractChallenge {
	
	
} exports.GameChallenge = GameChallenge;
/**
 * Invites for `/importinputlog` (`ready: null`) or 4-player battles
 * (`ready: BattleReady`)
 */
 class BattleInvite extends AbstractChallenge {
	
	destroy(accepted) {
		if (accepted) return;

		const room = Rooms.get(this.roomid);
		if (!room) return; // room expired?
		const battle = room.battle;
		let invitesFull = true;
		for (const player of battle.players) {
			if (!player.invite && !player.id) invitesFull = false;
			if (player.invite === this.to) player.invite = '';
		}
		if (invitesFull) battle.sendInviteForm(true);
	}
} exports.BattleInvite = BattleInvite;

/**
 * The defining difference between a BattleChallenge and a GameChallenge is
 * that a BattleChallenge has a Ready (and is for a RoomBattle format) and
 * a GameChallenge doesn't (and is for a RoomGame).
 *
 * But remember that both can have a custom acceptCommand.
 */


/**
 * Lists outgoing and incoming challenges for each user ID.
 */
 class Challenges extends Map {
	getOrCreate(userid) {
		let challenges = this.get(userid);
		if (challenges) return challenges;
		challenges = [];
		this.set(userid, challenges);
		return challenges;
	}
	/** Throws Chat.ErrorMessage if a challenge between these users is already in the table */
	add(challenge) {
		const oldChallenge = this.search(challenge.to, challenge.from);
		if (oldChallenge) {
			throw new Chat.ErrorMessage(`There is already a challenge (${challenge.format}) between ${challenge.to} and ${challenge.from}!`);
		}
		const to = this.getOrCreate(challenge.to);
		const from = this.getOrCreate(challenge.from);
		to.push(challenge);
		from.push(challenge);
		this.update(challenge.to, challenge.from);
		return true;
	}
	/** Returns false if the challenge isn't in the table */
	remove(challenge, accepted) {
		const to = this.getOrCreate(challenge.to);
		const from = this.getOrCreate(challenge.from);

		const toIndex = to.indexOf(challenge);
		let success = false;
		if (toIndex >= 0) {
			to.splice(toIndex, 1);
			if (!to.length) this.delete(challenge.to);
			success = true;
		}

		const fromIndex = from.indexOf(challenge);
		if (fromIndex >= 0) {
			from.splice(fromIndex, 1);
			if (!from.length) this.delete(challenge.from);
		}
		if (success) {
			this.update(challenge.to, challenge.from);
			challenge.destroy(accepted);
		}
		return success;
	}
	search(userid1, userid2) {
		const challenges = this.get(userid1);
		if (!challenges) return null;
		for (const challenge of challenges) {
			if (
				(challenge.to === userid1 && challenge.from === userid2) ||
				(challenge.to === userid2 && challenge.from === userid1)
			) {
				return challenge;
			}
		}
		return null;
	}
	/**
	 * Try to accept a custom challenge, throwing `Chat.ErrorMessage` on failure,
	 * and returning the user the challenge was from on a success.
	 */
	resolveAcceptCommand(context) {
		const targetid = context.target ;
		const chall = this.search(context.user.id, targetid);
		if (!chall || chall.to !== context.user.id || chall.acceptCommand !== context.message) {
			throw new Chat.ErrorMessage(`Challenge not found. You are using the wrong command. Challenges should be accepted with /accept`);
		}
		return chall;
	}
	accept(context) {
		const chall = this.resolveAcceptCommand(context);
		this.remove(chall, true);
		const fromUser = Users.get(chall.from);
		if (!fromUser) throw new Chat.ErrorMessage(`User "${chall.from}" is not available right now.`);
		return fromUser;
	}
	clearFor(userid, reason) {
		const user = Users.get(userid);
		const userIdentity = user ? user.getIdentity() : ` ${userid}`;
		const challenges = this.get(userid);
		if (!challenges) return 0;
		for (const challenge of challenges) {
			const otherid = challenge.to === userid ? challenge.from : challenge.to;
			const otherUser = Users.get(otherid);
			const otherIdentity = otherUser ? otherUser.getIdentity() : ` ${otherid}`;

			const otherChallenges = this.get(otherid);
			const otherIndex = otherChallenges.indexOf(challenge);
			if (otherIndex >= 0) otherChallenges.splice(otherIndex, 1);
			if (otherChallenges.length === 0) this.delete(otherid);

			if (!user && !otherUser) continue;
			const header = `|pm|${userIdentity}|${otherIdentity}|`;
			let message = `${header}/challenge`;
			if (reason) message = `${header}/text Challenge cancelled because ${reason}.\n${message}`;
			_optionalChain([user, 'optionalAccess', _ => _.send, 'call', _2 => _2(message)]);
			_optionalChain([otherUser, 'optionalAccess', _3 => _3.send, 'call', _4 => _4(message)]);
		}
		this.delete(userid);
		return challenges.length;
	}
	getUpdate(challenge) {
		if (!challenge) return `/challenge`;
		const teambuilderFormat = challenge.ready ? challenge.ready.formatid : '';
		return `/challenge ${challenge.format}|${teambuilderFormat}|${challenge.message}|${challenge.acceptButton}|${challenge.rejectButton}`;
	}
	update(userid1, userid2) {
		const challenge = this.search(userid1, userid2);
		userid1 = challenge ? challenge.from : userid1;
		userid2 = challenge ? challenge.to : userid2;
		this.send(userid1, userid2, this.getUpdate(challenge));
	}
	send(userid1, userid2, message) {
		const user1 = Users.get(userid1);
		const user2 = Users.get(userid2);
		const user1Identity = user1 ? user1.getIdentity() : ` ${userid1}`;
		const user2Identity = user2 ? user2.getIdentity() : ` ${userid2}`;
		const fullMessage = `|pm|${user1Identity}|${user2Identity}|${message}`;
		_optionalChain([user1, 'optionalAccess', _5 => _5.send, 'call', _6 => _6(fullMessage)]);
		_optionalChain([user2, 'optionalAccess', _7 => _7.send, 'call', _8 => _8(fullMessage)]);
	}
	updateFor(connection) {
		const user = connection.user;
		const challenges = this.get(user.id);
		if (!challenges) return;

		const userIdentity = user.getIdentity();
		let messages = '';
		for (const challenge of challenges) {
			let fromIdentity, toIdentity;
			if (challenge.from === user.id) {
				fromIdentity = userIdentity;
				const toUser = Users.get(challenge.to);
				toIdentity = toUser ? toUser.getIdentity() : ` ${challenge.to}`;
			} else {
				const fromUser = Users.get(challenge.from);
				fromIdentity = fromUser ? fromUser.getIdentity() : ` ${challenge.from}`;
				toIdentity = userIdentity;
			}
			messages += `|pm|${fromIdentity}|${toIdentity}|${this.getUpdate(challenge)}\n`;
		}
		connection.send(messages);
	}
} exports.Challenges = Challenges;

 const challenges = new Challenges(); exports.challenges = challenges;

 //# sourceMappingURL=sourceMaps/ladders-challenges.js.map