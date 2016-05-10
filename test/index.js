/**
 * Module dependencies
 */

var should = require('should');
var fs = require('fs');
var whatever = require('..');
var debug = require('debug')('whatever:test');

// clear screen
process.stdout.write('\u001B[2J');

describe('whatever', function(){

  describe('decode', function(){
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

  describe('readFile', function(){
    it('should decode ini files', function(done){
      whatever.readFile('./test/fixtures/test.ini', function(err, data) {
        if (err) return done(err);
        decode('ini', done);
      });
    });

    it('should decode yaml files', function(done){
      whatever.readFile('./test/fixtures/test.yaml', function(err, data) {
        if (err) return done(err);
        decode('yaml', done);
      });
    });

    it('should decode json files', function(done){
      whatever.readFile('./test/fixtures/test.json', function(err, data) {
        if (err) return done(err);
        decode('json', done);
      });
    });
  });

  describe('readFileSync', function(){
    it('should decode ini files synchronously', function(done){
      var data = whatever.readFileSync('./test/fixtures/test.ini');
      test(data, done);
    });

    it('should decode yaml files synchronously', function(done){
      var data = whatever.readFileSync('./test/fixtures/test.yaml');
      test(data, done);
    });

    it('should decode json files synchronously', function(done){
      var data = whatever.readFileSync('./test/fixtures/test.json');
      test(data, done);
    });
  });

});

/**
 * Decode file with `format`
 *
 * @param {String} format
 * @param {Function} callback
 */

function decode (format, callback) {
  fs.readFile('./test/fixtures/test.' + format, 'utf8', function(err, rawdata){
    if (err) return callback(err);
    var output = whatever.decode(rawdata);
    debug(format + ' output', output);
    test(output, callback);
  });
}

/**
 * Test that `data` is consistent
 *
 * @param {Object} data
 * @param {Function} callback
 */

function test (data, callback) {
  data.should.be.an.Object();
  data.should.have.properties('user', 'password', 'section');
  data.integer.should.equal(10);
  data.float.should.equal(1.1);
  data.is_true.should.equal(true);
  data.is_false.should.equal(false);
  data.user.should.equal('dbuser');
  data.password.should.equal('dbpassword');
  data.section.should.have.properties('database');
  data.section.database.should.have.properties('user');
  data.section.database.user.should.equal('nesteduser');
  callback();
}
