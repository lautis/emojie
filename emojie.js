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
    var element = document.createElement("img");
    if ((options || {})["src"]) {
      element.setAttribute("src", (options || {})["src"]);
    } else if (emoji.indexOf("/") == 0) {
      element.setAttribute("src", emoji);
    } else {
      element.setAttribute("src", ((options || {})["path"] || "") + "/" + emoji);
    }
    element.className = "emojie " + "emojie-" + emoji;
    return element
  }

  function textNodeReplacer(emojis, options) {
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
          emoji = node.splitText(i - buffer.length + 1);
          rest = emoji.splitText(buffer.length);
          node.parentNode.replaceChild(emojiElement(emojis[buffer], options), emoji);
          return replacer(rest);
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

    var ctx = document.createElement("canvas").getContext("2d");
    ctx.fillText(emoji, 0, 0);

    return hasColor(ctx, 10)
  }

  function Emojie(options) {
    var defaults = options || {};
    var emojis = {};
    function emojie(node, options) {
      var settings = defaults;
      settings.src = emojie.src;
      settings.path = emojie.path;

      for (option in options) {
        settings[option] = options[option];
      }

      var replacer = textNodeReplacer(emojis, settings);
      if (node.nodeType == 3) {
        replacer(node);
      } else {
        traverseTextNodes(node.firstChild, replacer);
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

    return emojie;
  }
  window.Emojie = Emojie;
}(window));