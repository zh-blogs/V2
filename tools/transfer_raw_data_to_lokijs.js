const LokiJs = require("lokijs");
const fs = require("fs");

(async () => {
  const db = new LokiJs("db/loki.json");
  await new Promise((resolve) => db.loadDatabase({}, resolve));
    
  var blogsCollection = db.getCollection("blogs") || db.addCollection("blogs", {
    unique: ["id"],
  });
  console.log(blogsCollection.count());

  const old = fs.readFileSync("db/data.json");
    
  const blogs = JSON.parse(old.toString("utf-8"));
  console.log(blogs.length);
  for (const blog of blogs) {
    blogsCollection.insert(blog);
  }
    
  db.saveDatabase();  
})();




