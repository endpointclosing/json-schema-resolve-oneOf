require('chai').should();

var refParser = require('json-schema-ref-parser');
var requireYaml = (file) => require('js-yaml').safeLoad(require('fs').readFileSync(require('path').resolve(__dirname, file), 'utf8'));

var resolveOneOf = require('../index');

describe('JSON schema resolve allof', function() {

  
  describe('Primitives', function(){  
    it('should work on primitives', function(){
        resolveOneOf("foo").should.equal("foo");
        resolveOneOf(4).should.equal(4);
        resolveOneOf(3.14159).should.equal(3.14159);
        
        resolveOneOf(undefined);
        resolveOneOf(null);
    });
  });
  
  describe('Arrays', function(){
      it('should work on arrays', function(){
          resolveOneOf([1]).should.deep.equal([1]);
          resolveOneOf(["foo"]).should.deep.equal(["foo"]);
      });
      it('should work on empty arrays', function(){
          resolveOneOf([]).should.deep.equal([]);
      });
  });

  describe('Objects', function(){
      it('should work on empty objects', function(){
          resolveOneOf({}).should.deep.equal({});
      });
      it('should work on simple objects', function(){
          resolveOneOf({foo:"bar"}).should.deep.equal({foo:"bar"});
      });
      it('should work on null field objects', function(){
          resolveOneOf({foo:undefined}).should.deep.equal({foo:undefined});
          
          var case2 = {foo:[]};
          delete case2.foo;
          resolveOneOf(case2).should.deep.equal({});

          var case3 = {foo:{}};
          delete case3.foo;
          resolveOneOf(case3).should.deep.equal({});
          
          var case4 = {foo:{}};
          case4.foo = undefined;
          resolveOneOf(case4).should.deep.equal({foo:undefined});
          
          var case5 = {foo:{}};
          case5.foo = null;
          resolveOneOf(case5).should.deep.equal({foo:null});

      });
  });
 
  describe('Composition', function(){
      it('should work on simple composition', function(){
          importedTestCase('./simpleComposition','./simpleComposition-expected');
      });
      
      it('should work on simple composition and complex parsing', function(done){
          importedComplexTestCase('./simpleComposition','./simpleComposition-expected', done);
      });
      
      it('should work with crazy nested composition', function(done){
          importedComplexTestCase('./nestedRefs','./nestedRefs-expected', done);
      });

      it('should work with a full Swagger spec', function(done){
          importedComplexYamlTestCase('./swagger.yaml','./swagger-expected.yaml', done);
      });
      
      
  });

  
});

function importedTestCase(input, expected){
  var inputobj = require(input);
  var expectedobj = require(expected);
  resolveOneOf(inputobj).should.deep.equal(expectedobj);    
}

function importedComplexTestCase(input, expected, done){
  var inputobj = require(input);
  var expectedobj = require(expected);
  
  refParser.dereference(inputobj)
  .then(function(schema) {
    resolveOneOf(schema).should.deep.equal(expectedobj);
    done();
  })
  .catch(done);
}

function importedComplexYamlTestCase(input, expected, done){
  var inputobj = requireYaml(input);
  var expectedobj = requireYaml(expected);
  
  refParser.dereference(inputobj)
  .then(function(schema) {
    resolveOneOf(schema).should.deep.equal(expectedobj);
    done();
  })
  .catch(done);
}