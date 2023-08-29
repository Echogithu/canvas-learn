// ------------------------------------ 获取 dom 节点 ------------------------------------ 
const oCan = document.getElementById("canvas");
const ctx = oCan.getContext("2d");

const oColorInput = document.getElementById("colorInput");
const oLineWidthRange = document.getElementById("lineWidthRange");
const oLineWidthValue = document.getElementById("lineWidthValue");
const oClearAllBtn = document.getElementById("clearAllBtn");
const oEraserBtn = document.getElementById("eraserBtn");
const oEraserLineWidthRange = document.getElementById("eraserLineWidthRange");
const oEraserLineWidthValue = document.getElementById("eraserLineWidthValue");
const oEraserCircle = document.getElementById("eraserCircle");
const clientWidth = document.documentElement.clientWidth;
const clientHeight = document.documentElement.clientHeight;

// ------------------------------------ 设置画布宽高  ------------------------------------ 
oCan.width = clientWidth;
oCan.height = clientHeight;

// ------------------------------------ 常量及状态 -------------------------------------- 
const CANVAS_VALUES = {
  DEFAULT_COLOR: "#000",
  DEFAULT_LINE_STYLE: "round",
  DEFAULT_LINE_WIDTH: 1,
  ERASER_COLOR: "#FFF",
};

const KEYBOARD = {
  UNDO: "z", // 撤销
  REDO: "b", // 还原
};

const state = {
  initPos: null,
  eraserStatus: false,
  drewData: [],
  revokedData: [],
};

const DATA_FIELD = {
  DREW: "drewData",
  REVOKED: "revokedData",
};

const DATA_TYPE = {
  MOVE_TO: "moveTo",
  LINE_TO: "lineTo",
};

// ------------------------------------ 初始化 -------------------------------------- 
const init = () => {
  initStyle();
  bindEvent();
};

// function - 初始化样式
function initStyle() {
  ctx.setColor(CANVAS_VALUES.DEFAULT_COLOR);
  ctx.setLineStyle(CANVAS_VALUES.DEFAULT_LINE_STYLE);
  ctx.setLineWidth(CANVAS_VALUES.DEFAULT_LINE_WIDTH);
}

// function - 绑定事件
function bindEvent() {
  oCan.addEventListener("mousedown", handleCanvasMouseDown, false);
  // 设置颜色
  oColorInput.addEventListener("click", handleColorInput, false);
  oColorInput.addEventListener("input", handleColorInput, false);
  // 设置线粗度
  oLineWidthRange.addEventListener("input", handleLineWidthRangeInput, false);
  // 清除画布
  oClearAllBtn.addEventListener("click", handleClearAllBtnClick, false);
  // 橡皮擦
  oEraserBtn.addEventListener("click", handleEraserBtnClick, false);
  oEraserLineWidthRange.addEventListener(
    "input",
    handleEraserLineWidthRangeInput,
    false
  );
  // 快捷键 撤销还原
  document.addEventListener("keydown", handleKeyDown, false);
}

// ------------------------------------ 绑定事件 -------------------------------------- 
// function - handle - 获取设置颜色事件
function handleColorInput() {
  const color = this.value;
  ctx.setColor(color);
  // 还原
  ctx.setLineWidth(oLineWidthRange.value);
  oEraserCircle.setVisible(false);
  state.eraserStatus = false;
}

// function - handle - 获取设置线粗度事件
function handleLineWidthRangeInput() {
  const width = this.value;
  oLineWidthValue.textContent = width;
  ctx.setLineWidth(width);
}

// function - handle - 清除画布事件
function handleClearAllBtnClick() {
  clearAll();
}

// function - handle - 橡皮擦事件
function handleEraserBtnClick() {
  const lineWidthValue = oEraserLineWidthRange.value;
  state.eraserStatus = true;
  ctx.setColor(CANVAS_VALUES.ERASER_COLOR);
  ctx.setLineWidth(lineWidthValue);
  oEraserCircle.setSize(lineWidthValue);
}

// function - handle - 设置橡皮擦大小事件
function handleEraserLineWidthRangeInput() {
  const width = this.value;
  oEraserLineWidthValue.textContent = width;
  oEraserCircle.setSize(width);
  state.eraserStatus && ctx.setLineWidth(width);
}

// function - handle - 快捷键
function handleKeyDown(e) {
  const key = e.key;
  if (e.ctrlKey && Object.values(KEYBOARD).includes(key)) {
    doDrewRecord(key);
    drawBatchLine();
  }

  if (!state[DATA_FIELD.DREW].length || !state[DATA_FIELD.REVOKED].length) {
    ctx.setColor(oColorInput.value);
    ctx.setLineWidth(oLineWidthRange.value);
  }
}

