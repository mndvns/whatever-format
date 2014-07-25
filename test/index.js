/**
 * Module dependencies
 */

var should = require('should');
var fs = require('fs');
var whatever = require('..');
var debug = require('debug')('whatever:test');

// clear screen
process.stdout.write('\u001B[2J');

describe('whatever.decode', function(){

  it('should decode ini strings', function(done){
    decode('ini', done);
  });

  it('should decode yaml strings', function(done){
    decode('yaml', done);
  });

  it('should decode json strings', function(done){
    decode('json', done);
  });

});

/**
 * Decode file at `path`
 *
 * @param {String} format
 * @param {String} path
 * @param {Function} callback
 */

function decode (format, callback) {
  fs.readFile('./test/fixtures/test.' + format, 'utf8', function(err, rawdata){
    if (err) return callback(err);
    var output = whatever.decode(rawdata);
    debug(format + ' output', output);
    output.should.be.an.object;
    output.should.have.properties('user', 'password', 'section');
    output.user.should.equal('dbuser');
    output.password.should.equal('dbpassword');
    output.section.should.have.properties('database');
    output.section.database.should.have.properties('user');
    output.section.database.user.should.equal('nesteduser');
    callback();
  });
}
