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


// タイムスタンプ生成
var timestamp = new Date().getTime();

// SIMID制御クラス
const simidController = new SimidController();

// メイン処理開始
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
      // SIMIDセッションスタート
      simidController.ready();

      // ボタン処理
      // スキップ
      $(function(){
        $("#button_skip").click(function(){
            simidController.skip();
            return false;
          });

        $("input[type=checkbox]").click(function(){
            var $count = $("input[type=checkbox]:checked").length;
            var $not = $('input[type=checkbox]').not(':checked');
        
                //チェックが3つ付いたら、チェックされてないチェックボックスにdisabledを加える
            if($count >= 1) {
                $not.attr("disabled",true);
                $not.parent().css('opacity',0.6);
            }else{
                $not.attr("disabled",false);
            }
        });

      });



    },
    methods: {

    }
  })
}



