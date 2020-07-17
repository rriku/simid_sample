class SimidTest extends BaseSimidCreative {
  constructor() {
    super();
    this.simidProtocol.sendMessage(CreativeMessage.REQUEST_SKIP);
  }
}
