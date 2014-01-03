describe("emojie", function() {
  var emojie = Emojie();
  emojie.register("\ud83d\ude04", { class: "emojie emojie-1f604", src: "http://localhost/emoji/emoji.png", title: ":foo_bar:", id: "test-id" });

  it("doesn't do anything if string doesn't contain emoji", function() {
    var node = $("<div>").text("foo bar")[0].childNodes[0]
    expect(emojie(node).textContent).toBe(node.textContent);
  });

  it("replaces single emoji character with image in single text node", function() {
    var node = $("<div>").text("foo \ud83d\ude04 bar");
    emojie(node[0].childNodes[0]);
    expect(node.html().indexOf("<img ")).toNotBe(-1);
  });

  it("can handle multiple emojis in same string", function() {
    var node = $("<div>").text("foo \ud83d\ude04 bar \ud83d\ude04 lol");
    emojie(node[0].childNodes[0]);

    expect(node.html().split("<img ").length).toBe(3);
  });

  it("works when emoji is at the end of text node", function() {
    var node = $("<div>").text("foo \ud83d\ude04");
    emojie(node[0]);
    expect(node.html().split("<img").length).toBe(2);
  });

  it("replaces emojis in DOM tree", function() {
    var node = $("<div>").append(
      $("<span>").text("e \ud83d\ude04 moji"),
      $("<span>").text("e \ud83d\ude04 moji")
    );
    emojie(node[0]);
    expect(node.html().split("<img ").length).toBe(3)
  });

  it ("supports title attributing elements", function() {
    var node = $("<div>").text("foo \ud83d\ude04 bar");
    emojie(node[0]);
    expect(node.find("img").attr("title")).toEqual(":foo_bar:");
  });

  it ("does not require the code option to be set", function() {
    var node = $("<div>").text("foo \ud83d\ude04");
    emojie(node[0]);
    expect(node.find("img")[0].className).toBe("emojie emojie-1f604");
  });

  it ("allows setting a custom element type and content", function() {
    emojie.register("\ud83d\ude05", { elementName: "span", content: "\ud83d\ude05" });
    var node = $("<div>").text("Cool \ud83d\ude05");
    emojie(node[0]);
    expect(node.html()).toBe("Cool <span>\ud83d\ude05</span>");
  });

  it ("skips elements with data-no-emojie", function() {
    var node = $("<div data-no-emojie>").append(
      $("<span>").text("e \ud83d\ude04 moji"),
      $("<span>").text("e \ud83d\ude04 moji")
    );
    emojie(node[0]);
    expect(node.find("img").length).toBe(0);
  });

  it ("can configure ignore attribute", function() {
    var textEmoji = Emojie({ignoreAttribute: "data-no-text-emoji"});
    textEmoji.register(":foo:", { class: "emojie", src: "http://localhost/emoji/emoji.png", title: ":foo:", id: "test-id" });

    var node = $("<div data-no-text-emoji>").append(
      $("<span>").text(":foo:"),
      $("<span>").text("foo :foo: foo")
    );
    textEmoji(node[0]);
    expect(node.find("img").length).toBe(0);
  });

});
