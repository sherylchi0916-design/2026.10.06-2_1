// 宣告五題國文簡易選擇題資料。
const questions = [
  // 建立第一題的題目資料。
  {
    // 設定第一題題目文字。
    question: "「一日千里」通常用來形容什麼？",
    // 設定第一題的四個選項文字。
    options: ["吃得很多", "進步或速度很快", "路程非常遙遠", "天氣非常炎熱"],
    // 設定第一題正確答案的索引位置。
    answer: 1
  },
  // 建立第二題的題目資料。
  {
    // 設定第二題題目文字。
    question: "下列哪一個詞語最適合形容勤奮學習？",
    // 設定第二題的四個選項文字。
    options: ["無所事事", "走馬看花", "專心致志", "囫圇吞棗"],
    // 設定第二題正確答案的索引位置。
    answer: 2
  },
  // 建立第三題的題目資料。
  {
    // 設定第三題題目文字。
    question: "「夕陽西下」中的「西下」是指什麼？",
    // 設定第三題的四個選項文字。
    options: ["太陽從西方升起", "太陽向西方落下", "月亮向西方升起", "風從西方吹來"],
    // 設定第三題正確答案的索引位置。
    answer: 1
  },
  // 建立第四題的題目資料。
  {
    // 設定第四題題目文字。
    question: "下列哪一個字的意思是「看」？",
    // 設定第四題的四個選項文字。
    options: ["望", "聞", "說", "走"],
    // 設定第四題正確答案的索引位置。
    answer: 0
  },
  // 建立第五題的題目資料。
  {
    // 設定第五題題目文字。
    question: "下列哪一個句子的標點符號使用正確？",
    // 設定第五題的四個選項文字。
    options: ["你吃飽了嗎。", "今天天氣很好！", "我喜歡：閱讀。", "他說，「請進。」"],
    // 設定第五題正確答案的索引位置。
    answer: 1
  }
];

// 宣告目前顯示的題目索引。
let currentQuestionIndex = 0;
// 宣告目前答對的題數。
let score = 0;
// 宣告目前是否已經選過答案。
let answerLocked = false;
// 宣告測驗是否已經完成。
let quizFinished = false;
// 宣告錯誤回饋與正確答案動畫是否正在顯示。
let wrongAnswerShown = false;
// 宣告畫布物件。
let canvas;
// 宣告測驗主要容器。
let appContainer;
// 宣告標題元素。
let titleElement;
// 宣告進度元素。
let progressElement;
// 宣告題目元素。
let questionElement;
// 宣告四個選項按鈕元素陣列。
let optionElements = [];
// 宣告答題回饋元素。
let feedbackElement;
// 宣告下一題按鈕元素。
let nextButton;
// 宣告結果元素。
let resultElement;
// 宣告重新開始按鈕元素。
let restartButton;
// 宣告正確答案動畫的開始時間。
let animationStartTime = 0;

// p5.js 初始化函式，只會在畫面建立時執行一次。
function setup() {
  // 建立符合瀏覽器視窗大小的畫布。
  canvas = createCanvas(windowWidth, windowHeight);
  // 將畫布固定在瀏覽器左上角。
  canvas.position(0, 0);
  // 將畫布設定為固定定位。
  canvas.style("position", "fixed");
  // 將畫布放在 DOM 介面後方。
  canvas.style("z-index", "-1");
  // 讓畫布不攔截滑鼠與觸控事件。
  canvas.style("pointer-events", "none");
  // 設定整個頁面的基本樣式。
  stylePage();
  // 建立測驗的 DOM 介面。
  createInterface();
  // 顯示第一題內容。
  renderQuestion();
}

// p5.js 每一幀執行的繪圖函式。
function draw() {
  // 使用淡藍色作為全螢幕背景。
  background("#eef6fb");
  // 關閉圖形外框線。
  noStroke();
  // 設定左上方裝飾圖形的顏色。
  fill("#d9edff");
  // 繪製左上方柔和裝飾圓。
  ellipse(width * 0.08, height * 0.12, width * 0.24, width * 0.24);
  // 設定右下方裝飾圖形的顏色。
  fill("#ddf4e4");
  // 繪製右下方柔和裝飾圓。
  ellipse(width * 0.92, height * 0.88, width * 0.32, width * 0.32);
  // 執行答錯後的正確答案上下跳動動畫。
  animateCorrectAnswer();
}

