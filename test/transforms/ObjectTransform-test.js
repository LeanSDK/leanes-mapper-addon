const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const path = process.env.ENV === 'build' ? "../../lib/index.dev" : "../../src/index.js";
const MapperAddon = require(path).default;
const LeanES = require('@leansdk/leanes/src').default;
const {
  initialize, nameBy, meta, plugin,
  Utils: { joi }
} = LeanES.NS;

describe('ObjectTransform', () => {

  @initialize
  @plugin(MapperAddon)
  class Test extends LeanES {
    @nameBy static __filename = 'Test';
    @meta static object = {};
  }
  const ObjectTransform = Test.NS.ObjectTransform;

  describe('.shema', () => {
    it('should has correct shema value', () => {
      expect(ObjectTransform.schema).deep.equal(joi.object().allow(null).optional());
    });
    it('shouls has correct validate null value', async () => {
      expect(await joi.validate(null, ObjectTransform.schema)).deep.equal(null);
    });
    it('should has correct validate empty object value', async () => {
      expect(await joi.validate({}, ObjectTransform.schema)).deep.equal({});
    });
    it('should has correct validate any object value', async () => {
      expect(await joi.validate({
        one: 1,
        two: true,
        three: 'three',
        four: "2020-07-07T13:33:43.160Z"
      }, ObjectTransform.schema)).deep.equal({
        one: 1,
        two: true,
        three: 'three',
        four: "2020-07-07T13:33:43.160Z"
      });
    });
  });
  describe('.objectize', () => {
    it('should objectize null value', async () => {
      expect(await ObjectTransform.objectize(null)).deep.equal({});
    });
    it('should objectize empty object', async () => {
      expect(await ObjectTransform.objectize({})).deep.equal({});
    });
    it('should objectize simple object', async () => {
      expect(await ObjectTransform.objectize({
        one: 1,
        two: true,
        three: 'three',
        four: new Date("2020-07-07T13:33:43.160Z")
      })).deep.equal({
        one: 1,
        two: true,
        three: 'three',
        four: "2020-07-07T13:33:43.160Z"
      });
    });
    it('should objectize complex object', async () => {
      expect(await ObjectTransform.objectize({
        one: 1,
        two: {
          three: 'three'
        },
        four: [1, 2]
      })).deep.equal({
        one: 1,
        two: {
          three: 'three'
        },
        four: [1, 2]
      });
    });
  });
  describe('.normalize', () => {
    it('should normalize null value', async function () {
      assert.deepEqual(await ObjectTransform.normalize(null), {});
    });
    it('should normalize empty object', async function () {
      assert.deepEqual(await ObjectTransform.normalize({}), {});
    });
    it('should normalize simple object', async function () {
      assert.deepEqual(await ObjectTransform.normalize({
        one: 1,
        two: true,
        three: 'three',
        four: "2020-07-07T13:58:24.160Z"
      }), {
        one: 1,
        two: true,
        three: 'three',
        four: new Date("2020-07-07T13:58:24.160Z")
      });
    });
     it('should normalize complex object', async function () {
      assert.deepEqual(await ObjectTransform.normalize({
        one: 1,
        two: {
          three: 'three'
        },
        four: [1, 2]
      }), {
        one: 1,
        two: {
          three: 'three'
        },
        four: [1, 2]
      });
    });
  });
  describe('.serialize', () => {
    it('should serialize null value', async function () {
      assert.deepEqual(await ObjectTransform.serialize(null), {});
    });
    it('should serialize empty object', async function () {
      assert.deepEqual(await ObjectTransform.serialize({}), {});
    });
    it('should serialize simple object', async function () {
      assert.deepEqual(await ObjectTransform.serialize({
        one: 1,
        two: true,
        three: 'three',
        four: new Date("2020-07-07T13:58:24.160Z")
      }), {
        one: 1,
        two: true,
        three: 'three',
        four: "2020-07-07T13:58:24.160Z"
      });
    });
     it('should serialize complex object', async function () {
      assert.deepEqual(await ObjectTransform.serialize({
        one: 1,
        two: {
          three: 'three'
        },
        four: [1, 2]
      }), {
        one: 1,
        two: {
          three: 'three'
        },
        four: [1, 2]
      });
    });
  });
});
