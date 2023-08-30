const oCan = document.getElementById("can");
const ctx = oCan.getContext("2d");

const documentElement = document.documentElement;
oCan.width = documentElement.clientWidth;
oCan.height = documentElement.clientHeight;

let rectInfo = null; // [x,y,w,h]
// w h
// move => x2,y2 => x2 - x, y2 - y => 绝对值 w h
const rectWrapper = [
  /**
   * [x,y,w,h]
   * [x,y,w,h]
   * [x,y,w,h]
   */
];

const init = () => {
  bindEvent();
};

function bindEvent() {
  oCan.addEventListener("mousedown", handleCanvasMouseDown, false);
}

function handleCanvasMouseDown(e) {
  rectInfo = [e.clientX, e.clientY];

  oCan.addEventListener("mousemove", handleCanvasMouseMove, false);
  oCan.addEventListener("mouseup", handleCanvasMouseUp, false);
}

function handleCanvasMouseMove(e) {
  createRect(rectInfo[0], rectInfo[1], e.clientX, e.clientY);
}

function handleCanvasMouseUp() {
  saveRect();

  oCan.removeEventListener("mousemove", handleCanvasMouseMove, false);
  oCan.removeEventListener("mouseup", handleCanvasMouseUp, false);
}

function createRect(x1, y1, x2, y2) {
  const w = Math.abs(x2 - x1);
  const h = Math.abs(y2 - y1);
  rectInfo = [x1, y1, w, h];

  // 鼠标移动过程中一直再清除和绘制
  clearRect(0, 0, oCan.width, oCan.height);
  // 画之前保存的
  strokeRects();
  // 画新的
  strokeRect(...rectInfo);
}

function saveRect() {
  rectWrapper.push(rectInfo);
}

function clearRect(x, y, w, h) {
  ctx.clearRect(x, y, w, h);
}

function strokeRect(x, y, w, h) {
  ctx.strokeRect(x, y, w, h);
}

function strokeRects() {
  rectWrapper.forEach(item => strokeRect(...item))
}

init();
