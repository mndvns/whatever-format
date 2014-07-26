/**
 * Module dependencies
 */

var yaml = require('js-yaml');
var ini = require('ini');
var fs = require('fs');

/**
 * Decode the formatted `string` into
 * a nested object.
 *
 * @param {String} string
 */

exports.decode = function decode (string){
  var debug = require('debug')('whatever:decode');

  // first we discern whether or not we're
  // dealing with an `ini` file
  var lines = string.split('\n');
  var m;
  while (lines.length && !m) {
    m = /^\[\]$|=/.exec(lines.shift())
    // debug('ini regexp', m);
  }

  var data;
  if (m) {

    // ini
    try { data = ini.parse(string) } catch(e){}
    debug('ini parsed', data);
    if (data) return data;

  } else {

    // yaml
    try { data = yaml.load(string) } catch(e){}
    debug('yaml parsed', data);
    if (data) return data;

    // json
    try { data = JSON.parse(data) } catch(e){}
    debug('json parsed', data);
    if (data) return data;

  }

  // if we made it this far, return an empty object
  return {};
}
/**
 * Read file at `path` and call
 * `fn` with decoded data.
 *
 * @param {String} path
 * @param {Function} fn
 */

exports.readFile = function readFile (path, fn) {
  fs.readFile(path, 'utf8', function(err, data){
    if (err) return fn(err);
    fn(null, exports.decode(data));
  });
};

/**
 * Read file at `path` synchronously
 * and return decoded data.
 *
 * @param {String} path
 */

exports.readFileSync = function readFileSync (path) {
  var data = fs.readFileSync(path, 'utf8');
  return exports.decode(data);
};
