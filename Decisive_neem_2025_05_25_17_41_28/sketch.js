// グローバル変数
let palindromesData;
let currentPalindrome;
let displayMode; // 0: kanji, 1: hiragana, 2: english
let glitchEffect;
const changeInterval = 120; // 約2秒ごとにエフェクト等を変更 (60fpsの場合)

// グリッチエフェクト用変数
let typeWriterIndex = 0;
let flashOn = true;

// --- フォント用変数 ---
// let fontShizuru; // Shizuruフォントの読み込みを削除
let fontSixtyfour;
let fontNotoSans;
let availableFonts = [];
let currentActiveFont; // 現在ランダムに選択されているフォントオブジェクト/名前を保持

function preload() {
  palindromesData = loadJSON('data.json');

  // --- Shizuru以外のフォントをロード ---
  // fontShizuru = loadFont('Shizuru-Regular.ttf'); // ← この行を削除またはコメントアウト
  fontSixtyfour = loadFont('SixtyfourConvergence-Regular-VariableFont_BLED,SCAN,XELA,YELA.ttf');
  fontNotoSans = loadFont('NotoSans-VariableFont_wdth,wght.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  // ロードが成功したフォントを配列に追加
  // if (fontShizuru) availableFonts.push(fontShizuru); // ← この行を削除またはコメントアウト
  if (fontSixtyfour) availableFonts.push(fontSixtyfour);
  if (fontNotoSans) availableFonts.push(fontNotoSans);

  if (availableFonts.length === 0) {
    print("カスタムフォントがロードできませんでした。デフォルトフォント('monospace')を使用します。");
  }

  selectNewPalindromeAndEffect();
}

function draw() {
  background(0);

  if (frameCount % changeInterval === 0 || !currentPalindrome) {
    selectNewPalindromeAndEffect();
  }

  applyGlitchEffect();
}

function selectNewPalindromeAndEffect() {
  if (palindromesData && palindromesData.jp && palindromesData.jp.length > 0) {
    let randomIndex = floor(random(palindromesData.jp.length));
    currentPalindrome = palindromesData.jp[randomIndex];

    displayMode = floor(random(3));
    glitchEffect = floor(random(8));

    typeWriterIndex = 0;
    flashOn = true;

    if (availableFonts.length > 0) {
      currentActiveFont = random(availableFonts);
    } else {
      currentActiveFont = 'monospace';
    }
    // textFont(currentActiveFont); // フォント設定はapplyGlitchEffect内で行う

  } else {
    currentPalindrome = {
      kanji: "データ確認中",
      hiragana: "でーたかくにんちゅう",
      english: "Checking data..."
    };
    displayMode = 0;
    glitchEffect = 0;
    currentActiveFont = 'monospace';
    // textFont(currentActiveFont);
  }
}

function getDisplayText() {
  if (!currentPalindrome) return "";
  if (displayMode === 0) return currentPalindrome.kanji;
  if (displayMode === 1) return currentPalindrome.hiragana;
  if (displayMode === 2) return currentPalindrome.english;
  return "";
}

function applyGlitchEffect() {
  if (!currentPalindrome) return;

  let displayText = getDisplayText();
  let baseTextSize = map(displayText.length, 5, 30, 70, 30, true);
  baseTextSize = constrain(baseTextSize, 20, 80);

  fill(255);
  push();

  let fontToUse = currentActiveFont;
  const japaneseFontStack = "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ ProN W3', 'Meiryo', 'メイリオ', 'Osaka', 'MS PGothic', 'ＭＳ Ｐゴシック', 'Noto Sans JP', 'sans-serif'";

  if (displayMode === 0 || displayMode === 1) { // 漢字またはひらがなの場合
    fontToUse = japaneseFontStack;
  }
  textFont(fontToUse);

  switch (glitchEffect) {
    case 0: // 高速点滅 (中央)
      textSize(baseTextSize);
      if (frameCount % 10 < 5) {
        text(displayText, width / 2, height / 2);
      }
      break;

    case 1: // 反転・ミラー表示 (中央)
      textSize(baseTextSize);
      translate(width / 2, height / 2);
      if (random(1) < 0.3) scale(-1, 1);
      else if (random(1) < 0.6) scale(1, -1);
      else scale(-1, -1);
      text(displayText, 0, 0);
      break;

    case 2: // タイプライター (中央)
      textSize(baseTextSize);
      typeWriterIndex += 0.5;
      if (typeWriterIndex > displayText.length) {
        typeWriterIndex = displayText.length;
      }
      let partialText = displayText.substring(0, floor(typeWriterIndex));
      if (floor(typeWriterIndex) === displayText.length && frameCount % 30 < 15) {
        // 完了後点滅
      } else {
        text(partialText, width / 2, height / 2);
      }
      break;

    case 3: // 文字を散乱させる
      textSize(baseTextSize * 0.7);
      for (let i = 0; i < displayText.length; i++) {
        push();
        translate(random(width), random(height));
        rotate(random(TWO_PI));
        text(displayText[i], 0, 0);
        pop();
      }
      break;

    case 4: // ノイズ + 中央テキスト
      textSize(baseTextSize);
      text(displayText, width / 2, height / 2);
      noStroke();
      for (let i = 0; i < 20; i++) {
        fill(255, random(50, 150));
        ellipse(random(width), random(height), random(1, 10), random(1, 10));
      }
      fill(255);
      break;

    case 5: // 言語の高速切り替え (中央)
      let tempDisplayMode = floor(frameCount / 20) % 3;
      let tempDisplayText = "";
      if (!currentPalindrome) break;
      if (tempDisplayMode === 0) tempDisplayText = currentPalindrome.kanji;
      else if (tempDisplayMode === 1) tempDisplayText = currentPalindrome.hiragana;
      else tempDisplayText = currentPalindrome.english;

      let tempFontToUse = currentActiveFont;
      if ((tempDisplayMode === 0 || tempDisplayMode === 1) ) {
         tempFontToUse = japaneseFontStack;
      }
      textFont(tempFontToUse);

      let tempTs = map(tempDisplayText.length, 5, 30, 70, 30, true);
      tempTs = constrain(tempTs, 20, 80);
      textSize(tempTs);
      text(tempDisplayText, width / 2, height / 2);
      break;

    case 6: // 折り返しテキスト (ランダムな矩形内)
      let boxW = random(width * 0.3, width * 0.8);
      let boxH = random(height * 0.2, height * 0.6);
      let boxX = random(width - boxW);
      let boxY = random(height - boxH);
      textSize(baseTextSize * 0.5);
      textAlign(CENTER, TOP);
      text(displayText, boxX + boxW / 2, boxY + 10, boxW - 20, boxH - 20);
      textAlign(CENTER, CENTER);
      break;

    case 7: // 円形配置テキスト
      let centerX = width / 2 + random(-width * 0.1, width * 0.1);
      let centerY = height / 2 + random(-height * 0.1, height * 0.1);
      let radius = min(width, height) * random(0.15, 0.4);
      let charSize = max(10, radius * 2 * PI / (displayText.length * 1.5));
      charSize = min(charSize, baseTextSize * 0.8);
      textSize(charSize);
      drawCircularText(displayText, centerX, centerY, radius, random(TWO_PI));
      break;

    default:
      textSize(baseTextSize);
      text(displayText, width / 2, height / 2);
  }
  pop();
}

function drawCircularText(txt, centerX, centerY, radius, startAngle) {
  push();
  translate(centerX, centerY);

  let angleStep = 0;
  if (txt.length > 0) {
    angleStep = TWO_PI / txt.length;
  }

  let circumference = TWO_PI * radius;
  let totalTextWidthEstimate = 0;
  for (let i = 0; i < txt.length; i++) {
    totalTextWidthEstimate += textWidth(txt[i] || " ");
  }

  if (totalTextWidthEstimate > circumference * 0.7 && txt.length > 0) {
    let avgCharWidth = totalTextWidthEstimate / txt.length;
     if (radius > 0) {
        angleStep = (avgCharWidth / radius) * 1.2;
    }
  }
  
  for (let i = 0; i < txt.length; i++) {
    let angle = startAngle + i * angleStep;
    let x = radius * cos(angle);
    let y = radius * sin(angle);

    push();
    translate(x, y);
    rotate(angle + HALF_PI);
    if (random(1) < 0.05 && frameCount % 10 < 2) {
      // 点滅グリッチ
    } else {
      text(txt[i] || " ", 0, 0);
    }
    pop();
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}