// 設定頁面基本樣式的函式。
function stylePage() {
  // 取得目前網頁的 body 元素。
  const body = document.body;
  // 移除瀏覽器預設外距。
  body.style.margin = "0";
  // 設定適合繁體中文的字型。
  body.style.fontFamily = "Noto Sans TC, Microsoft JhengHei, sans-serif";
  // 隱藏水平捲軸。
  body.style.overflowX = "hidden";
  // 設定頁面最小高度為整個視窗高度。
  body.style.minHeight = "100vh";
  // 設定頁面背景顏色。
  body.style.backgroundColor = "#eef6fb";
  // 設定行動裝置的觸控操作方式。
  body.style.touchAction = "manipulation";
}

// 建立所有測驗介面元素的函式。
function createInterface() {
  // 建立主要測驗容器。
  appContainer = createDiv();
  // 設定主要容器的識別名稱。
  appContainer.id("quiz-app");
  // 設定主要容器的相對定位。
  appContainer.style("position", "relative");
  // 設定主要容器位於畫布上方。
  appContainer.style("z-index", "1");
  // 設定主要容器寬度與最大寬度。
  appContainer.style("width", "min(92vw, 760px)");
  // 設定主要容器的最大高度。
  appContainer.style("max-height", "calc(100vh - 40px)");
  // 讓內容過多時可以垂直捲動。
  appContainer.style("overflow-y", "auto");
  // 設定主要容器水平置中與上下外距。
  appContainer.style("margin", "20px auto");
  // 設定主要容器內距。
  appContainer.style("padding", "clamp(22px, 5vw, 46px)");
  // 設定主要容器盒模型。
  appContainer.style("box-sizing", "border-box");
  // 設定主要容器背景。
  appContainer.style("background", "rgba(255, 255, 255, 0.95)");
  // 設定主要容器圓角。
  appContainer.style("border-radius", "24px");
  // 設定主要容器陰影。
  appContainer.style("box-shadow", "0 16px 48px rgba(42, 76, 105, 0.16)");

  // 建立測驗標題。
  titleElement = createElement("h1", "國文簡易選擇題測驗");
  // 將標題放入主要容器。
  titleElement.parent(appContainer);
  // 設定標題上下外距。
  titleElement.style("margin", "0 0 10px");
  // 設定標題字體大小。
  titleElement.style("font-size", "clamp(26px, 5vw, 40px)");
  // 設定標題文字顏色。
  titleElement.style("color", "#203b54");
  // 設定標題文字置中。
  titleElement.style("text-align", "center");

  // 建立題目進度文字。
  progressElement = createElement("p", "");
  // 將進度文字放入主要容器。
  progressElement.parent(appContainer);
  // 設定進度文字外距。
  progressElement.style("margin", "0 0 22px");
  // 設定進度文字置中。
  progressElement.style("text-align", "center");
  // 設定進度文字顏色。
  progressElement.style("color", "#58718a");
  // 設定進度文字粗細。
  progressElement.style("font-weight", "700");
  // 設定進度文字大小。
  progressElement.style("font-size", "18px");

  // 建立題目文字元素。
  questionElement = createElement("h2", "");
  // 將題目文字放入主要容器。
  questionElement.parent(appContainer);
  // 設定題目文字行高。
  questionElement.style("line-height", "1.6");
  // 設定題目文字大小。
  questionElement.style("font-size", "clamp(20px, 3.5vw, 30px)");
  // 設定題目文字顏色。
  questionElement.style("color", "#263b50");
  // 設定題目文字外距。
  questionElement.style("margin", "0 0 22px");

  // 使用迴圈建立四個選項按鈕。
  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    // 建立一個空白選項按鈕。
    const optionButton = createButton("");
    // 將選項按鈕放入主要容器。
    optionButton.parent(appContainer);
    // 設定選項按鈕的類別名稱。
    optionButton.addClass("quiz-option");
    // 設定選項按鈕寬度為百分之百。
    optionButton.style("width", "100%");
    // 設定選項按鈕內距。
    optionButton.style("padding", "16px 18px");
    // 設定選項按鈕下方外距。
    optionButton.style("margin", "0 0 12px");
    // 設定選項按鈕盒模型。
    optionButton.style("box-sizing", "border-box");
    // 設定選項按鈕邊框。
    optionButton.style("border", "2px solid #d5e1ec");
    // 設定選項按鈕圓角。
    optionButton.style("border-radius", "14px");
    // 設定選項按鈕初始背景色。
    optionButton.style("background", "#ffffff");
    // 設定選項按鈕文字顏色。
    optionButton.style("color", "#294158");
    // 設定選項按鈕字體大小。
    optionButton.style("font-size", "clamp(17px, 2.5vw, 21px)");
    // 設定選項按鈕文字靠左對齊。
    optionButton.style("text-align", "left");
    // 設定選項按鈕可點擊游標。
    optionButton.style("cursor", "pointer");
    // 設定選項按鈕的觸控操作方式。
    optionButton.style("touch-action", "manipulation");
    // 設定選項按鈕的轉場動畫。
    optionButton.style("transition", "transform 0.15s ease, border-color 0.15s ease, background 0.15s ease");
    // 綁定 p5.js 原生滑鼠與觸控按壓事件。
    optionButton.mousePressed(() => handleOptionClick(optionIndex));
    // 為選項按鈕加入原生觸控事件以強化行動裝置支援。
    optionButton.elt.addEventListener("touchstart", (event) => handleTouchOption(event, optionIndex), { passive: false });
    // 將選項按鈕保存到陣列。
    optionElements.push(optionButton);
  }

  // 建立答題回饋文字元素。
  feedbackElement = createElement("p", "");
  // 將答題回饋文字放入主要容器。
  feedbackElement.parent(appContainer);
  // 設定回饋文字最小高度。
  feedbackElement.style("min-height", "30px");
  // 設定回饋文字外距。
  feedbackElement.style("margin", "8px 0 12px");
  // 設定回饋文字置中。
  feedbackElement.style("text-align", "center");
  // 設定回饋文字大小。
  feedbackElement.style("font-size", "18px");
  // 設定回饋文字粗細。
  feedbackElement.style("font-weight", "700");

  // 建立下一題按鈕。
  nextButton = createButton("下一題");
  // 將下一題按鈕放入主要容器。
  nextButton.parent(appContainer);
  // 設定下一題按鈕寬度。
  nextButton.style("width", "100%");
  // 設定下一題按鈕內距。
  nextButton.style("padding", "14px 20px");
  // 設定下一題按鈕邊框。
  nextButton.style("border", "0");
  // 設定下一題按鈕圓角。
  nextButton.style("border-radius", "12px");
  // 設定下一題按鈕背景色。
  nextButton.style("background", "#3f78a8");
  // 設定下一題按鈕文字色。
  nextButton.style("color", "#ffffff");
  // 設定下一題按鈕字體大小。
  nextButton.style("font-size", "18px");
  // 設定下一題按鈕游標。
  nextButton.style("cursor", "pointer");
  // 設定下一題按鈕觸控操作方式。
  nextButton.style("touch-action", "manipulation");
  // 綁定下一題按鈕的滑鼠與觸控事件。
  nextButton.mousePressed(goToNextQuestion);
  // 綁定下一題按鈕的原生觸控事件。
  nextButton.elt.addEventListener("touchstart", handleTouchNext, { passive: false });
  // 初始隱藏下一題按鈕。
  nextButton.hide();

  // 建立測驗結果文字元素。
  resultElement = createElement("p", "");
  // 將測驗結果文字放入主要容器。
  resultElement.parent(appContainer);
  // 設定測驗結果文字置中。
  resultElement.style("text-align", "center");
  // 設定測驗結果文字大小。
  resultElement.style("font-size", "clamp(22px, 4vw, 32px)");
  // 設定測驗結果文字顏色。
  resultElement.style("color", "#2d6946");
  // 設定測驗結果文字粗細。
  resultElement.style("font-weight", "700");
  // 初始隱藏測驗結果文字。
  resultElement.hide();

  // 建立重新開始按鈕。
  restartButton = createButton("重新開始測驗");
  // 將重新開始按鈕放入主要容器。
  restartButton.parent(appContainer);
  // 設定重新開始按鈕寬度。
  restartButton.style("width", "100%");
  // 設定重新開始按鈕內距。
  restartButton.style("padding", "14px 20px");
  // 設定重新開始按鈕邊框。
  restartButton.style("border", "2px solid #3f78a8");
  // 設定重新開始按鈕圓角。
  restartButton.style("border-radius", "12px");
  // 設定重新開始按鈕背景色。
  restartButton.style("background", "#ffffff");
  // 設定重新開始按鈕文字顏色。
  restartButton.style("color", "#3f78a8");
  // 設定重新開始按鈕字體大小。
  restartButton.style("font-size", "18px");
  // 設定重新開始按鈕游標。
  restartButton.style("cursor", "pointer");
  // 設定重新開始按鈕觸控操作方式。
  restartButton.style("touch-action", "manipulation");
  // 綁定重新開始按鈕事件。
  restartButton.mousePressed(restartQuiz);
  // 綁定重新開始按鈕的原生觸控事件。
  restartButton.elt.addEventListener("touchstart", handleTouchRestart, { passive: false });
  // 初始隱藏重新開始按鈕。
  restartButton.hide();
}