// function - handle - 画布鼠标按下事件
function handleCanvasMouseDown(e) {
  const x1 = e.clientX;
  const y1 = e.clientY;

  state.initPos = { x1, y1 };
  setDrewRecord(DATA_TYPE.MOVE_TO, [x1, y1]);
  drawPoint(x1, y1);

  oCan.addEventListener("mousemove", handleCanvasMouseMove, false);
  oCan.addEventListener("mouseup", handleCanvasMouseUp, false);

  if (state.eraserStatus) {
    oEraserCircle.setVisible(true);
    oEraserCircle.setPosition(x1, y1);
    // 此时鼠标在小圆圈上面
    oEraserCircle.addEventListener("mouseup", handleEraserCircleMouseUp, false);
  }
}

// function - handle - 画布鼠标移动事件
function handleCanvasMouseMove(e) {
  const x2 = e.clientX;
  const y2 = e.clientY;

  drawLine({ ...state.initPos, x2, y2 });
  setDrewRecord(DATA_TYPE.LINE_TO, [x2, y2]);
  state.initPos = { x1: x2, y1: y2 }; // 记得重新赋值
}

// function - handle - 画布鼠标弹起事件
function handleCanvasMouseUp(e) {
  oCan.removeEventListener("mousemove", handleCanvasMouseMove, false);
  oCan.removeEventListener("mouseup", handleCanvasMouseUp, false);
}

// function - handle - 橡皮擦圆圈事件
function handleEraserCircleMouseUp() {
  oEraserCircle.setVisible(false);
  oEraserCircle.removeEventListener(
    "mouseup",
    handleEraserCircleMouseUp,
    false
  );
  handleCanvasMouseUp();
}

// ------------------------------------ 工具函数 -------------------------------------- 
// function - tools - 画点
function drawPoint(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, ctx.lineWidth / 2, 0, 2 * Math.PI, false);
  ctx.stroke();
}

// function - tools - 画线
function drawLine({ x1, y1, x2, y2 }) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// function - tools - 批量画线
function drawBatchLine() {
  clearAll();

  state[DATA_FIELD.DREW].forEach(item => {
    ctx.beginPath();
    const { moveTo: [x1, y1], lineTo, info: { color, width } } = item;
    ctx.setColor(color);
    ctx.setLineWidth(width);
    ctx.moveTo(x1, y1);
    lineTo.forEach(line => {
      ctx.lineTo(...line);
    })
    ctx.stroke();
  })
}

// function - tools - 清除画布
function clearAll() {
  ctx.clearRect(0, 0, oCan.offsetWidth, oCan.offsetHeight);
}

// ------------------------------------ 添加对象属性 -------------------------------------- 
// function - 设置橡皮擦圆圈显示
oEraserCircle.setVisible = function (visible) {
  this.style.display = visible ? "block" : "none";
};

// function - 设置橡皮擦圆圈大小
oEraserCircle.setSize = function (size) {
  this.style.width = size + "px";
  this.style.height = size + "px";
};

// function - 设置橡皮擦圆圈位置
oEraserCircle.setPosition = function (x, y) {
  this.style.left = x - this.offsetWidth / 2 + "px";
  this.style.top = y - this.offsetHeight / 2 + "px";
};

// function - 设置画布颜色
ctx.setColor = function (color) {
  this.strokeStyle = color;
  this.fillStyle = color;
};

// function - 获取画布颜色
ctx.getColor = function () {
  return this.strokeStyle;
};

// function - 设置画布线颜色
ctx.setLineStyle = function (style) {
  this.lineCap = style;
  this.lineJoin = style;
};

// function - 设置画布线粗细
ctx.setLineWidth = function (width) {
  this.lineWidth = width;
};

// function - 获取画布线粗细
ctx.getLineWidth = function () {
  return this.lineWidth;
};

// function - 设置撤销/还原数组数据
function setDrewRecord(type, data) {
  switch (type) {
    case DATA_TYPE.MOVE_TO:
      state[DATA_FIELD.DREW].push({
        [DATA_TYPE.MOVE_TO]: [...data], // x,y
        [DATA_TYPE.LINE_TO]: [],
        info: {
          color: ctx.getColor(),
          width: ctx.getLineWidth(),
        },
      });
      break;
    case DATA_TYPE.LINE_TO:
      const drewData = state[DATA_FIELD.DREW];
      drewData[drewData.length - 1][DATA_TYPE.LINE_TO].push([...data]);
      break;
    default:
      break;
  }
}

// function - 撤销/还原
function doDrewRecord(key) {
  switch (key) {
    case KEYBOARD.UNDO:
      state[DATA_FIELD.DREW].length > 0 && state[DATA_FIELD.REVOKED].push(state[DATA_FIELD.DREW].pop());
      break;
    case KEYBOARD.REDO:
      state[DATA_FIELD.REVOKED].length > 0 && state[DATA_FIELD.DREW].push(state[DATA_FIELD.REVOKED].pop());
      break;
    default:
      break;
  }
}

// 初始化执行
init();
