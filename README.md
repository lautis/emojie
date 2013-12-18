# Emojie

JavaScript library which aims to provide fallbacks for Emoji glyphs as images.

## Usage

    // Define mappings to images
    emojie.register("\ud83d\ude04", options);
    emojie(document.body);

Options is set individually for each emoji. All options will be transfered as attributes to the img element, so you might want to at least set the src attribute.

An example to clarify:

    emojie.register("\ud83d\ude04", { src: "emoji/smile.png", class: "smile", title: "smile!", id: "example-smiley" });
    emojie(document.body);
    // <img src="emoji/smile.png" id="example-smiley" class="emojie emojie-smile" title="smile!">

There is only one exception: you can set the elementName and content options to wrap the emoji inside an element of the given type and set it's content to the content option. This is useful if one want's to use images in Chrome and real emojis in Safari wrapped in a span element perhaps.

To ignore elements from emojification, set `data-no-emoji` attribute. For example,


    <div>
      <p>This will get emojified.</p>
      <p data-no-emojie>But this won't.</p>
    </div>

## TODO

* figure out if there are emoji images with suitable license

## License

Emojie is licensed under MIT license. This license doesn't apply to images.

[TypePad](http://start.typepad.jp/typecast/) icons are licensed under dual
CC-BY and GPL license. The iPhone Emoji glyphs (c) Apple.

## Thanks

* Cal Henderson for Emoji [conversion table](http://code.iamcal.com/php/emoji/)
* [TypePad](http://start.typepad.jp/typecast/) for (relatively) free Emoji icons
* [K9Mail](http://code.google.com/p/k9mail/issues/detail?id=2037) for mappings
from TypePad icons to emoji code points
