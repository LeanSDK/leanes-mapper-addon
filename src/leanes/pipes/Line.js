import type { PipeMessageInterface } from './interfaces/PipeMessageInterface';
import type { PipeFittingInterface } from './interfaces/PipeFittingInterface';

export default (Module) => {
  const {
    Pipe, PipeMessage, LineControlMessage,
    initialize, partOf, meta, property, method, nameBy
  } = Module.NS;
  const { NORMAL } = PipeMessage;
  const { SORT, FLUSH, FIFO } = LineControlMessage;

  @initialize
  @partOf(Module)
  class Line extends Pipe {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    // ipsMode = PointerT(Line.protected({
    @property _mode: string = SORT;

    // iplMessages = PointerT(Line.protected({
    @property _messages: ?Array<PipeMessageInterface> = null;

    // ipmSort = PointerT(Line.protected({
    @method _sortMessagesByPriority(msgA: PipeMessageInterface, msgB: PipeMessageInterface): number {
      let vnNum = 0;
      if (msgA.getPriority() < msgB.getPriority()) {
        vnNum = -1;
      }
      if (msgA.getPriority() > msgB.getPriority()) {
        vnNum = 1;
      }
      return vnNum;
    }

    // ipmStore = PointerT(Line.protected({
    @method _store(aoMessage: PipeMessageInterface): void {
      if (this._messages == null) {
        this._messages = [];
      }
      this._messages.push(aoMessage);
      if (this._mode === SORT) {
        this._messages.sort(this._sortMessagesByPriority.bind(this));
      }
    }

    // ipmFlush = PointerT(Line.protected({
    @method async _flush(): Promise<boolean> {
      let voMessage;
      let vbSuccess = true;
      if (this._messages == null) {
        this._messages = [];
      }
      while ((voMessage = this._messages.shift()) != null) {
        let ok = await this._output.write(voMessage);
        if (!ok) {
          vbSuccess = false;
        }
      }
      return vbSuccess;
    }

    @method async write(aoMessage: PipeMessageInterface): Promise<boolean> {
      let vbSuccess = true;
      let voOutputMessage = null;
      switch (aoMessage.getType()) {
        case NORMAL:
          this._store(aoMessage);
          break;
        case FLUSH:
          vbSuccess = await this._flush();
          break;
        case SORT:
        case FIFO:
          this._mode = aoMessage.getType();
      }
      return vbSuccess;
    }

    constructor(aoOutput: ?PipeFittingInterface = null) {
      super(aoOutput);
    }
  }
}
