/**
 * Module dependencies
 */

var yaml = require('js-yaml');
var ini = require('ini');
var fs = require('fs');
var debug = require('debug')('whatever-format');

/**
 * Decode the formatted `string` into
 * a nested object.
 *
 * @param {String} string
 * @param {Object} [opts]
 */

exports.decode = function decode(string, opts) {
  opts = opts || {coerce: 1};

  // first we discern whether or not we're
  // dealing with an `ini` file
  var lines = string.split('\n');
  var m;
  while (lines.length && !m) {
    m = /^\[\]$|=/.exec(lines.shift())
  }

  var data;
  if (m) {

    // ini
    try { data = ini.parse(string) } catch(e){}
    if (data && opts.coerce) data = coerceValues(data);
    debug('ini parsed', data);
    if (data) return data;

  } else {

    // json
    try { data = JSON.parse(data) } catch(e){}
    debug('json parsed', data);
    if (data) return data;

    // yaml
    try { data = yaml.load(string) } catch(e){}
    debug('yaml parsed', data);
    if (data) return data;

  }

  throw new Error('failed to decode string');
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
