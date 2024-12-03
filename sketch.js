let buttonX, buttonY, buttonWidth, buttonHeight; 
let sound; // サウンドオブジェクト
let lightning = []; // 稲妻のラインを格納する配列
let flashOpacity = 0; // 稲妻の輝きの強さ
let palindromes;

let index = 0;
let kanjiChunkIndex = 0;
let englishChunkIndex = 0;
let textAnimIndex = 0;
let textSizeValues = [];

let fontSize = 36;
let boxX, boxY, boxWidth, mainBoxHeight;
let padX, padY;
let font; // フォントオブジェクト

let g, titleg, kanjiSub, englishSub;
let data;

let currentPalindrome,
  currentTextSize = fontSize;

let englishBoxWidth; // 英語字幕用の表示幅


const createLightning = function() {
  let xStart = random(0, width); // 稲妻の開始位置を画面全体の横幅に設定
  let yStart = 0; // 稲妻の上端
  let bolts = []; // 稲妻のラインを格納する配列

  let x = xStart;
  let y = yStart;

  while (y < height) { // 画面の下端に達するまで稲妻を生成
    // 横方向と縦方向のランダム性を動的に変化
    let xOffset = random(-100, 100); // 横方向のランダムな揺らぎを増加
    let yOffset = random(30, 70); // 縦方向のランダムな移動距離を増加
    let xEnd = constrain(x + xOffset, 0, width); // 横方向の位置が画面外に出ないように調整
    let yEnd = y + yOffset;

    bolts.push({ x1: x, y1: y, x2: xEnd, y2: yEnd }); // ラインを配列に追加
    x = xEnd;
    y = yEnd;
  }
  lightning.push(bolts); // 稲妻を配列に追加
  flashOpacity = 150; // フラッシュの強さ
};

function preload() {
  font = loadFont('NotoSansJP-Custom-Subset.ttf'); // 新しいフォントをロード
  data = loadJSON('data.json');
  sound = loadSound('click.mp3'); // 音声ファイルを
}

function setup() {
  palindromes = data['jp'];
 createCanvas(windowWidth, windowHeight);
  buttonWidth = 120; // ボタンの幅
  buttonHeight = 50; // ボタンの高さ

  // Canvasの初期化
  createCanvas(windowWidth, windowHeight);
  resizeCanvas(windowWidth, windowHeight); // ウィンドウサイズに合わせる

  // 各種パラメータの初期化
  padX = windowWidth / 10;
  padY = windowHeight / 10;
  boxX = padX;
  boxY = padY;
  boxWidth = width - padX * 2;

  // 英語字幕の表示幅を設定（最大幅を800に設定）
  englishBoxWidth = min(boxWidth, 800);

  // mainBoxHeightが負の値にならないように制御
  mainBoxHeight = max(100, height - height / 3);

  // グラフィックス領域を再生成
  g = createGraphics(width, mainBoxHeight);
  titleg = createGraphics(width, 48); // タイトルの幅をウィンドウ幅に合わせる
  kanjiSub = createGraphics(width, 100);
  englishSub = createGraphics(englishBoxWidth, 100); // 幅をenglishBoxWidthに設定

  console.log("total " + palindromes.length + " palindromes");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // 必要なパラメータを再計算
  padX = windowWidth / 10;
  padY = windowHeight / 10;
  boxWidth = width - padX * 2;
  mainBoxHeight = max(100, height - height / 3);

  // グラフィックス領域を再生成
  g = createGraphics(width, mainBoxHeight);
  kanjiSub = createGraphics(width, 100);
  englishSub = createGraphics(boxWidth, 100); // 幅を画面に基づいて再設定
}



