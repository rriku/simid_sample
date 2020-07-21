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

var timestamp = new Date().getTime();


// メイン処理ここから
const simidController = new SimidController();
simidController.ready();
main();



function main(){
  new Vue({
    el: '#simid_creative',
    data: {
      all_data:[],
      question_list: [],
      answer_list:[]
    },
    created: function () {
      axios.get('./test.json?timestamp=' + timestamp).then(function (response) {
      // 取得完了したらlistリストに代入
      this.all_data = response.data;
      /* for(var i=0;i<this.all_data.length;i++){
        this.question_list.push(this.all_data[i].question);
        this.answer_list.push(this.all_data[i].answers);
      } */
      }.bind(this)).catch(function (e) {
        console.error(e)
      });
    },
    updated: function () {


    },
    methods: {

    }
  })
}



// ボタン処理
// スキップ
$(function(){
	$("#button_skip").click(function(){
      simidController.skip();
    	return false;
    });
});