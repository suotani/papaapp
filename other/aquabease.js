var w = 400;
var h = 400;

let img;
let s;
let cellSizes = { '大きく': 30, '中くらい': 50, 'こまかく': 60 }
let cellSize = cellSizes['中くらい'];
let sel;

function preload() {
  img = loadImage('https://live.staticflickr.com/1515/26653285795_311001ee9b.jpg');
}

function setup() {
  let canvas = createCanvas(w, h);
  canvas.parent('canvas-container');
  input = createFileInput(handleFile);
  input.parent('file-input-container');

  sel = createSelect();
  sel.option('大きく');
  sel.option('中くらい');
  sel.option('こまかく');
  sel.selected('中くらい');
  sel.changed(handleChangeSize);
  sel.parent('size-input-container');

  noStroke()
}

function handleChangeSize(){
  cellSize = cellSizes[sel.value()];
}

function handleFile(file) {
  fill(255)
  rect(0, 0, w, h)
  stroke(0)
  fill(0)
  text('ビーズアートをつくってます...', 100, 100)
  noStroke()
  if (file.type === 'image') {
    loadImage(file.data, img => {
      rect(0, 0, w, h)
      // img.hide(); // ファイルを読み込んだ後、デフォルトの画像表示を隠します
      img_info = []
      if(img.width < img.height){ // 縦長
        s = img.height / cellSize
        img_info = [0, 0, h / img.height, h / img.height]
      }else{
        s = img.width / cellSize
        img_info = [0, 0, w / img.width, w / img.width]
      }
      //image(img, img_info[0], img_info[1], img_info[2], img_info[3]);
      let d = 0
      cc = 0
      console.log(img)
      for(let y = 0; y < img.height; y += s){
        for(let x = d; x < img.width; x += s){
          color = [0, 0, 0]
          count = 0
          subimg = img.get(x, y, s, s)
          subimg.loadPixels()
          colors = subimg.pixels
          for(let pixel = 0; pixel < colors.length; pixel += 4){
            c = [colors[pixel], colors[pixel + 1], colors[pixel + 2]]
            color[0] += c[0]
            color[1] += c[1]
            color[2] += c[2]
            count += 1
          }
          cc++
          if(count > 0){
            gap = (255 / 10)
            color[0] = parseInt(color[0] / count / gap) * gap
            color[1] = parseInt(color[1] / count / gap) * gap
            color[2] = parseInt(color[2] / count / gap) * gap
            fill(color[0],color[1],color[2])
            ellipse(x * img_info[2], y * img_info[3], s * img_info[2])
          }
        }
        d = s/2 - d
        console.log(cc)
      }
      console.log("finish draw")
    });
  } else {
    img = null;
  }
}

function draw() {
  noLoop()
}

$(document).on("change", "input[type=file]",function(){
  $(".image").html("")
  console.log("preview")
  let elem = this                                             //操作された要素を取得
  let fileReader = new FileReader();                          //ファイルを読み取るオブジェクトを生成
  fileReader.readAsDataURL(elem.files[0]);                    //ファイルを読み取る
  console.log(elem.files[0])
  fileReader.onload = (function () {                          //ファイル読み取りが完了したら
      let imgTag = `<img src='${fileReader.result}'>`         //img要素を生成
      $("canvas").after(imgTag)                   //画像をプレビュー
  });
})