function draw() {
  background("black");

  // 稲妻の描画（テキストの背後）


  fill(255);
  textAlign(CENTER, CENTER);
  textSize(fontSize);
  text("カレー回文", width / 2, height / 2);

  // 稲妻の描画
  drawLightning();

  // 稲妻のフラッシュ効果（画面全体を覆う）
  fill(255, 255, 255, flashOpacity);
  rect(0, 0, width, height);

  // フラッシュの減衰
  flashOpacity *= 0.9;

  currentPalindrome = palindromes[index];
  
let margin = 60; // ボタンと画面端の間の余白
  buttonX = width - buttonWidth / 1 - margin; // 右端から少し内側に配置
  buttonY = buttonHeight / 2 + margin; // 上端から少し下に配置
  buttonWidth = 60; // ボタンの幅
  buttonHeight = 30; // ボタンの高さ

  // ボタンを描画
  drawButton(buttonX, buttonY, buttonWidth, buttonHeight, "次へ");

  // パリンドロームの描画
  if (frameCount % 10 == 0 && textAnimIndex < currentPalindrome.hiragana.length) {
    textAnimIndex++;
    
    
  }

  let currentHiragana = currentPalindrome.hiragana.substring(0, textAnimIndex);
  let currentKanji = currentPalindrome.kanji;
  let currentEnglish = currentPalindrome.english;

  // テキストサイズをボックスに合わせて調整
  let currFontSize = textSizeValues.find((i) => i.index == index);
  if (currFontSize == null) {
    if (!currentPalindrome.fontSize) {
      currentPalindrome.fontSize = fitTextToBox(currentPalindrome.hiragana, boxWidth, mainBoxHeight / 2);
    }
    let val = currentPalindrome.fontSize;
    textSizeValues.push({
      index: index,
      size: val,
    });
  }

  currFontSize = textSizeValues.find((i) => i.index == index);
  currentTextSize = currFontSize.size;

  
  // ひらがなの描画
  g.clear();
  g.background("black");
  g.textFont(font); // フォントを指定
  g.textSize(currentTextSize);
  g.fill("white");
  g.textAlign(CENTER, TOP);

  let hiraganaLines = breakTextIntoLines(currentHiragana, "", boxWidth, g);
  drawTextInBox(hiraganaLines, boxX, 0, boxWidth, mainBoxHeight / 2, g);

  imageMode(CORNER);
  image(g, 0, (height - mainBoxHeight) / 2);

  // タイトルの描画
  titleg.clear();
  titleg.background('black');
  let titleFontSize = fontSize;
  let titleText = `カレー回文 - Curry Palindrome ${index + 1}`;

  titleg.textFont("default"); // フォントを指定
  titleg.textSize(titleFontSize);

  while (titleg.textWidth(titleText) > titleg.width - 20) { // マージンを考慮
    titleFontSize--;
    titleg.textSize(titleFontSize);
  }


// 稲妻を描画
function drawLightning() {
  stroke(255, 255, 0); // 稲妻の色
  strokeWeight(10);

  for (let bolts of lightning) {
    for (let bolt of bolts) {
      line(bolt.x1, bolt.y1, bolt.x2, bolt.y2); // ラインを描画
    }
  }

  // 稲妻のフェードアウト
  if (random(1) < 0.1) {
    lightning.shift(); // 古い稲妻を削除
  }
}

  titleg.fill("white");
  titleg.textAlign(CENTER, CENTER);
  titleg.text(titleText, titleg.width / 2, titleg.height / 2);

  imageMode(CENTER);
  image(titleg, width / 2, titleg.height / 2 + 10); // 少し下にずらす

  // 漢字のサブタイトルの描画とアニメーション
  kanjiSub.clear();
  kanjiSub.background('black');
  kanjiSub.textFont(font); // フォントを指定
  kanjiSub.textSize(fontSize * 0.8);
  kanjiSub.fill("white");
  kanjiSub.textAlign(CENTER, TOP);

  let kanjiLines = breakTextIntoLines(currentKanji, "", boxWidth, kanjiSub);

  // 漢字のチャンクに分割
  let kanjiChunks = chunkTextLines(kanjiLines, 2); // 1度に表示する行数を2に設定

  if (frameCount % 300 == 0) { // チャンクの切り替えタイミングを調整
    kanjiChunkIndex = (kanjiChunkIndex + 1) % kanjiChunks.length;
  }

  drawTextInBox(kanjiChunks[kanjiChunkIndex], 0, 0, kanjiSub.width, kanjiSub.height, kanjiSub);

  imageMode(CENTER);
  image(kanjiSub, width / 2, height - kanjiSub.height - englishSub.height - 30);

  // 英語のサブタイトルの描画とアニメーション
  englishSub.clear();
  englishSub.background('black');
  englishSub.textFont("Arial");
  englishSub.textSize(fontSize * 0.8);
  englishSub.fill("white");
  englishSub.textAlign(CENTER, TOP);

  let englishLines = breakTextIntoLines(currentEnglish, " ", englishBoxWidth, englishSub);

  // 英語のチャンクに分割
  let englishChunks = chunkTextLines(englishLines, 3); // 1度に表示する行数を3に設定

  // 必要な高さを計算してenglishSubを再生成
  let lineHeight = englishSub.textSize() * 1.2;
  let requiredHeight = lineHeight * englishChunks[englishChunkIndex].length + 20; // マージンを追加
  if (englishSub.height !== requiredHeight) {
    englishSub = createGraphics(englishBoxWidth, requiredHeight);
    englishSub.textFont("Arial");
    englishSub.textSize(fontSize * 0.8);
  }

  if (frameCount % 300 == 0) { // チャンクの切り替えタイミングを調整
    englishChunkIndex = (englishChunkIndex + 1) % englishChunks.length;
    
    
  }

  
  
  
  drawTextInBox(englishChunks[englishChunkIndex], 0, 0, englishSub.width, englishSub.height, englishSub);

  imageMode(CENTER);
  image(englishSub, width / 2, height - englishSub.height / 2 - 10);
}

