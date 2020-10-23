

export default (Module) => {
  const {
    PipeMessage,
    initialize, partOf, meta, property, method, nameBy
  } = Module.NS;


  @initialize
  @partOf(Module)
  class FilterControlMessage extends PipeMessage {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property static get BASE(): string {
      return `${PipeMessage.BASE}filter-control/`;
    }

    @property static get SET_PARAMS(): string {
      return `${this.BASE}setparams`;
    }

    @property static get SET_FILTER(): string {
      return `${this.BASE}setfilter`;
    }

    @property static get BYPASS(): string {
      return `${this.BASE}bypass`;
    }

    @property static get FILTER(): string {
      return `${this.BASE}filter`;
    }

    // ipsName = PointerT(FilterControlMessage.protected({
    @property _name: string = null;

    // ipmFilter = PointerT(FilterControlMessage.protected({
    @property _filter: ?Function = null;

    // ipoParams = PointerT(FilterControlMessage.protected({
    @property _params: ?object = null;

    @method setName(asName: string) {
      this._name = asName;
    }

    @method getName(): string {
      return this._name;
    }

    @method setFilter(amFilter: Function) {
      this._filter = amFilter;
    }

    @method getFilter(): Function {
      return this._filter;
    }

    @method setParams(aoParams: object) {
      this._params = aoParams;
    }

    @method getParams(): object {
      return this._params;
    }

    constructor(asType: string, asName: string, amFilter: ?Function = null, aoParams: ?object = null) {
      super(asType);
      this.setName(asName);
      if (amFilter != null) {
        this.setFilter(amFilter);
      }
      if (aoParams != null) {
        this.setParams(aoParams);
      }
    }
  }
}
