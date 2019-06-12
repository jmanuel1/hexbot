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
  createStyleSheet();

  // use hexbot to generate a theme
  generateTheme();

  // listen for changes in text
  updateOnChanges();
  // listen for randomize button press
  randomizeOnClick();
}

function createStyleSheet() {
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
}

function generateTheme() {
  //get the data!
  NOOPBOT_FETCH({
    API: 'hexbot',
    count: classes.size
  }, createTheme);
}

function createTheme(responseJson) {
  let {
    colors
  } = responseJson;
  let classList = [...classes];
  colors.forEach(function(color, index) {
    styleSheet.insertRule(
      `
      .hljs-${classList[index]} {
        color: ${color.value}
      }`
    );
  });
  console.debug(styleElement);
}

function updateOnChanges() {
  const code = document.querySelector("#editor");
  code.addEventListener('keyup', (event) => {
    restoreCaret = saveCaretPosition(code);
    // use innerText to prevent current highlighting from interfering
    const text = code.innerText;
    const highlightedText = hljs.highlight('js', text, true).value;
    // really shouldn't do this, I think
    code.innerHTML = highlightedText;
    restoreCaret(event.code === 'Enter');
  });
}

function randomizeOnClick() {
  const button = document.querySelector('button[name="randomize"]');
  button.addEventListener('click', () => {
    clearStyleSheet();
    generateTheme();
  })
}

function clearStyleSheet() {
  document.head.removeChild(styleElement);
  createStyleSheet();
}

// https://stackoverflow.com/a/38479462/3455228
function saveCaretPosition(context) {
  var selection = window.getSelection();
  var range = selection.getRangeAt(0);
  range.setStart(context, 0);
  var len = range.toString().length;

  return function restore(shouldMoveToNextLine) {
    var pos = getTextNodeAtPosition(context, len);
    selection.removeAllRanges();
    var range = new Range();
    const position = pos.position + (shouldMoveToNextLine ? 1 : 0);
    range.setStart(pos.node, position);
    selection.addRange(range);
  }
}

// https://stackoverflow.com/a/38479462/3455228
function getTextNodeAtPosition(root, index) {
  var lastNode = null;

  var treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT,
    function next(elem) {
      if (index >= elem.textContent.length) {
        index -= elem.textContent.length;
        lastNode = elem;
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT;
    });
  var c = treeWalker.nextNode();
  return {
    node: c ? c : root,
    position: c ? index : 0
  };
}

// // listen if browser changes size.
// window.onresize = function(event){
//   sizeCanvas();
//   draw();
// };