// 處理選項原生觸控事件的函式。
function handleTouchOption(event, optionIndex) {
  // 防止觸控事件造成頁面捲動或重複觸發。
  event.preventDefault();
  // 執行選項作答處理函式。
  handleOptionClick(optionIndex);
}

// 處理下一題按鈕原生觸控事件的函式。
function handleTouchNext(event) {
  // 防止觸控事件造成頁面捲動或重複觸發。
  event.preventDefault();
  // 執行前往下一題函式。
  goToNextQuestion();
}

// 處理重新開始按鈕原生觸控事件的函式。
function handleTouchRestart(event) {
  // 防止觸控事件造成頁面捲動或重複觸發。
  event.preventDefault();
  // 執行重新開始測驗函式。
  restartQuiz();
}

// 將目前題目資料更新到畫面上的函式。
function renderQuestion() {
  // 取得目前題目物件。
  const currentQuestion = questions[currentQuestionIndex];
  // 顯示目前題目進度。
  progressElement.html(`第 ${currentQuestionIndex + 1} 題／共 ${questions.length} 題`);
  // 顯示目前題目文字。
  questionElement.html(currentQuestion.question);
  // 將答題鎖定狀態解除。
  answerLocked = false;
  // 將錯誤回饋狀態清除。
  wrongAnswerShown = false;
  // 將動畫起始時間歸零。
  animationStartTime = 0;
  // 使用迴圈更新四個選項按鈕。
  optionElements.forEach((optionButton, optionIndex) => {
    // 設定選項按鈕的文字內容。
    optionButton.html(`${String.fromCharCode(65 + optionIndex)}. ${currentQuestion.options[optionIndex]}`);
    // 還原選項按鈕背景色。
    optionButton.style("background", "#ffffff");
    // 還原選項按鈕邊框顏色。
    optionButton.style("border-color", "#d5e1ec");
    // 還原選項按鈕位移。
    optionButton.style("transform", "translateY(0px)");
    // 重新啟用選項按鈕。
    optionButton.elt.disabled = false;
    // 還原選項按鈕游標。
    optionButton.style("cursor", "pointer");
    // 設定選項按鈕的無障礙標籤。
    optionButton.attribute("aria-label", `選項${String.fromCharCode(65 + optionIndex)}：${currentQuestion.options[optionIndex]}`);
  });
  // 清空答題回饋文字。
  feedbackElement.html("");
  // 設定答題回饋的預設顏色。
  feedbackElement.style("color", "#2d6946");
  // 顯示題目元素。
  questionElement.show();
  // 顯示所有選項按鈕。
  optionElements.forEach((optionButton) => optionButton.show());
  // 隱藏下一題按鈕直到使用者答題。
  nextButton.hide();
  // 隱藏測驗結果。
  resultElement.hide();
  // 隱藏重新開始按鈕。
  restartButton.hide();
}

