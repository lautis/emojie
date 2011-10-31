(function(window, undefined) {
  var emojis = {};

  function traverseTextNodes(root, callback) {
    var children = root.childNodes;
    var length = children.length;
    if (length == 0) return 0;

    var i, r, node;
    for (i = 0; i < length; i++) {
      node = children[i];
      if (node.nodeType == 3) {
        callback(node);
        r = children.length;
        i += r - length;
        length = r;
      } else {
        traverseTextNodes(node, callback);
      }
    }
    return root;
  }

  function emojiElement(emoji, options) {
    var element = document.createElement("img");
    if ((options || {})["src"] || emojie.src) {
      element.setAttribute("src", (options || {})["src"] || emojie.src);
    } else if (emoji.indexOf("/") == 0) {
      element.setAttribute("src", emoji);
    } else {
      element.setAttribute("src", ((options || {})["path"] || emojie.path || "") + "/" + emoji);
    }
    element.className = "emojie " + "emojie-" + emoji;
    return element
  }

  function textNodeReplacer(options) {
    return function replacer(node) {
      var string = node.textContent || node.data;
      var i = 0;
      var emoji, rest;
      var buffer = "";

      for (i = 0; i < string.length; i++) {
        buffer += string[i];
        if (emojis[buffer] === true) {
          continue;
        } else if (emojis[buffer]) {
          emoji = node.splitText(i);
          rest = emoji.splitText(buffer.length - 1);
          node.parentNode.replaceChild(emojiElement(emojis[buffer], options), emoji);
          return replacer(rest);
        } else {
          buffer = "";
        }
      }
    }
  }

  function emojie(node, options) {
    var replacer = textNodeReplacer(options);
    if (node.nodeType == 3) {
      replacer(node);
    } else {
      traverseTextNodes(node, replacer);
    }

    return node;
  }

  emojie.register = function(emoji, image) {
    var i;
    for (i = 1; i < emoji.length; i++) {
      emojis[emoji.slice(0, i)] = true;
    }
    emojis[emoji] = image;
  }

  emojie.canRender = function(emoji) {
    function hasColor(ctx, width) {
      var data = ctx.getImageData(0, 0, width, width).data;
      var i;

      for (i = 0; i < data.length; i += 4) {
        if (data[i] != data[i + 1] && data[i] != data[i + 2]) {
          return true;
        }
      }
      return false;
    }

    var ctx = document.createElement("canvas").getContext("2d");
    ctx.fillText(emoji, 0, 0);

    return hasColor(ctx, 10)
  }

  window.emojie = emojie;
}(window));