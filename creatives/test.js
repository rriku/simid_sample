class SimidController extends BaseSimidCreative {
  // コンストラクタ
  constructor() {
    // セッション開始
    super();
  }

  // アンケートスキップ
  skip(){
    console.log("skip");
    this.simidProtocol.sendMessage(CreativeMessage.REQUEST_SKIP);
  }

}




// メイン処理ここから
const simidController = new SimidController();
simidController.ready();


// ボタン処理
// スキップ
$(function(){
	$("#button_skip").click(function(){
      simidController.skip();
    	return false;
    });
});