// 處理使用者選擇答案的函式。
function handleOptionClick(optionIndex) {
  // 判斷測驗完成或本題已作答時是否需要忽略操作。
  if (quizFinished || answerLocked) {
    // 直接結束函式以避免重複計分。
    return;
  }
  // 鎖定目前題目避免重複作答。
  answerLocked = true;
  // 取得目前題目的資料。
  const currentQuestion = questions[currentQuestionIndex];
  // 取得目前題目的正確答案索引。
  const correctOptionIndex = currentQuestion.answer;
  // 停用所有選項按鈕。
  optionElements.forEach((optionButton) => {
    // 停用目前選項按鈕。
    optionButton.elt.disabled = true;
    // 將選項游標改為一般箭頭。
    optionButton.style("cursor", "default");
  });
  // 判斷使用者是否答對。
  if (optionIndex === correctOptionIndex) {
    // 將答對題數增加一題。
    score += 1;
    // 顯示答對提示。
    feedbackElement.html("答對了！請按「下一題」繼續。");
    // 設定答對提示顏色。
    feedbackElement.style("color", "#2d7a4c");
    // 設定正確選項的提示背景。
    optionElements[correctOptionIndex].style("background", "#d7f5dc");
    // 設定正確選項的提示邊框。
    optionElements[correctOptionIndex].style("border-color", "#56a66d");
  } else {
    // 顯示答錯提示。
    feedbackElement.html("答錯了！綠色選項是正確答案，請按「下一題」繼續。");
    // 設定答錯提示顏色。
    feedbackElement.style("color", "#a34b4b");
    // 將被選錯的選項套用指定的 #b0f2b4 背景色。
    optionElements[optionIndex].style("background", "#b0f2b4");
    // 設定被選錯選項的邊框顏色。
    optionElements[optionIndex].style("border-color", "#69b875");
    // 設定正確選項的提示背景色。
    optionElements[correctOptionIndex].style("background", "#fff4bf");
    // 設定正確選項的提示邊框色。
    optionElements[correctOptionIndex].style("border-color", "#d3a82f");
    // 設定錯誤回饋顯示狀態。
    wrongAnswerShown = true;
    // 記錄正確答案動畫開始時間。
    animationStartTime = millis();
  }
  // 顯示下一題按鈕。
  nextButton.show();
}

