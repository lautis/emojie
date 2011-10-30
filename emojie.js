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

  function emojiElement(char, src) {
    var element = document.createElement("img")
    element.setAttribute("src", src)
    element.className = "emojie " + "emojie-" + emojis[char]
    return element
  }

  function textNodeReplacer(src) {
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
          rest = emoji.splitText(buffer.length);
          node.parentNode.replaceChild(emojiElement(buffer, src), emoji);
          return replacer(rest);
        } else {
          buffer = "";
        }
      }
    }
  }

  window.emojie = function(node, src) {
    var replacer = textNodeReplacer(src || emojie.src);
    if (node.nodeType == 3) {
      replacer(node);
    } else {
      traverseTextNodes(node, replacer);
    }

    return node;
  }

  window.emojie.register = function(emoji, image) {
    var i;
    for (i = 1; i < emoji.length; i++) {
      emojis[emoji.slice(0, i)] = true;
    }
    emojis[emoji] = image;
  }

  window.emojie.src = "emojie.png"

}(window));