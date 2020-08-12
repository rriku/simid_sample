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
    var mediaState = this.simidProtocol.sendMessage(CreativeMessage.GET_MEDIA_STATE) ;
    console.log( mediaState );
  }

}


// タイムスタンプ生成
var timestamp = new Date().getTime();

// SIMID制御クラス
const simidController = new SimidController();

// 送信可能フラグ
var submitFlg;

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
        $("#button_submit").click(function(){
            if(submitFlg){

            }else{
              simidController.skip();
            }
            return false;
          });

        // チェックが付いた時の処理
        $("input[type=checkbox]").click(function(){
            var $count = $("input[type=checkbox]:checked").length;
            var $not = $('input[type=checkbox]').not(':checked');
        
            //チェックが3つ付いたら、チェックされてないチェックボックスにdisabledを加える
            if($count >= 1) {
                $not.attr("disabled",true);
                $not.parent().css('opacity',0.6);

                // スキップボタンを送信ボタンに変更
                submitFlg ="1";
                $("#button_submit").css("background-color","#a92f61");
                $("#button_submit").text("アンケートを送信する")

            }else{
                $not.attr("disabled",false);
                $not.parent().css('opacity',1);

                // スキップボタンを送信ボタンに変更
                submitFlg ="0";
                $("#button_submit").css("background-color","inherit");
                $("#button_submit").text("アンケートをスキップ")
            }
        });

      });



    },
    methods: {

    }
  })
}



