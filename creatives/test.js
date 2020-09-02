const params = {
  'uri': "http://dev-video.tv-tokyo.co.jp.s3-website-ap-northeast-1.amazonaws.com/personal/",
};

// タイムスタンプ生成
var timestamp = new Date().getTime();

// 送信可能フラグ
var submitFlg;

// アンケートID（広告ID）
var suerveyId = "123456";

// 回答
var answer_data = [];

// 広告識別子
var deviceId = "";

// イベント
var event = "1";

// デバッグ用
// var debugElement = document.referrer;
var debugElement = navigator.userAgent;

// app or Pc
var deviceType = "";

// ピクセルタグ
var basImgTag = "<img style='height:1px;width:1px;' src='https://in.treasuredata.com/postback/v3/event/simid/simid_survey_result?td_format=pixel&td_write_key=8916/67294c614f548801ce3c9d970c78865b22deb236&survey_id=__SURVEY_ID__&answer_data=__ANSWER_DATA__&td_global_id=td_global_id&td_ip=td_ip&td_ua=td_ua&identifier=__DEVICE_ID__&event=__EVENT__&device=__DEVICE__' />";

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

  // フルスクリーン
  fullscreen(){
    console.log("fullscreenmode :" + this.environmentData.fullscreen);
    console.log("fullscreenAllowed :" + this.environmentData.fullscreenAllowed);
    this.simidProtocol.sendMessage(CreativeMessage.REQUEST_FULL_SCREEN);
  }

  // プラポリオープン
  //getDeviceId(){
  //  console.log(this.creativeData.adParameters);
  //  return this.environmentData.deviceId;
  // }

  /*@override*/
  /* onStart(eventData) {
    super.onStart(eventData);
    console.log(JSON.parse(this.creativeData.adParameters));
    if(this.environmentData.deviceId){
      deviceId = this.environmentData.deviceId
    }
  } */

  /*@override*/
  /* onInit(eventData) {
    super.onInit(eventData);
    console.log(JSON.parse(this.environmentData.fullscreenAllowed));
    if(this.environmentData.deviceId){
      deviceId = this.environmentData.deviceId
    }
  } */

}



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

      // 要素を読み込んだら表示
      $("#simid_creative").addClass("show");

      // SIMIDセッションスタート
      simidController.ready();



      // console.log(simidController.creativeData.adParameters);

      // デバッグ
      document.getElementById("debug_area").textContent = debugElement;

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

              event = "2"; //回答
              
              // ピクセルタグを送信
              postPixel()

              // 送信完了したら残りの広告はスキップ
              simidController.skip();
            }else{
              // 広告スキップ

              event = "3"; //スキップ

              // ピクセルタグを送信
              postPixel()

              simidController.skip();
            }
            return false;
        });

        // プラポリ
        $("#button_privacy").click(function(){
          simidController.privacy();
          return false;
        });

        // フルスクリーン
        $("#button_fullscreen").click(function(){
          simidController.fullscreen();
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
    //　タイムアウト
    // resetTimer();
    event = "4"; // タイムアウト
    postPixel();
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


// ピクセルタグ置換
function postPixel(){
  // デバイス種別取得
  deviceType = getAppOrWeb();

  basImgTag = basImgTag.replace("__SURVEY_ID__",suerveyId);
  basImgTag = basImgTag.replace("__DEVICE_ID__",deviceId);
  basImgTag = basImgTag.replace("__EVENT__",event);
  basImgTag = basImgTag.replace("__DEVICE__",deviceType);
  basImgTag = basImgTag.replace("__ANSWER_DATA__",JSON.stringify(answer_data));

  // 送信
  $("#simid_creative").html(basImgTag);
  console.log(basImgTag);
}


function getAppOrWeb(){
  if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0 || navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
    return "1";
  } else {
    return "2";
  }
}