var can;
var ct;
var before;
cutimg_before = new Array();
cutimg_after = new Array();
var count = 0;
var copyTarget;
var ox = 0, oy = 0, x = 0, y = 0;
var mf = false;
var word = "x = -\frac{b}{a}"
src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-MML-AM_CHTML"
type="text/javascript"

MathJax.Hub.Config({
    tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
  });

function draw() {
    can = document.getElementById("can"); //idを取得
    can.addEventListener("touchstart", onDown, false); //指
    can.addEventListener("touchmove", onMove, false);
    can.addEventListener("touchend", onUp, false);
    can.addEventListener("mousedown", onMouseDown, false); //	マウスボタンを押している時に発動
    can.addEventListener("mousemove", onMouseMove, false);//    マウスカーソルが移動した時に発動
    can.addEventListener("mouseup", onMouseUp, false); //       マウスボタンを離したときに発動
    ct = can.getContext("2d");     //オブジェクト生成
    ct.strokeStyle = "#000000";  //文字の色
    ct.lineWidth = 10;   //文字の太さ
    ct.lineJoin = "round"; //文字を丸める
    ct.lineCap = "round"; //線の形状を指定
    clearCan();
}
function onDown(event) {
    mf = true;
    ox = event.touches[0].pageX - event.target.getBoundingClientRect().left;
    oy = event.touches[0].pageY - event.target.getBoundingClientRect().top;
    event.stopPropagation();
}
function onMove(event) {
    if (mf) {
        x = event.touches[0].pageX - event.target.getBoundingClientRect().left;
        y = event.touches[0].pageY - event.target.getBoundingClientRect().top;
        drawLine();
        ox = x;
        oy = y;
        event.preventDefault(); //デフォルトの動作を禁止
        event.stopPropagation();
    }
}
function onUp(event) {
    mf = false;
    event.stopPropagation();
}
function onMouseDown(event) {
    mf = true;
    cutimg_before[count] = ct.getImageData(0, 0, can.getBoundingClientRect().width, can.getBoundingClientRect().height);
    count += 1;
    ox = event.clientX - event.target.getBoundingClientRect().left;
    oy = event.clientY - event.target.getBoundingClientRect().top;
    event.stopPropagation();
}
function onMouseMove(event) {
    if (mf) {
        x = event.clientX - event.target.getBoundingClientRect().left;
        y = event.clientY - event.target.getBoundingClientRect().top;
        drawLine();
        ox = x;
        oy = y;
        event.stopPropagation();
    }
}
function onMouseUp(event) {
    mf = false;
    cutimg_after[count] = ct.getImageData(0, 0, can.getBoundingClientRect().width, can.getBoundingClientRect().height);
    event.stopPropagation();
}
function drawLine() {
    ct.beginPath(); //現在のパスをリセット
    ct.moveTo(ox, oy); //パスの開始座標を指定
    ct.lineTo(x, y); //座標を指定してラインを引く
    ct.stroke(); //現在のパスを輪郭表示 
}
function clearCan() {
    ct.fillStyle = "rgb(255,255,255)";
    ct.fillRect(0, 0, can.getBoundingClientRect().width, can.getBoundingClientRect().height);
}

function clear_before_str() {
    ct.putImageData(cutimg_before[count-1], 0,0);
    count -= 1;
}


function clear_after_str() {
    ct.putImageData(cutimg_after[count+1], 0,0);
    count += 1;
}


function copyToClipboard() {
    var copyTarget = document.getElementById("answer").innerText;
    navigator.clipboard.writeText(copyTarget);
}


function copyToClipboard2() {
    var copyTarget = document.getElementById("answer_2").innerText;
    navigator.clipboard.writeText(copyTarget);
}


function copyToClipboard3() {
    var copyTarget = document.getElementById("answer_3").innerText;
    navigator.clipboard.writeText(copyTarget);
}


function clear_parts() {
    ct.lineWidth = 50;
    ct.strokeStyle = "white";
}


function anti_clear() {
    ct.lineWidth = 10;
    ct.strokeStyle = "Black";
}








function sendImage() {
    var img = document.getElementById("can").toDataURL('image/png'); //canvasを取得,base64データ取得(エンコード)
    img = img.replace('image/png', 'image/octet-stream');
    $.ajax({                                                            //非同期通信
        type: "POST",       //送信するデータ量が多いため
        url: "http://localhost:5000",  //リクエストを送信するurl
        data: {
            "img": img          //サーバに送信する値
        }
    }).done( function(dat) { 
        //const elem = document.getElementById("answer");


       // var elem = document.getElementById("answer");
       // elem.innerHTML = str;
        
       // elem.textContent = 'x = -\frac{b}{a}';
        //MathJax.Hub.Typeset(elem);                                   
            //spanで囲まれた部分は可変 answer内にdataを出力
        $('#answer').html('<span class="answer">'+dat+'</span>' )
        $('#answer_2').html('<span class="answer">'+dat+'</span>' )




        var str = "$$" + dat + "$$";

        $(function() {
              $("#answer_3").html(str);
              MathJax.Hub.Typeset($("#answer_3")[0], function() { console.log("Done"); });
          });





    });
}