// 執行答錯後正確答案上下跳動的函式。
function animateCorrectAnswer() {
  // 判斷目前是否需要播放正確答案動畫。
  if (!wrongAnswerShown || animationStartTime === 0) {
    // 不需要動畫時直接離開函式。
    return;
  }
  // 取得目前題目的正確答案索引。
  const correctOptionIndex = questions[currentQuestionIndex].answer;
  // 依照正弦波計算平滑的上下跳動距離。
  const jumpOffset = sin((millis() - animationStartTime) * 0.012) * 10;
  // 將上下跳動距離套用到正確選項按鈕。
  optionElements[correctOptionIndex].style("transform", `translateY(${jumpOffset}px)`);
}

// 前往下一題或顯示測驗結果的函式。
function goToNextQuestion() {
  // 判斷使用者尚未作答時是否需要忽略操作。
  if (!answerLocked) {
    // 尚未作答時直接離開函式。
    return;
  }
  // 判斷目前是否為最後一題。
  if (currentQuestionIndex === questions.length - 1) {
    // 設定測驗完成狀態。
    quizFinished = true;
    // 顯示最後的測驗結果。
    showResult();
    // 結束函式避免讀取不存在的題目。
    return;
  }
  // 將目前題目索引增加一題。
  currentQuestionIndex += 1;
  // 顯示下一題內容。
  renderQuestion();
}

// 顯示五題完成後答對題數的函式。
function showResult() {
  // 隱藏題目進度。
  progressElement.hide();
  // 隱藏題目文字。
  questionElement.hide();
  // 隱藏所有選項按鈕。
  optionElements.forEach((optionButton) => optionButton.hide());
  // 隱藏答題回饋文字。
  feedbackElement.hide();
  // 隱藏下一題按鈕。
  nextButton.hide();
  // 顯示最終答對題數。
  resultElement.html(`測驗完成！<br>你答對了 ${score}／${questions.length} 題。`);
  // 顯示測驗結果文字。
  resultElement.show();
  // 顯示重新開始按鈕。
  restartButton.show();
}

// 重新設定狀態並重新開始測驗的函式。
function restartQuiz() {
  // 將目前題目索引重設為第一題。
  currentQuestionIndex = 0;
  // 將答對題數重設為零。
  score = 0;
  // 將測驗完成狀態重設為尚未完成。
  quizFinished = false;
  // 顯示第一題內容。
  renderQuestion();
  // 顯示題目進度文字。
  progressElement.show();
}

// 瀏覽器視窗尺寸改變時重新調整畫布大小的函式。
function windowResized() {
  // 將畫布調整為最新的視窗寬度與高度。
  resizeCanvas(windowWidth, windowHeight);
}
