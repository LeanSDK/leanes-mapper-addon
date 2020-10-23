

export default (Module) => {
  const {
    PipeMessage,
    initialize, partOf, meta, property, method, nameBy
  } = Module.NS;


  @initialize
  @partOf(Module)
  class LogMessage extends PipeMessage {
    @nameBy static  __filename = __filename;
    @meta static object = {};

    @property static DEBUG: number = 5;
    @property static INFO: number = 4;
    @property static WARN: number = 3;
    @property static ERROR: number = 2;
    @property static FATAL: number = 1;
    @property static NONE: number = 0;
    @property static CHANGE: number = -1;

    @property static LEVELS: string[] = ['NONE', 'FATAL', 'ERROR', 'WARN', 'INFO', 'DEBUG'];

    @property static get SEND_TO_LOG(): string {
      return PipeMessage.BASE + 'LoggerModule/sendToLog';
    }

    @property static STDLOG: string = 'standardLog';

    @property get logLevel(): number {
      return this.getHeader().logLevel;
    }

    @property set logLevel(logLevel: number): number {
      const header = this.getHeader();
      header.logLevel = logLevel;
      this.setHeader(header);
      return logLevel;
    }

    @property get sender(): string {
      return this.getHeader().sender;
    }
    @property set sender(sender: string): string {
      const header = this.getHeader();
      header.sender = sender;
      this.setHeader(header);
      return sender;
    }

    @property get time(): string {
      return this.getHeader().time;
    }
    @property set time(time: string): string {
      const header = this.getHeader();
      header.time = time;
      this.setHeader(header);
      return time;
    }

    @property get message(): ?any {
      return this.getBody();
    }

    constructor(logLevel: number, sender: string, message: any) {
      const time = new Date().toISOString();
      const headers = {logLevel, sender, time};
      super(PipeMessage.NORMAL, headers, message);
    }
  }
}
