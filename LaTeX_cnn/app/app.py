from datetime import datetime
import cv2
import re
import base64
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.python.keras.models import load_model
from keras import backend as K
import os


app = Flask(__name__) # Flask クラスのインスタンス
CORS(app)       #セキュリティ


@app.route('/', methods=['GET', 'POST'])    #GET・POSTメソッドを許可,urlの指定
def index():
    if request.method == 'POST': #情報をサーバーに送る場面
        #print(request.form['img'])
        ans = input('cnn_proto.h5',request)
        return ans
    else:
        return render_template('index.html') #templateにあるHTMLにサーバーのデータを組み込む
    






def input(model_path,file_path):

  #分割した数字が記号を格納
  words = []
  #学習済みのモデルを格納
  model = load_model(model_path)

  img_str = re.search('base64,(.*)', file_path.form['img']).group(1) #base64(画像を64進数で表現)でエンコードされた画像を受け取るのでヘッダー部分を取り除く
  nparr = np.fromstring(base64.b64decode(img_str), np.uint8) #デコードしてNumpy配列に変換
  img_src = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  #変数nparrをRGBの3channelで読み込む
  img_negaposi = 255 - img_src                       #白黒反転
  binary_im = cv2.cvtColor(img_negaposi, cv2.COLOR_BGR2GRAY) #２値化


  

  contours = cv2.findContours(
      binary_im , cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]

  count = 0

  #文字や記号ごとにトリミング処理
  for cnt in contours:
      x, y, w, h = cv2.boundingRect(cnt)
      if h < 40:  # 小さすぎるのは飛ばす
          continue 
      cut_img = binary_im[y : y + h , x : x + w]
      height = cut_img.shape[0]
      width = cut_img.shape[1]
      #正方形にトリミング
      if width < height:
        cut_img = cv2.copyMakeBorder(cut_img,0,0,int((h-w)/2),int((h-w)/2),cv2.BORDER_CONSTANT,(0,0,0))
      else:
        cut_img = cv2.copyMakeBorder(cut_img,int((w-h)/2),int((w-h)/2),0,0,cv2.BORDER_CONSTANT,(255,255,255))
      

      count += 1

      img_resize = cv2.resize(cut_img,(28,28))   #28×28にリサイズ
      K.clear_session() #モデルを削除(メモリ消費量を抑える)
      model = load_model('cnn_proto.h5') #モデル読み込み
      T = np.expand_dims(img_resize, axis=0)#新たな次元を追加
      T = T.reshape(T.shape[0],28,28,1) #4次元配列に



      #表示したいクラス
      label=[0,1,2,3,4,5,6,7,8,9]
      #判別
      pred = model.predict(T, batch_size=1, verbose=0)
      #判別結果で最も高い数値を抜き出し
      score = np.max(pred)
      #判別結果の配列から最も高いところを抜きだし、そのクラス名をpred_labelへ
      pred_label = label[np.argmax(pred[0])]
      #切り取った文字の座標情報などをtuple形式で格納
      cut_info = pred_label,x,y,w,h
      #リストに追加
      words.append(cut_info)

  #x座標を基準に数字や記号を並び替える
  words.sort(key = lambda x: x[1])
  #べき乗フラグ
  ex_flag = 0
  #一文字ずつ識別
  words_list = []
  for c in range(len(words)):
    if ex_flag == 1:
      ex_flag = 0
      continue
    if c == len(words)-1:
      l0, x0, y0, w0, h0 = words[c]
      words_list.append(l0)

      
      continue
    l0, x0, y0, w0, h0 = words[c]
    l1, x1, y1, w1, h1 = words[c+1]

    if h1/h0 < 0.6 and x1 < x0 + w0 + w1/2:
      words_list.append(str(l0) + "^" + str(l1))
      ex_flag = 1
    else:
      words_list.append(l0)

  #print(words_list)
  out_word = ""
  for word in words_list:
    out_word = out_word + str(word)
  print(out_word)
  return out_word



if __name__ == "__main__":  #インポートされた際にプログラムが動かないようにする
    app.run()       #環境変数をpythonファイルで指定した場合にpython app.pyでアプリケーションを起動できる