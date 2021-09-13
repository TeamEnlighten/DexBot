"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * FS
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * An abstraction layer around Node's filesystem.
 *
 * Advantages:
 * - write() etc do nothing in unit tests
 * - paths are always relative to PS's base directory
 * - Promises (seriously wtf Node Core what are you thinking)
 * - PS-style API: FS("foo.txt").write("bar") for easier argument order
 * - mkdirp
 *
 * FS is used nearly everywhere, but exceptions include:
 * - crashlogger.js - in case the crash is in here
 * - repl.js - which use Unix sockets out of this file's scope
 * - launch script - happens before modules are loaded
 * - sim/ - intended to be self-contained
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */

var _fs = require('fs'); var fs = _fs;
var _path = require('path'); var pathModule = _path;
var _streams = require('./streams');

const ROOT_PATH = pathModule.resolve(__dirname, '..');













if (!global.__fsState) {
	global.__fsState = {
		pendingUpdates: new Map(),
	};
}

 class FSPath {
	

	constructor(path) {
		this.path = pathModule.resolve(ROOT_PATH, path);
	}

	parentDir() {
		return new FSPath(pathModule.dirname(this.path));
	}

	read(options = 'utf8') {
		if (typeof options !== 'string' && options.encoding === undefined) {
			options.encoding = 'utf8';
		}
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, options, (err, data) => {
				err ? reject(err) : resolve(data );
			});
		});
	}

	readSync(options = 'utf8') {
		if (typeof options !== 'string' && options.encoding === undefined) {
			options.encoding = 'utf8';
		}
		return fs.readFileSync(this.path, options );
	}

	readBuffer(options = {}) {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, options, (err, data) => {
				err ? reject(err) : resolve(data );
			});
		});
	}

	readBufferSync(options = {}) {
		return fs.readFileSync(this.path, options );
	}

	exists() {
		return new Promise(resolve => {
			fs.exists(this.path, exists => {
				resolve(exists);
			});
		});
	}

	existsSync() {
		return fs.existsSync(this.path);
	}

	readIfExists() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, 'utf8', (err, data) => {
				if (err && err.code === 'ENOENT') return resolve('');
				err ? reject(err) : resolve(data);
			});
		});
	}

	readIfExistsSync() {
		try {
			return fs.readFileSync(this.path, 'utf8');
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
		return '';
	}

	write(data, options = {}) {
		if (_optionalChain([global, 'access', _ => _.Config, 'optionalAccess', _2 => _2.nofswriting])) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.writeFile(this.path, data, options, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	writeSync(data, options = {}) {
		if (_optionalChain([global, 'access', _3 => _3.Config, 'optionalAccess', _4 => _4.nofswriting])) return;
		return fs.writeFileSync(this.path, data, options);
	}

	/**
	 * Writes to a new file before renaming to replace an old file. If
	 * the process crashes while writing, the old file won't be lost.
	 * Does not protect against simultaneous writing; use writeUpdate
	 * for that.
	 */
	async safeWrite(data, options = {}) {
		await exports.FS.call(void 0, this.path + '.NEW').write(data, options);
		await exports.FS.call(void 0, this.path + '.NEW').rename(this.path);
	}

	safeWriteSync(data, options = {}) {
		exports.FS.call(void 0, this.path + '.NEW').writeSync(data, options);
		exports.FS.call(void 0, this.path + '.NEW').renameSync(this.path);
	}

	/**
	 * Safest way to update a file with in-memory state. Pass a callback
	 * that fetches the data to be written. It will write an update,
	 * avoiding race conditions. The callback may not necessarily be
	 * called, if `writeUpdate` is called many times in a short period.
	 *
	 * `options.throttle`, if it exists, will make sure updates are not
	 * written more than once every `options.throttle` milliseconds.
	 *
	 * No synchronous version because there's no risk of race conditions
	 * with synchronous code; just use `safeWriteSync`.
	 */
	writeUpdate(dataFetcher, options = {}) {
		if (_optionalChain([global, 'access', _5 => _5.Config, 'optionalAccess', _6 => _6.nofswriting])) return;
		const pendingUpdate = __fsState.pendingUpdates.get(this.path);

		const throttleTime = options.throttle ? Date.now() + options.throttle : 0;

		if (pendingUpdate) {
			pendingUpdate.pendingDataFetcher = dataFetcher;
			pendingUpdate.pendingOptions = options;
			if (pendingUpdate.throttleTimer && throttleTime < pendingUpdate.throttleTime) {
				pendingUpdate.throttleTime = throttleTime;
				clearTimeout(pendingUpdate.throttleTimer);
				pendingUpdate.throttleTimer = setTimeout(() => this.checkNextUpdate(), throttleTime - Date.now());
			}
			return;
		}

		if (!throttleTime) {
			this.writeUpdateNow(dataFetcher, options);
			return;
		}

		const update = {
			isWriting: false,
			pendingDataFetcher: dataFetcher,
			pendingOptions: options,
			throttleTime,
			throttleTimer: setTimeout(() => this.checkNextUpdate(), throttleTime - Date.now()),
		};
		__fsState.pendingUpdates.set(this.path, update);
	}

	writeUpdateNow(dataFetcher, options) {
		const throttleTime = options.throttle ? Date.now() + options.throttle : 0;
		const update = {
			isWriting: true,
			pendingDataFetcher: null,
			pendingOptions: null,
			throttleTime,
			throttleTimer: null,
		};
		__fsState.pendingUpdates.set(this.path, update);
		void this.safeWrite(dataFetcher(), options).then(() => this.finishUpdate());
	}
	checkNextUpdate() {
		const pendingUpdate = __fsState.pendingUpdates.get(this.path);
		if (!pendingUpdate) throw new Error(`FS: Pending update not found`);
		if (pendingUpdate.isWriting) throw new Error(`FS: Conflicting update`);

		const {pendingDataFetcher: dataFetcher, pendingOptions: options} = pendingUpdate;
		if (!dataFetcher || !options) {
			// no pending update
			__fsState.pendingUpdates.delete(this.path);
			return;
		}

		this.writeUpdateNow(dataFetcher, options);
	}
	finishUpdate() {
		const pendingUpdate = __fsState.pendingUpdates.get(this.path);
		if (!pendingUpdate) throw new Error(`FS: Pending update not found`);
		if (!pendingUpdate.isWriting) throw new Error(`FS: Conflicting update`);

		pendingUpdate.isWriting = false;
		const throttleTime = pendingUpdate.throttleTime;
		if (!throttleTime || throttleTime < Date.now()) {
			this.checkNextUpdate();
			return;
		}

		pendingUpdate.throttleTimer = setTimeout(() => this.checkNextUpdate(), throttleTime - Date.now());
	}

	append(data, options = {}) {
		if (_optionalChain([global, 'access', _7 => _7.Config, 'optionalAccess', _8 => _8.nofswriting])) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.appendFile(this.path, data, options, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	appendSync(data, options = {}) {
		if (_optionalChain([global, 'access', _9 => _9.Config, 'optionalAccess', _10 => _10.nofswriting])) return;
		return fs.appendFileSync(this.path, data, options);
	}

	symlinkTo(target) {
		if (_optionalChain([global, 'access', _11 => _11.Config, 'optionalAccess', _12 => _12.nofswriting])) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.symlink(target, this.path, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	symlinkToSync(target) {
		if (_optionalChain([global, 'access', _13 => _13.Config, 'optionalAccess', _14 => _14.nofswriting])) return;
		return fs.symlinkSync(target, this.path);
	}

	copyFile(dest) {
		if (_optionalChain([global, 'access', _15 => _15.Config, 'optionalAccess', _16 => _16.nofswriting])) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.copyFile(this.path, dest, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	rename(target) {
		if (_optionalChain([global, 'access', _17 => _17.Config, 'optionalAccess', _18 => _18.nofswriting])) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.rename(this.path, target, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	renameSync(target) {
		if (_optionalChain([global, 'access', _19 => _19.Config, 'optionalAccess', _20 => _20.nofswriting])) return;
		return fs.renameSync(this.path, target);
	}

	readdir() {
		return new Promise((resolve, reject) => {
			fs.readdir(this.path, (err, data) => {
				err ? reject(err) : resolve(data);
			});
		});
	}

	readdirSync() {
		return fs.readdirSync(this.path);
	}

	createReadStream() {
		return new FileReadStream(this.path);
	}

	createWriteStream(options = {}) {
		if (_optionalChain([global, 'access', _21 => _21.Config, 'optionalAccess', _22 => _22.nofswriting])) {
			// @ts-ignore
			return new (0, _streams.WriteStream)({write() {}});
		}
		// @ts-ignore
		return new (0, _streams.WriteStream)(fs.createWriteStream(this.path, options));
	}

	createAppendStream(options = {}) {
		if (_optionalChain([global, 'access', _23 => _23.Config, 'optionalAccess', _24 => _24.nofswriting])) {
			// @ts-ignore
			return new (0, _streams.WriteStream)({write() {}});
		}
		// @ts-ignore
		options.flags = options.flags || 'a';
		// @ts-ignore
		return new (0, _streams.WriteStream)(fs.createWriteStream(this.path, options));
	}

	unlinkIfExists() {
		if (_optionalChain([global, 'access', _25 => _25.Config, 'optionalAccess', _26 => _26.nofswriting])) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.unlink(this.path, err => {
				if (err && err.code === 'ENOENT') return resolve();
				err ? reject(err) : resolve();
			});
		});
	}

	unlinkIfExistsSync() {
		if (_optionalChain([global, 'access', _27 => _27.Config, 'optionalAccess', _28 => _28.nofswriting])) return;
		try {
			fs.unlinkSync(this.path);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
	}

	async rmdir(recursive) {
		if (_optionalChain([global, 'access', _29 => _29.Config, 'optionalAccess', _30 => _30.nofswriting])) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.rmdir(this.path, {recursive}, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	rmdirSync(recursive) {
		if (_optionalChain([global, 'access', _31 => _31.Config, 'optionalAccess', _32 => _32.nofswriting])) return;
		return fs.rmdirSync(this.path, {recursive});
	}

	mkdir(mode = 0o755) {
		if (_optionalChain([global, 'access', _33 => _33.Config, 'optionalAccess', _34 => _34.nofswriting])) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.mkdir(this.path, mode, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	mkdirSync(mode = 0o755) {
		if (_optionalChain([global, 'access', _35 => _35.Config, 'optionalAccess', _36 => _36.nofswriting])) return;
		return fs.mkdirSync(this.path, mode);
	}

	mkdirIfNonexistent(mode = 0o755) {
		if (_optionalChain([global, 'access', _37 => _37.Config, 'optionalAccess', _38 => _38.nofswriting])) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.mkdir(this.path, mode, err => {
				if (err && err.code === 'EEXIST') return resolve();
				err ? reject(err) : resolve();
			});
		});
	}

	mkdirIfNonexistentSync(mode = 0o755) {
		if (_optionalChain([global, 'access', _39 => _39.Config, 'optionalAccess', _40 => _40.nofswriting])) return;
		try {
			fs.mkdirSync(this.path, mode);
		} catch (err) {
			if (err.code !== 'EEXIST') throw err;
		}
	}

	/**
	 * Creates the directory (and any parent directories if necessary).
	 * Does not throw if the directory already exists.
	 */
	async mkdirp(mode = 0o755) {
		try {
			await this.mkdirIfNonexistent(mode);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
			await this.parentDir().mkdirp(mode);
			await this.mkdirIfNonexistent(mode);
		}
	}

	/**
	 * Creates the directory (and any parent directories if necessary).
	 * Does not throw if the directory already exists. Synchronous.
	 */
	mkdirpSync(mode = 0o755) {
		try {
			this.mkdirIfNonexistentSync(mode);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
			this.parentDir().mkdirpSync(mode);
			this.mkdirIfNonexistentSync(mode);
		}
	}

	/** Calls the callback if the file is modified. */
	onModify(callback) {
		fs.watchFile(this.path, (curr, prev) => {
			if (curr.mtime > prev.mtime) return callback();
		});
	}

	/** Clears callbacks added with onModify(). */
	unwatch() {
		fs.unwatchFile(this.path);
	}

	async isFile() {
		return new Promise((resolve, reject) => {
			fs.stat(this.path, (err, stats) => {
				err ? reject(err) : resolve(stats.isFile());
			});
		});
	}

	isFileSync() {
		return fs.statSync(this.path).isFile();
	}

	async isDirectory() {
		return new Promise((resolve, reject) => {
			fs.stat(this.path, (err, stats) => {
				err ? reject(err) : resolve(stats.isDirectory());
			});
		});
	}

	isDirectorySync() {
		return fs.statSync(this.path).isDirectory();
	}

	async realpath() {
		return new Promise((resolve, reject) => {
			fs.realpath(this.path, (err, path) => {
				err ? reject(err) : resolve(path);
			});
		});
	}

	realpathSync() {
		return fs.realpathSync(this.path);
	}
} exports.FSPath = FSPath;

class FileReadStream extends _streams.ReadStream {
	

	constructor(file) {
		super();
		this.fd = new Promise((resolve, reject) => {
			fs.open(file, 'r', (err, fd) => err ? reject(err) : resolve(fd));
		});
		this.atEOF = false;
	}

	_read(size = 16384) {
		return new Promise((resolve, reject) => {
			if (this.atEOF) return resolve();
			this.ensureCapacity(size);
			void this.fd.then(fd => {
				fs.read(fd, this.buf, this.bufEnd, size, null, (err, bytesRead, buf) => {
					if (err) return reject(err);
					if (!bytesRead) {
						this.atEOF = true;
						this.resolvePush();
						return resolve();
					}
					this.bufEnd += bytesRead;
					// throw new Error([...this.buf].map(x => x.toString(16)).join(' '));
					this.resolvePush();
					resolve();
				});
			});
		});
	}

	_destroy() {
		return new Promise(resolve => {
			void this.fd.then(fd => {
				fs.close(fd, () => resolve());
			});
		});
	}
}

function getFs(path) {
	return new FSPath(path);
}

 const FS = Object.assign(getFs, {
	FileReadStream, FSPath,
}); exports.FS = FS;

 //# sourceMappingURL=sourceMaps/fs.js.map