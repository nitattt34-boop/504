let faceMesh;
let video;
let faces = [];
let isModelReady = false;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  console.log("👉 畫布建立完成，背景應該變色了！");

  // 擷取攝影機影像
  video = createCapture(VIDEO, () => {
    console.log("👉 攝影機已啟動！");
  });
  
  // 設定影像的寬高為全螢幕畫布的 50%
  video.size(windowWidth * 0.5, windowHeight * 0.5);
  video.hide(); // 隱藏預設在左上角的影像，稍後在 draw 中置中顯示

  // 載入 Facemesh 模型
  console.log("👉 正在載入 FaceMesh 模型，請稍候...");
  faceMesh = ml5.faceMesh(modelReady);
}

function modelReady() {
  console.log("✅ FaceMesh 模型載入成功！開始偵測...");
  isModelReady = true;
  faceMesh.detectStart(video, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 設定畫布背景顏色為 e7c6ff
  background('#e7c6ff');

  // 計算讓影像置中的 X 與 Y 偏移量
  let xOffset = (windowWidth - video.width) / 2;
  let yOffset = (windowHeight - video.height) / 2;

  push();
  // 將座標原點移動到置中影像的「右上角」，準備進行左右反轉
  translate(xOffset + video.width, yOffset);
  scale(-1, 1); // 左右顛倒

  // 顯示攝影機影像
  image(video, 0, 0, video.width, video.height);

  // 如果模型已經載入完成，才執行畫線函數
  if (isModelReady) {
    drawFacemeshLines();
  }
  pop();
}

function drawFacemeshLines() {
  if (faces.length > 0) {
    let keypoints = faces[0].keypoints;

    // 你要串接的兩組編號
    let group1 = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
    let group2 = [76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

    stroke(255, 0, 0);
    strokeWeight(1);
    noFill();

    // 第一組線條
    beginShape();
    for (let i = 0; i < group1.length; i++) {
      let index = group1[i];
      if (keypoints[index]) {
        vertex(keypoints[index].x, keypoints[index].y); 
      }
    }
    endShape();

    // 第二組線條
    beginShape();
    for (let i = 0; i < group2.length; i++) {
      let index = group2[i];
      if (keypoints[index]) {
        vertex(keypoints[index].x, keypoints[index].y);
      }
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(windowWidth * 0.5, windowHeight * 0.5);
}