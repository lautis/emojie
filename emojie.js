/*!
 * Emojie
 *
 * Copyright (C) 2011 by Ville Lautanala
 * Licensed under the MIT license
 */

(function(window, undefined) {
  var emojis = {};

  function traverseTextNodes(root, callback) {
    if (root == null) { return; }

    traverseTextNodes(root.nextSibling, callback);

    if (root.nodeType == 3) {
      return callback(root);
    }

    traverseTextNodes(root.firstChild, callback);
  }

  function emojiElement(emojiHash) {

    var element = document.createElement("img");

    element.setAttribute("src", emojiHash["src"]);
    element.className = "emojie " + "emojie-" + emojiHash["code"];

    for (attr in emojiHash["attrs"]) {
      element.setAttribute(attr, emojiHash["attrs"][attr])
    }
    return element
  }

  function textNodeReplacer(emojis) {
    return function replacer(node) {
      var string = node.data;
      var i = 0;
      var emoji, rest;
      var buffer = "";

      for (i = 0; i < string.length; i++) {
        buffer += string[i];
        if (emojis[buffer] === true) {
          continue;
        } else if (emojis[buffer]) {
          emoji = node.splitText(i - buffer.length + 1);

          if (emoji.length > buffer.length) {
            rest = emoji.splitText(buffer.length);
          }

          node.parentNode.replaceChild(emojiElement(emojis[buffer]), emoji);

          if (rest) {
            return replacer(rest);
          } else {
            return;
          }
        } else {
          buffer = "";
        }
      }
    }
  }

  Emojie.canRender = function(emoji) {
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

    try {
      var ctx = document.createElement("canvas").getContext("2d");
      ctx.fillText(emoji, 0, 0);

      return hasColor(ctx, 10);
    } catch (ex) {
      return false;
    }
  }

  function Emojie() {
    var emojis = {};

    function emojie(node) {

      var replacer = textNodeReplacer(emojis);

      if (node.nodeType == 3) {
        replacer(node);
      } else {
        traverseTextNodes(node.firstChild, replacer);
      }
      return node;
    }
    /*
      Allows you to register emoji to their options. Supported option attributes are:
        {
          src: image location
          code: the code to set on the element class i.e. "emoji-#{code}"
          attrs: arbitrary attributes to set on the resulting replaced element. Given as object.
        }
    */
    emojie.register = function(emoji, options) {
      var i;
      for (i = 1; i < emoji.length; i++) {
        emojis[emoji.slice(0, i)] = true;
      }
      emojis[emoji] = options;
    }

    return emojie;
  }
  window.Emojie = Emojie;
}(window));
