/**
 * Module dependencies
 */

var yaml = require('js-yaml');
var ini = require('ini');

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