function drawButton(x, y, width, height, label) {
  rectMode(CENTER);
  fill(200, 100, 100); // ボタンの背景色
  stroke(255); // 白い枠線
  strokeWeight(2);
  rect(x, y, width, height); // ボタンを描画

  fill(255); // 白いテキスト
  noStroke();
  textSize(20);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

function mousePressed() {
  handleButtonPress();
  createLightning();
}

function touchStarted() {
  handleButtonPress();
  createLightning(); // 稲妻エフェクトを生成
  return false; // デフォルト動作を防ぐ
}

function handleButtonPress() {
  // ボタン範囲内のタップを判定
  if (
    mouseX > buttonX - buttonWidth / 2 &&
    mouseX < buttonX + buttonWidth / 2 &&
    mouseY > buttonY - buttonHeight / 2 &&
    mouseY < buttonY + buttonHeight / 2
  ) {
    // 次の回文に進む
    textAnimIndex = 0;
    kanjiChunkIndex = 0;
    englishChunkIndex = 0;
    index = (index + 1) % palindromes.length; // インデックスを更新
    console.log(`タップされました！現在のインデックス: ${index}`);
  }
  {
    sound.play(); // 音を再生
    console.log("ボタンがクリックされました！");
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    textAnimIndex = 0;
    kanjiChunkIndex = 0;
    englishChunkIndex = 0;
    index = (index + 1) % palindromes.length;
  }
  if (key === 'G' || key === 'g') {
    let targetIndex = prompt('表示したいパリンドロームの番号を入力してください（例：1）：');
    if (targetIndex !== null && !isNaN(targetIndex)) {
      index = Math.min(Math.max(parseInt(targetIndex) - 1, 0), palindromes.length - 1);
      textAnimIndex = 0;
      kanjiChunkIndex = 0;
      englishChunkIndex = 0;
    }
  }
}



function breakTextIntoLines(text, delimiter, boxWidth, graphics) {
  // 区切り文字がない場合、適切な長さでテキストを分割
  if (delimiter === "") {
    let lines = [];
    let currentLine = "";
    for (let i = 0; i < text.length; i++) {
      let testLine = currentLine + text[i];
      if (graphics.textWidth(testLine) > boxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = text[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    return lines;
  } else {
    let words = text.split(delimiter);
    let lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      let testLine = currentLine + (currentLine.length > 0 ? delimiter : "") + words[i];
      if (graphics.textWidth(testLine) > boxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
    return lines;
  }
}

function drawTextInBox(lines, x, y, boxWidth, boxHeight, graphics) {
  graphics.textAlign(CENTER, TOP);
  graphics.textSize(graphics.textSize()); // テキストサイズを再設定

  // 行間をフォントサイズの1.2倍に設定
  graphics.textLeading(graphics.textSize() * 1.2);

  let lineHeight = graphics.textLeading(); // 行の高さを取得

  let totalTextHeight = lines.length * lineHeight;
  let startY = y + (boxHeight - totalTextHeight) / 2;

  for (let i = 0; i < lines.length; i++) {
    graphics.text(lines[i], x + boxWidth / 2, startY + i * lineHeight);
  }
}

function fitTextToBox(textContent, boxWidth, mainBoxHeight) {
  g.textFont(font);

  let minSize = 6; // 最小フォントサイズを6に設定
  let maxSize = 80; // 最大フォントサイズを80に設定
  let bestSize = minSize;

  while (minSize <= maxSize) {
    let midSize = Math.floor((minSize + maxSize) / 2);
    g.textSize(midSize);
    
       // スマホの場合にフォントサイズと行間を調整
    if (windowWidth < 600) { // スマホの画面幅を想定
      g.textSize(midSize * 0.8); // フォントサイズを縮小
      g.textLeading(midSize * 1.8); // 行間をさらに広げる
    } else {
      g.textLeading(midSize * 1.2); // 通常の行間
    }
    

    // 行間を設定
    g.textLeading(midSize * 2.5);

    let lines = breakTextIntoLines(textContent, "", boxWidth, g);
    let lineHeight = g.textLeading();
    let totalHeight = lines.length * lineHeight;

    if (totalHeight <= mainBoxHeight) {
      bestSize = midSize;
      minSize = midSize + 1;
    } else {
      maxSize = midSize - 1;
    }
  }

  return bestSize;
}

// 新しい関数：テキストの行をチャンクに分割
function chunkTextLines(lines, linesPerChunk) {
  let chunks = [];
  for (let i = 0; i < lines.length; i += linesPerChunk) {
    chunks.push(lines.slice(i, i + linesPerChunk));
  }
  return chunks;
  
}
