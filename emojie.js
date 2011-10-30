(function(window, undefined) {
  var emojis = {
    "\ud83d\ude04": "1f604"
  }

  // UCS-2, how nice is that?
  // Stolen from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/charAt#Example_2:.C2.A0Getting_whole_characters
  function getWholeChar(str, i) {
      var code = str.charCodeAt(i);     

      if (isNaN(code)) {
          return ''; // Position not found
      }
      if (code < 0xD800 || code > 0xDFFF) {
          return str.charAt(i);
      }
      if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
          if (str.length <= (i+1))  {
              throw 'High surrogate without following low surrogate';
          }
          var next = str.charCodeAt(i+1);
          if (0xDC00 > next || next > 0xDFFF) {
              throw 'High surrogate without following low surrogate';
          }
          return str.charAt(i)+str.charAt(i+1);
      }
      // Low surrogate (0xDC00 <= code && code <= 0xDFFF)
      if (i === 0) {
          throw 'Low surrogate without preceding high surrogate';
      }
      var prev = str.charCodeAt(i-1);
      if (0xD800 > prev || prev > 0xDBFF) { // (could change last hex to 0xDB7F to treat high private surrogates as single characters)
          throw 'Low surrogate without preceding high surrogate';
      }
      return false; // We can pass over low surrogates now as the second component in a pair which we have already processed
  }

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
      var chr, emoji, rest;

      while (i < string.length) {
        chr = getWholeChar(string, i);
        if (emojis[chr]) {
          emoji = node.splitText(i);
          rest = emoji.splitText(chr.length);
          node.parentNode.replaceChild(emojiElement(chr, src), emoji);
          return replacer(rest);
        }
        i += chr.length;
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
  emojie.src = "emojie.png"

}(window));