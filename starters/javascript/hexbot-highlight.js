let canvas;
let ctx;
let appWidth;
let appHeight;

let columns;
let rows;

let offsetX;
let offsetY;

let styleSheet, styleElement;
// highlight.js general-purpose classes
const classes = new Set([
  'keyword',
  'built_in',
  'type',
  'literal',
  'number',
  'regexp',
  'string',
  'subst',
  'symbol',
  'class',
  'function',
  'title',
  'params'
]);

// init highlight.js
hljs.initHighlightingOnLoad();

// called by NOOPBOT on window.onload

function start_app() {
  // https://davidwalsh.name/add-rules-stylesheets

  // Create the <style> tag
	var style = document.createElement("style");

	// Add a media (and/or media query) here if you'd like!
	// style.setAttribute("media", "screen")
	// style.setAttribute("media", "only screen and (max-width : 1024px)")

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);

  styleSheet = style.sheet;
  styleElement = style;

  // use hexbot to generate a theme
  generateTheme();
}

function generateTheme() {


  //get the data!
  NOOPBOT_FETCH({
    API: 'hexbot',
    count: classes.size
  }, createTheme);
}

function createTheme(responseJson) {
  let { colors } = responseJson;
  let classList = [...classes];
  colors.forEach(function(color, index) {
    styleSheet.insertRule(`.hljs-${classList[index]} { color: ${color.value}}`);
  });
  console.debug(styleElement);
}

function drawPoint(ctx, color, count) {

  let row = Math.ceil(count/columns);
  let column = count%columns;

  let pointSize = NOOPBOT_RANDOM(3,6);
  ctx.fillStyle = color.value;
  ctx.beginPath();
  ctx.arc((column*20) + offsetX, (row*20) + offsetY, pointSize, 0, Math.PI * 2, true);
  ctx.fill();

}

// // listen if browser changes size.
// window.onresize = function(event){
//   sizeCanvas();
//   draw();
// };
