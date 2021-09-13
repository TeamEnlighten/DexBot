"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _createNamedExportFrom(obj, localName, importedName) { Object.defineProperty(exports, localName, {enumerable: true, get: () => obj[importedName]}); } function _createStarExport(obj) { Object.keys(obj) .filter((key) => key !== "default" && key !== "__esModule") .forEach((key) => { if (exports.hasOwnProperty(key)) { return; } Object.defineProperty(exports, key, {enumerable: true, get: () => obj[key]}); }); }/**
 * Simulator
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Here's where all the simulator APIs get exported for general use.
 * `require('pokemon-showdown')` imports from here.
 *
 * @license MIT
 */

// battle simulation

var _battle = require('./battle'); _createNamedExportFrom(_battle, 'Battle', 'Battle');
var _battlestream = require('./battle-stream'); _createNamedExportFrom(_battlestream, 'BattleStream', 'BattleStream'); _createNamedExportFrom(_battlestream, 'getPlayerStreams', 'getPlayerStreams');
var _pokemon = require('./pokemon'); _createNamedExportFrom(_pokemon, 'Pokemon', 'Pokemon');
var _prng = require('./prng'); _createNamedExportFrom(_prng, 'PRNG', 'PRNG');
var _side = require('./side'); _createNamedExportFrom(_side, 'Side', 'Side');

// dex API

var _dex = require('./dex'); _createNamedExportFrom(_dex, 'Dex', 'Dex'); _createNamedExportFrom(_dex, 'toID', 'toID');

// teams API

var _teams = require('./teams'); _createNamedExportFrom(_teams, 'Teams', 'Teams');
var _teamvalidator = require('./team-validator'); _createNamedExportFrom(_teamvalidator, 'TeamValidator', 'TeamValidator');

// misc libraries

var _lib = require('../.lib-dist'); _createStarExport(_lib);

 //# sourceMappingURL=sourceMaps/index.js.map