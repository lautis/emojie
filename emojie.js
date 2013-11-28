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

  function emojiElement(emoji, options) {
    var element;
    if (options["elementName"] != undefined) {
      element = document.createElement(options["elementName"]);
      element.textContent = options["content"];
      delete options["content"];
      delete options["elementName"];
    } else {
      element = document.createElement("img");
    }

    for (attr in options) {
      element.setAttribute(attr, options[attr])
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
          node.parentNode.replaceChild(emojiElement(emoji, emojis[buffer]), emoji);

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
