const oCan = document.getElementById("canvas");

/**
 * getContext() => 参数： 2d => Canvas API 
 *                         webgl => WebGL API
 */
const ctx = oCan.getContext("2d");
console.log('ctx: ', ctx);

const clientWidth = document.documentElement.clientWidth;
const clientHeight = document.documentElement.clientHeight;

// 不是给 canvas 标签增加样式，而是给 canvas 画布添加样式
oCan.width = clientWidth;
oCan.height = clientHeight;

// 画线条 stroke
// 填充颜色 fill
ctx.strokeStyle = 'green';
ctx.fillStyle = 'red';

// 线段头的样式
ctx.lineCap = 'round';

// 交叉头的样式
ctx.lineJoin = 'round';

// 线段的宽度
ctx.lineWidth = 2;

// 开始画东西 -> 开启一个绘制的路径
ctx.beginPath();
// 1. 画笔要移动到你开始画的坐标上
ctx.moveTo(100, 100);
// 2. 要把画笔画到哪个坐标上
// 这条线要延伸到什么坐标
ctx.lineTo(300, 300);
ctx.lineTo(500, 200);
ctx.lineTo(100, 100);

// 3. 开始按照1，2的行为规则开始画画
ctx.stroke();


ctx.beginPath();
// 画弧的规则
ctx.arc(700, 70, 50, 0, 2 * Math.PI, false);
// 开始绘制
ctx.stroke();
ctx.fill();

ctx.beginPath();
// 画弧的规则
ctx.arc(500, 50, 50, 0, Math.PI, false);
ctx.moveTo(550,50);
ctx.lineTo(450,50);
// 开始绘制
ctx.stroke();