/**
 * Module dependencies
 */

var yaml = require('js-yaml');
var ini = require('ini');
var hjson = require('hjson');
var fs = require('fs');
var debug = require('debug')('whatever-format');
var {extname, basename} = require('path');

/**
 * Character codes
 */

const DOT = '.'.charCodeAt(0);
const OPEN_CURLY = '{'.charCodeAt(0);
const OPEN_SQUARE = '['.charCodeAt(0);
const PERCENT = '%'.charCodeAt(0);
const SLASH = '/'.charCodeAt(0);

/**
 * Expose `decode` as the module
 */

exports = module.exports = decode;
exports.decode = decode;

/**
 * Decode the formatted `string` into
 * a nested object.
 *
 * @param {String} string
 * @param {Object} [opts]
 */

function decode(string, opts) {
  string = string.trim();
  if (!string) return {};

  opts = opts || {};
  if (opts.coerce === undefined) opts.coerce = 1;

  var error;
  var data;
  var format = opts.format || judgeFormat(string);

  if (format) {
    ({
      ini: parseINI,
      yaml: parseYAML,
      json: parseJSON
    })[format]();
    if (data) return data;
    throw error;
  }

  if (parseINI()) return data;
  if (parseYAML()) return data;
  if (parseJSON()) return data;

  throw new Error('failed to decode string');

  function parseINI() {
    if (!run(ini.parse)) return;
    if (opts.coerce) data = coerceValues(data);
    debug('ini parsed', data);
    return data;
  }

  function parseYAML() {
    if (!run(yaml.load)) return;
    debug('yaml parsed', data);
    return data;
  }

  function parseJSON() {
    if (!run(hjson.parse)) return;
    debug('json parsed', data);
    return data;
  }

  function run(fn) {
    try {
      return data = fn(string);
    } catch(e) {
      error = e;
    }
  }
}

/**
 * Read file at `path` and call
 * `fn` with decoded data.
 *
 * @param {String} path
 * @param {Object} [opts]
 * @param {Function} fn
 */

exports.readFile = function readFile(path, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts;
    opts = {};
  }

  opts = opts || {};
  opts.format = opts.format || resolveFileType(path);

  fs.readFile(path, 'utf8', function(err, data){
    if (err) return fn(err);
    fn(null, exports.decode(data, opts));
  });
};

/**
 * Read file at `path` synchronously
 * and return decoded data.
 *
 * @param {String} path
 * @param {Object} [opts]
 */

exports.readFileSync = function readFileSync(path, opts) {
  opts = opts || {};
  opts.format = opts.format || resolveFileType(path);

  var data = fs.readFileSync(path, 'utf8');
  return exports.decode(data, opts);
};

/**
 * Coerce all the values of a `hash`
 * @param {Object} hash
 */

function coerceValues(hash) {
  var out = {};
  for (var k in hash) {
    var v = hash[k];
    out[k] = typeof v === 'string' ? coerce(v) : v;
  }
  return out;
}

/**
 * Coerce a string
 * @param {String} str
 */

function coerce(str) {
  if (str === 'false') return false;
  if (str === 'true') return true;
  if (/^\d*.\d*$/.test(str)) return parseFloat(str);
  if (/^\d*$/.test(str)) return parseInt(str);
  return str;
}

function resolveFileType(path) {
  var file = basename(path);

  if (isDotfile(path)) return ({
    env: 'ini'
  })[file.slice(1)];

  return ({
    ini: 'ini',
    json: 'json', js: 'json',
    yaml: 'yaml', yml: 'yaml'
  })[extname(file)];
}

function isDotfile(file) {
  return file.charCodeAt(0) === 'DOT';
}

function judgeFormat(str) {
  var parts = str.split('\n');
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i].trim();
    var first = part.charCodeAt(0);
    if (first === OPEN_CURLY) return 'json';
    if (first === PERCENT) return 'yaml';
    if (/^\w*\s*?=/.test(part)) return 'ini';
    if (/^\w*\s*?:/.test(part)) return 'yaml';
  }
}
