const params = {
  'uri': "http://dev-video.tv-tokyo.co.jp.s3-website-ap-northeast-1.amazonaws.com/personal/",
};

class SimidController extends BaseSimidCreative {
  // コンストラクタ
  constructor() {
    // セッション開始
    super();
  }

  // アンケートスキップ
  skip(){
    this.simidProtocol.sendMessage(CreativeMessage.REQUEST_SKIP);
  }
  
  // プラポリオープン
  privacy(){
    this.simidProtocol.sendMessage(CreativeMessage.REQUEST_NAVIGATION, params );
  }

  // プラポリオープン
  //getDeviceId(){
  //  console.log(this.creativeData.adParameters);
  //  return this.environmentData.deviceId;
  // }

  /** @override */
  onStart(eventData) {
    super.onStart(eventData);
    console.log(JSON.parse(this.creativeData.adParameters));
  }

}


// タイムスタンプ生成
var timestamp = new Date().getTime();

// SIMID制御クラス
const simidController = new SimidController();

// 送信可能フラグ
var submitFlg;

// アンケートID（広告ID）
var suerveyId = "123456";

// 回答
var answer_data = [];
// answer_data = {"survey_id" : "8302813","items":[{"question": "質問1の文章質問1の文章質問1の文章","answers": "質問1の回答質問1の回答質問1の回答"},{"question": "質問2の文章質問2の文章質問2の文章","answers": "質問2の回答質問2の回答質問2の回答"}]};

// ピクセルタグ
var basImgTag = "<img style='height:1px;width:1px;' src='https://in.treasuredata.com/postback/v3/event/simid/simid_survey_result?td_format=pixel&td_write_key=8916/67294c614f548801ce3c9d970c78865b22deb236&survey_id=__SURVEY_ID__&answer_data=__ANSWER_DATA__&td_global_id=td_global_id&td_ip=td_ip&td_ua=td_ua' />";

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

      // 要素を読み込んだら表示
      $("#simid_creative").addClass("show");

      // SIMIDセッションスタート
      simidController.ready();


      console.log(simidController.creativeData.adParameters);

      // タイマー開始
      $(function () {
        maxBar = $('#bar').attr('max');
        resetTimer();
        timer = setInterval('countdown()', resolutionMs);
      });

      // ボタン処理
      $(function(){

        // サブミットボタン or スキップボタン押下
        $("#button_submit").click(function(){
            if(submitFlg){

              // チェック済みvalue値を取得する
              $("input:checked").each(function() {
                answer_data.push($(this).val());
              })
              
              basImgTag = basImgTag.replace("__SURVEY_ID__",suerveyId);
              basImgTag = basImgTag.replace("__ANSWER_DATA__",JSON.stringify(answer_data));

              // $("#simid_creative").html(basImgTag.replace("__JSON_DATA__",JSON.stringify(answer_data)));
              $("#simid_creative").html(basImgTag);
              console.log(basImgTag);

              console.log("送信完了");
              simidController.skip();
            }else{
              console.log("スキップ");
              simidController.skip();
            }
            return false;
        });

        // プラポリ
        $("#button_privacy").click(function(){
            simidController.privacy();
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

/** @override */
onStart(eventData) {
  super.onStart(eventData);
  this.surveyQuestions_ = JSON.parse(this.creativeData.adParameters);
  this.showNextQuestion();
}




// タイマー関連関数
var timer,
  limitMs = 0,
  restMs = 0,
  resolutionMs = 50,    /* NOTE: Too small value does not work on IE11. */
  maxBar;

function countdown(){
  restMs -= resolutionMs;

  var restRate = (limitMs - restMs) / limitMs;
  var restBarLength = maxBar * restRate

  $('#bar').attr('value', restBarLength);

  if (restMs < 0) {
    resetTimer();
    simidController.skip();
  }
}

function resetTimer(){
  clearInterval(timer);
  limitMs = restMs = $('#time').val();
  $('#bar').attr('value', 0);
}


// チェック済みvalue値を取得する
$('input:checked').each(function() {
  var r = $(this).val();
})

