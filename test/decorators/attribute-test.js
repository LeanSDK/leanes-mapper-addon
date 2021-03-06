const { expect, assert } = require('chai');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, meta, plugin
} = LeanES.NS;

describe('attribute', () => {
  describe('attribute(opts)', () => {
    it('should add attributes in metaObject', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { attribute } = Test.NS;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @attribute({ type: 'string' }) test = 'test';
        }
        assert.isOk(TestRecord.metaObject.parent.data.attributes.test);
        assert.equal(TestRecord.metaObject.parent.data.attributes.test.type, 'string');
        assert.isOk(TestRecord.metaObject.parent.data.instanceVariables.test);
      }).to.not.throw(Error);
    });
    it('should add attributes in metaObject(fail)', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { attribute } = Test.NS;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @attribute({ type: 'string' }) static test = 'test';
        }
        assert.isOk(TestRecord.metaObject.parent.data.attributes.test);
        assert.equal(TestRecord.metaObject.parent.data.attributes.test.type, 'string');
        assert.isOk(TestRecord.metaObject.parent.data.instanceVariables.test);
      }).to.throw(Error);
    });
    it('option `type` is required', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { attribute } = Test.NS;

        @initialize
        @partOf(Test)
        class TestRecord extends Test.NS.Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @attribute() test;
        }
      }).to.throw(Error);
    });
  });
});
