"use strict";/**
 * Battle Stream Example
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Example of how to create AIs battling against each other.
 * Run this using `node build && node .sim-dist/examples/battle-stream-example`.
 *
 * @license MIT
 * @author Guangcong Luo <guangcongluo@gmail.com>
 */

var _ = require('..');
var _randomplayerai = require('../tools/random-player-ai');

/*********************************************************************
 * Run AI
 *********************************************************************/

const streams = _.getPlayerStreams.call(void 0, new (0, _.BattleStream)());

const spec = {
	formatid: "gen7customgame",
};
const p1spec = {
	name: "Bot 1",
	team: _.Teams.pack(_.Teams.generate('gen7randombattle')),
};
const p2spec = {
	name: "Bot 2",
	team: _.Teams.pack(_.Teams.generate('gen7randombattle')),
};

const p1 = new (0, _randomplayerai.RandomPlayerAI)(streams.p1);
const p2 = new (0, _randomplayerai.RandomPlayerAI)(streams.p2);

console.log("p1 is " + p1.constructor.name);
console.log("p2 is " + p2.constructor.name);

void p1.start();
void p2.start();

void (async () => {
	for await (const chunk of streams.omniscient) {
		console.log(chunk);
	}
})();

void streams.omniscient.write(`>start ${JSON.stringify(spec)}
>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`);

 //# sourceMappingURL=sourceMaps/battle-stream-example.js.map