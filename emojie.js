/*!
 * Emojie
 *
 * Copyright (C) 2011 by Ville Lautanala
 * Licensed under the MIT license
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Emojie = factory();
  }
}(this, function() {
  function traverseTextNodes(root, options, callback) {
    if (!root) { return; }
    var stack = [root];
    var children, i, node;
    while (stack.length > 0) {
      node = stack.pop();
      if (node.nodeType == 3) {
        callback(node);
      } else if (node.getAttribute(options.ignoreAttribute || "data-no-emojie") == null) {
        children = node.childNodes.length;
        for (i = children - 1; i >= 0; --i) {
          stack.push(node.childNodes[i]);
        }
      }
    }
  }

  function emojiElement(emoji, options) {
    var attr;
    var element = document.createElement(options.elementName || "img");

    if (options.content) {
      element.textContent = options.content;
    }

    for (attr in options) {
      if (attr != "content" && attr != "elementName") {
        element.setAttribute(attr, options[attr]);
      }
    }
    return element;
  }

  function textNodeReplacer(emojis) {
    return function replacer(node) {
      var string = node.data;
      var i = 0;
      var emoji, rest;
      var buffer = "";

      for (i = 0; i < string.length; i++) {
        buffer += string[i];
        if (emojis[buffer] === true || emojis[buffer] && emojis[buffer + string[i + 1]]) {
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
    };
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
  };

  function Emojie(options) {
    var emojis = {};

    function emojie(node) {
      var replacer = textNodeReplacer(emojis);

      if (node.nodeType == 3) {
        replacer(node);
      } else {
        traverseTextNodes(node, options || {}, replacer);
      }
      return node;
    }
    emojie._emojis = emojis;

    emojie.register = function(emoji, options) {
      var i, slice;
      for (i = 1; i < emoji.length; i++) {
        slice = emoji.slice(0, i);
        if (!(slice in emojis)) {
          emojis[slice] = true;
        }
      }
      emojis[emoji] = options;
      return emojie;
    };

    emojie.merge = function(other) {
      function choose(a, b) {
        if (a === true && b) {
          return b;
        } else if (a && b) {
          return a;
        } else {
          return a || b;
        }
      }

      var key, value;
      for (key in other._emojis) {
        if (other._emojis.hasOwnProperty(key)) {
          emojis[key] = choose(other._emojis[key], emojis[key]);
        }
      }
      return emojie;
    };

    return emojie;
  }
  return Emojie;
}));
