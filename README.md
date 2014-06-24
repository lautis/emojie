# Emojie

JavaScript library which aims to provide fallbacks for Emoji glyphs as images.

Emoji sets:

* [emojie-iphone](https://github.com/lautis/emojie-iphone) - image replacements using Apple color emoji

## Usage

```javascript
// Define mappings to images
emojie.register("\ud83d\ude04", options);
emojie(document.body);
```

Options is set individually for each emoji. All options will be transfered as attributes to the img element, so you might want to at least set the src attribute.

An example to clarify:

```javascript
emojie.register("\ud83d\ude04", { src: "emoji/smile.png", class: "smile", title: "smile!", id: "example-smiley" });
emojie(document.body);
// <img src="emoji/smile.png" id="example-smiley" class="emojie emojie-smile" title="smile!">
```

There is only one exception: you can set the elementName and content options to wrap the emoji inside an element of the given type and set it's content to the content option. This is useful if one want's to use images in Chrome and real emojis in Safari wrapped in a span element perhaps.

To ignore elements from emojification, set `data-no-emoji` attribute. For example,


```html
<div>
  <p>This will get emojified.</p>
  <p data-no-emojie>But this won't.</p>
</div>
```

## Hacking

The build process runs on [gulp](http://gulpjs.com). Assuming npm is installed,
dependencies can be installed by running

    $ npm install

After that, you can run use local gulp from `./node_modules/.bin/gulp` or
have it installed globally with

    $ npm install -g gulp

Then you should be able to run tests with

    $ gulp test

To continously run tests after file changes use

    $ gulp watch

There's also a gulp task for compiling minified JS file:

    $ gulp dist
