/**
 * A sample SIMID ad that shows an overlay
 */
class SimidOverlay extends BaseSimidCreative {
  constructor() {
    super();

    this.informationElem_ = document.getElementById('information');

    this.addButtonClickActions_();
  }

  /** @override */
  onTimeUpdate(data) {
    super.onTimeUpdate(data);
    this.informationElem_.innerHTML = 'Current Ad Time ' + this.videoState.currentTime;
  }

  /**
   * Adds actions to different buttons available on the overlay.
   */
  addButtonClickActions_() {
    this.sendMessageOnButtonClick_('request_play', CreativeMessage.REQUEST_PLAY);
    this.sendMessageOnButtonClick_('request_pause', CreativeMessage.REQUEST_PAUSE);
    this.sendMessageOnButtonClick_('request_full_screen', CreativeMessage.REQUEST_FULL_SCREEN);
    this.sendMessageOnButtonClick_('fatal_error', CreativeMessage.FATAL_ERROR);
    this.sendMessageOnButtonClick_('request_skip', CreativeMessage.REQUEST_SKIP);
    this.sendMessageOnButtonClick_('request_stop', CreativeMessage.REQUEST_STOP);
  }

  /**
   * Listens for a click event on a button
   * @param {String} elementName The name of the element.
   * @param {String} message The message to send to the player.
   * @private
   */
  sendMessageOnButtonClick_(elementName, message) {
    const sendMessageFunction = () => {this.simidProtocol.sendMessage(message);}
    document.getElementById(elementName).addEventListener(
        'click', sendMessageFunction.bind(this));
  }
}
