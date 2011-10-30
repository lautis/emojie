describe("emojie", function() {
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

  it("replaces emojis in DOM tree", function() {
    var node = $("<div>").append(
      $("<span>").text("e \ud83d\ude04 moji"),
      $("<span>").text("e \ud83d\ude04 moji")
    );
    emojie(node[0]);
    expect(node.html().split("<img ").length).toBe(3)
  });


  it("can use custom location for sprite", function() {
    var node = $("<div>").append(
      $("<span>").text("e \ud83d\ude04 moji")
    );
    emojie(node[0], "sprite.png");
    expect(node.html().indexOf("sprite.png")).toNotBe(-1)
  });

  it("can change default location of sprite", function() {
    var node = $("<div>").append(
      $("<span>").text("e \ud83d\ude04 moji")
    );
    var old = emojie.src;
    emojie.src = "/emoji-sprite.png";
    expect(node.html().indexOf("/emoji-sprite.png")).toNotBe(-1)
    emojie.src = old;
  });

});
