def json_str(hex)
  if hex.to_i(16) >= 0x10000 && hex.to_i(16) <= 0x10FFFF
    surrogates(hex)
  else
    "\\u#{hex}"
  end
end

def surrogates(hex)
  h = (hex.to_i(16) - 0x10000)/0x400 + 0xD800
  l = (hex.to_i(16) - 0x10000)% 0x400 + 0xDC00
  "\\u#{h.to_s(16)}\\u#{l.to_s(16)}"
end


task :iphone do
  File.open("emojie-iphone.js","w") do |f|
    f.write("emojie = Emojie();\n")
    Dir["assets/iphone/*.png"].map do |filename|
      mapping = filename.split("/").last
      f.write("emojie.register(\"" + mapping.split(".").first.split("-").map do |d|
        json_str(d)
      end.join("") + "\", \"#{mapping}\");\n")
    end
  end
end
