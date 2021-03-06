const { expect, assert } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, partOf, nameBy, meta, constant, method, mixin, plugin, property,
} = LeanES.NS;

describe('Record', () => {
  describe('.new', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should create record instance', () => {
      expect(() => {
        const collectionName = 'TestsCollection';
        const KEY = 'TEST_RECORD_001';

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { Record, attribute, computed } = Test.NS;

        @initialize
        @partOf(Test)
        class ApplicationFacade extends Test.NS.Facade {
          @nameBy static __filename = 'ApplicationFacade';
          @meta static object = {};
        }
        facade = ApplicationFacade.getInstance(KEY);

        @initialize
        @partOf(Test)
        @mixin(Test.NS.GenerateUuidIdMixin)
        class TestsCollection extends Test.NS.Collection {
          @nameBy static __filename = 'TestsCollection';
          @meta static object = {};
        }

        @initialize
        @partOf(Test)
        class TestRecord extends Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return Test.NS.TestRecord;
          }
          @attribute({ type: 'string' }) test;
        }

        facade.addProxy(collectionName, 'TestsCollection', {
          delegate: 'TestRecord',
          adapter: Test.NS.MEMORY_ADAPTER
        });
        const collection = facade.retrieveProxy(collectionName);
        const record = TestRecord.new({
          type: 'Test::TestRecord'
        }, collection);
        assert.instanceOf(record, TestRecord, 'Not a TestRecord');
        assert.instanceOf(record, Test.NS.Record, 'Not a Record');
      }).to.not.throw(Error);
    });
  });
  describe('.parseRecordName', () => {
    it('should record name from text', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { Record, attribute, computed } = Test.NS;

        @initialize
        @partOf(Test)
        @mixin(Test.NS.GenerateUuidIdMixin)
        class TestsCollection extends Test.NS.Collection {
          @nameBy static __filename = 'TestsCollection';
          @meta static object = {};
        }

        @initialize
        @partOf(Test)
        class TestRecord extends Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @attribute({ type: 'string' }) test;
        }
        let parsedName = TestRecord.parseRecordName('test-record');
        assert.deepEqual(parsedName, ['Test', 'TestRecord'], 'Parsed incorrectly');
        parsedName = TestRecord.parseRecordName('Tester::Test');
        assert.deepEqual(parsedName, ['Tester', 'TestRecord'], 'Parsed incorrectly');
      }).to.not.throw(Error);
    });
  });
  describe('.parseRecordName', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should record name in instance from text', () => {
      expect(() => {
        const collectionName = 'TestsCollection';
        const KEY = 'TEST_RECORD_003';

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { Record, attribute, computed } = Test.NS;

        @initialize
        @partOf(Test)
        class ApplicationFacade extends Test.NS.Facade {
          @nameBy static __filename = 'ApplicationFacade';
          @meta static object = {};
        }
        facade = ApplicationFacade.getInstance(KEY);

        @initialize
        @partOf(Test)
        @mixin(Test.NS.GenerateUuidIdMixin)
        class TestsCollection extends Test.NS.Collection {
          @nameBy static __filename = 'TestsCollection';
          @meta static object = {};
        }

        @initialize
        @partOf(Test)
        class TestRecord extends Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @attribute({ type: 'string' }) test;
        }

        facade.addProxy(collectionName, 'TestsCollection', {
          delegate: 'TestRecord',
          adapter: Test.NS.MEMORY_ADAPTER
        });
        const collection = facade.retrieveProxy(collectionName);
        const vsRecord = TestRecord.new({
          type: 'Test::TestRecord'
        }, collection);
        let parsedName = vsRecord.parseRecordName('test-record');
        assert.deepEqual(parsedName, ['Test', 'TestRecord'], 'Parsed incorrectly');
        parsedName = vsRecord.parseRecordName('Tester::Test');
        assert.deepEqual(parsedName, ['Tester', 'TestRecord'], 'Parsed incorrectly');
      }).to.not.throw(Error);
    });
  });
  describe('.parentClassNames', () => {
    it('should get records class parent class names', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { Record, attribute, computed } = Test.NS;

        @initialize
        @partOf(Test)
        @mixin(Test.NS.GenerateUuidIdMixin)
        class TestsCollection extends Test.NS.Collection {
          @nameBy static __filename = 'TestsCollection';
          @meta static object = {};
        }

        @initialize
        @partOf(Test)
        class TestRecord extends Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @attribute({ type: 'string' }) test;
        }
        const classNames = TestRecord.parentClassNames();
        assert.deepEqual(classNames, ['CoreObject', 'ChainsMixin', 'Record', 'TestRecord', 'TestRecord'], 'Parsed incorrectly');
      }).to.not.throw(Error);
    });
  });
  describe('.attribute, .attr', () => {
    it('should define attributes for class', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { Record, attribute, computed } = Test.NS;

        @initialize
        @partOf(Test)
        @mixin(Test.NS.GenerateUuidIdMixin)
        class TestsCollection extends Test.NS.Collection {
          @nameBy static __filename = 'TestsCollection';
          @meta static object = {};
        }

        @initialize
        @partOf(Test)
        class TestRecord extends Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @attribute({ type: 'string' }) string;
          @attribute({ type: 'number' }) number;
          @attribute({ type: 'date' }) date;
          @attribute({ type: 'boolean' }) boolean;
        }
        assert.isTrue('string' in TestRecord.attributes, 'Attribute `string` did not defined');
        assert.isTrue('number' in TestRecord.attributes, 'Attribute `number` did not defined');
        assert.isTrue('boolean' in TestRecord.attributes, 'Attribute `boolean` did not defined');
        assert.isTrue('date' in TestRecord.attributes, 'Attribute `date` did not defined');
      }).to.not.throw(Error);
    });
  });
  describe('.computed, .comp', () => {
    it('should define computed properties for class', () => {
      expect(() => {

        @initialize
        @plugin(MapperAddon)
        class Test extends LeanES {
          @nameBy static __filename = 'Test';
          @meta static object = {};
        }
        const { Record, attribute, computed } = Test.NS;

        @initialize
        @partOf(Test)
        @mixin(Test.NS.GenerateUuidIdMixin)
        class TestsCollection extends Test.NS.Collection {
          @nameBy static __filename = 'TestsCollection';
          @meta static object = {};
        }

        @initialize
        @partOf(Test)
        class TestRecord extends Record {
          @nameBy static __filename = 'TestRecord';
          @meta static object = {};
          @method static findRecordByName() {
            return TestRecord;
          }
          @attribute({ type: 'string' }) test;
          @computed({ type: 'string' }) get computedTestProp() {
            return this.test;
          }
        }
        assert.isTrue('computedTestProp' in TestRecord.computeds, 'Computed property `computedTestProp` did not defined');
      }).to.not.throw(Error);
    });
  });
  describe('.create, .isNew', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should create new record', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_007';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.getProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord'
      }, collection);
      assert.isTrue(await record.isNew(), 'Record is not new');
      await record.create();
      assert.isFalse(await record.isNew(), 'Record is still new');
    });
  });
  describe('.destroy', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should remove record', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_008';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord'
      }, collection);
      assert.isTrue(await record.isNew(), 'Record is not new');
      await record.create();
      assert.isFalse(await record.isNew(), 'Record is still new');
      await record.destroy();
      assert.isFalse((await collection.find(record.id)) != null, 'Record still in collection');
    });
  });
  describe('.update', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should update record', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_009';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord',
        test: 'test1'
      }, collection);
      await record.create();
      assert.equal((await collection.find(record.id)).test, 'test1', 'Initial attr not saved');
      record.test = 'test2';
      await record.update();
      assert.equal((await collection.find(record.id)).test, 'test2', 'Updated attr not saved');
    });
  });
  describe('.clone', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should clone record', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_010';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord',
        test: 'test1'
      }, collection);
      const recordCopy = await record.clone();
      assert.equal(record.test, recordCopy.test);
      assert.notEqual(record.id, recordCopy.id);
    });
  });
  describe('.save', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should save record', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_011';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord',
        test: 'test1'
      }, collection);
      await record.save();
      assert.isTrue((await collection.find(record.id)) != null, 'Record is not saved');
    });
  });
  describe('.delete', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should create and then delete a record', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_012';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord',
        test: 'test1'
      }, collection);
      await record.save();
      assert.isTrue((await collection.find(record.id)) != null, 'Record is not saved');
      await record.delete();
      assert.isTrue((await collection.find(record.id)) == null, 'Record is not marked as delete');
    });
  });
  describe('.copy', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should create and then copy the record', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_013';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord',
        test: 'test1'
      }, collection);
      await record.save();
      assert.isTrue((await collection.find(record.id)) != null, 'Record is not saved');
      const newRecord = await record.copy();
      assert.isTrue((await collection.find(newRecord.id)) != null, 'Record copy not saved');
    });
  });
  describe('.decrement, .increment, .toggle', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should decrease/increase value of number attribute and toggle boolean', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_014';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'number' }) test;
        @attribute({ type: 'boolean' }) has;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord',
        test: 1000,
        has: true
      }, collection);
      await record.save();
      assert.equal(record.test, 1000, 'Initial number value is incorrect');
      assert.isTrue(record.has, 'Initial boolean value is incorrect');
      record.decrement('test', 7);
      assert.equal(record.test, 993, 'Descreased number value is incorrect');
      record.increment('test', 19);
      assert.equal(record.test, 1012, 'Increased number value is incorrect');
      record.toggle('has');
      assert.isFalse(record.has, 'Toggled boolean value is incorrect');
      record.toggle('has');
      assert.isTrue(record.has, 'Toggled boolean value is incorrect');
    });
  });
  describe('.updateAttribute, .updateAttributes', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should update attributes', () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_015';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'number' }) test;
        @attribute({ type: 'boolean' }) has;
        @attribute({ type: 'string' }) word;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      }, collection);
      record.save();
      assert.equal(record.test, 1000, 'Initial number value is incorrect');
      assert.isTrue(record.has, 'Initial boolean value is incorrect');
      record.updateAttribute('test', 200);
      assert.equal(record.test, 200, 'Number attribue not updated correctly');
      record.updateAttribute('word', 'word');
      assert.equal(record.word, 'word', 'String attribue not updated correctly');
      record.updateAttribute('has', false);
      assert.equal(record.has, false, 'Boolean attribue not updated correctly');
      record.updateAttributes({
        test: 888,
        has: true,
        word: 'other'
      });
      assert.equal(record.test, 888, 'Number attribue not updated correctly');
      assert.equal(record.has, true, 'Boolean attribue not updated correctly');
      assert.equal(record.word, 'other', 'String attribue not updated correctly');
    });
  });
  describe('.changedAttributes, .resetAttribute, .rollbackAttributes', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should test, reset and rollback attributes', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_017';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'number' }) test;
        @attribute({ type: 'boolean' }) has;
        @attribute({ type: 'string' }) word;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = TestRecord.new({
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      }, collection);
      await record.save();
      record.test = 888;
      assert.deepEqual((await record.changedAttributes()).test, [1000, 888], 'Update is incorrect');
      await record.resetAttribute('test');
      assert.isUndefined((await record.changedAttributes()).test, 'Reset is incorrect');
      record.test = 888;
      record.has = false;
      record.word = 'other';
      await record.rollbackAttributes();
      assert.equal(record.test, 1000, 'Number attribue did not rolled back correctly');
      assert.equal(record.has, true, 'Boolean attribue did not rolled back correctly');
      assert.equal(record.word, 'test', 'String attribue did not rolled back correctly');
    });
  });
  describe('.normalize, .serialize', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should serialize and deserialize attributes', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_018';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'number' }) test;
        @attribute({ type: 'boolean' }) has;
        @attribute({ type: 'string' }) word;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const [bh, payload] = await TestRecord.normalize({
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      }, collection);
      assert.propertyVal(payload, 'test', 1000, 'Property `test` not defined');
      assert.propertyVal(payload, 'has', true, 'Property `has` not defined');
      assert.propertyVal(payload, 'word', 'test', 'Property `word` not defined');
      const snapshot = await TestRecord.serialize(TestRecord.new(payload, collection));
      assert.deepEqual(snapshot, {
        id: null,
        type: 'Test::TestRecord',
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test',
      }, 'Snapshot is incorrect');
    });
  });
  describe('.recoverize, .objectize', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should recoverize and objectize attributes', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_019';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'number' }) test;
        @attribute({ type: 'boolean' }) has;
        @attribute({ type: 'string' }) word;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const [bh, payload] = await TestRecord.recoverize({
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      }, collection);
      assert.propertyVal(payload, 'test', 1000, 'Property `test` not defined');
      assert.propertyVal(payload, 'has', true, 'Property `has` not defined');
      assert.propertyVal(payload, 'word', 'test', 'Property `word` not defined');
      const snapshot = await TestRecord.objectize(TestRecord.new(payload, collection));
      assert.deepEqual(snapshot, {
        id: null,
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      }, 'JSON snapshot is incorrect');
    });
  });
  describe('.makeSnapshot', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should make snapshot for ipoInternalRecord', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_020';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'number' }) test;
        @attribute({ type: 'boolean' }) has;
        @attribute({ type: 'string' }) word;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const [bh, payload] = await TestRecord.normalize({
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      }, collection);
      assert.propertyVal(payload, 'test', 1000, 'Property `test` not defined');
      assert.propertyVal(payload, 'has', true, 'Property `has` not defined');
      assert.propertyVal(payload, 'word', 'test', 'Property `word` not defined');
      const snapshot = await TestRecord.makeSnapshot(TestRecord.new(payload, collection));
      assert.deepEqual(snapshot, {
        id: null,
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      }, 'JSON snapshot is incorrect');
    });
  });
  describe('.replicateObject', () => {
    let facade = null;
    afterEach(() => {
      return facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should create replica for record', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_021';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'number' }) test;
        @attribute({ type: 'boolean' }) has;
        @attribute({ type: 'string' }) word;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = await collection.create({
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      });
      const replica = await TestRecord.replicateObject(record);
      assert.deepEqual(replica, {
        type: 'instance',
        class: 'TestRecord',
        multitonKey: KEY,
        collectionName: collectionName,
        isNew: false,
        id: record.id
      });
      facade.remove();
    });
  });
  describe('.restoreObject', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should restore record from replica', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_022';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @method static findRecordByName() {
          return TestRecord;
        }
        @attribute({ type: 'number' }) test;
        @attribute({ type: 'boolean' }) has;
        @attribute({ type: 'string' }) word;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      let record = await collection.create({
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      });
      let restoredRecord = await TestRecord.restoreObject(Test, {
        type: 'instance',
        class: 'TestRecord',
        multitonKey: KEY,
        collectionName: collectionName,
        isNew: false,
        id: record.id
      });
      assert.notEqual(record, restoredRecord);
      assert.deepEqual(record, restoredRecord);
      record = await collection.build({
        id: '123',
        type: 'Test::TestRecord',
        test: 1000,
        has: true,
        word: 'test'
      });
      restoredRecord = await TestRecord.restoreObject(Test, {
        type: 'instance',
        class: 'TestRecord',
        multitonKey: KEY,
        collectionName: collectionName,
        isNew: true,
        attributes: {
          id: '123',
          type: 'Test::TestRecord',
          test: 1000,
          has: true,
          word: 'test'
        }
      });
      assert.notEqual(record, restoredRecord);
      assert.deepEqual(record, restoredRecord);
      facade.remove();
    });
  });
  describe('.afterCreate', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should be called after create', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_023';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const spyRunNotitfication = sinon.spy(collection, 'recordHasBeenChanged');
      const record = await collection.build({
        id: 123
      });
      await record.save();
      assert.isTrue(spyRunNotitfication.calledWith('createdRecord'), '`afterCreate` run incorrect');
    });
  });
  describe('.beforeUpdate', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should be called before update', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_024';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};

        @property test = 0;

        @method async beforeUpdate(...args) {
          this.test = 1;
          return args;
        }
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = await collection.build({
        id: 123
      });
      await record.save();
      const test = record.test;
      const updated = await record.save();
      assert.notEqual(test, updated.test, 'Record not updated');
      facade.remove();
    });
  });
  describe('.beforeCreate', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should be called before create', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_025';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = await collection.build({
        type: 'Test::TestRecord'
      });
      assert.isNull(record.id);
      await record.save();
      assert.isDefined(record.id);
      facade.remove();
    });
  });
  describe('.afterUpdate', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should be called after update', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_026';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const spyRunNotitfication = sinon.spy(collection, 'recordHasBeenChanged');
      const record = await collection.build({
        id: 123
      });
      await record.save();
      const updated = await record.save();
      assert.isTrue(spyRunNotitfication.calledWith('updatedRecord'), '`afterUpdate` run incorrect');
      facade.remove();
    });
  });
  describe('.beforeDelete', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should be called before delete', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_027';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @property test = 0;

        @method async beforeDelete(...args) {
          this.test = 1;
          return args;
        }
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const record = await collection.build({
        id: 123
      });
      await record.save();
      const test = record.test;
      const deleted = await record.delete();
      assert.notEqual(test, record.test, 'Record not updated');
      facade.remove();
    });
  });
  describe('.afterDelete', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should be called after delete', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_028';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const spyRunNotitfication = sinon.spy(collection, 'recordHasBeenChanged');
      const record = await collection.build({
        id: 123
      });
      await record.save();
      const deleted = await record.delete();
      assert.isTrue(spyRunNotitfication.calledWith('deletedRecord'), '`afterDelete` run incorrect');
      facade.remove();
    });
  });
  describe('.afterDestroy', () => {
    let facade = null;
    afterEach(() => {
      facade != null ? typeof facade.remove === "function" ? facade.remove() : void 0 : void 0;
    });
    it('should be called after destroy', async () => {
      const collectionName = 'TestsCollection';
      const KEY = 'TEST_RECORD_029';

      @initialize
      @plugin(MapperAddon)
      class Test extends LeanES {
        @nameBy static __filename = 'Test';
        @meta static object = {};
      }
      const { Record, attribute, computed } = Test.NS;

      @initialize
      @partOf(Test)
      class ApplicationFacade extends Test.NS.Facade {
        @nameBy static __filename = 'ApplicationFacade';
        @meta static object = {};
      }
      facade = ApplicationFacade.getInstance(KEY);

      @initialize
      @partOf(Test)
      @mixin(Test.NS.GenerateUuidIdMixin)
      class TestsCollection extends Test.NS.Collection {
        @nameBy static __filename = 'TestsCollection';
        @meta static object = {};
      }

      @initialize
      @partOf(Test)
      class TestRecord extends Record {
        @nameBy static __filename = 'TestRecord';
        @meta static object = {};
        @attribute({ type: 'string' }) test;
      }

      facade.addProxy(collectionName, 'TestsCollection', {
        delegate: 'TestRecord',
        serializer: Test.NS.SERIALIZER,
        adapter: Test.NS.MEMORY_ADAPTER
      });
      const collection = facade.retrieveProxy(collectionName);
      const spyRunNotitfication = sinon.spy(collection, 'recordHasBeenChanged');
      const record = await collection.build({
        id: 123
      });
      await record.save();
      await record.destroy();
      assert.isTrue(spyRunNotitfication.calledWith('destroyedRecord'), '`afterDestroy` run incorrect');
      facade.remove();
    });
  });
});
