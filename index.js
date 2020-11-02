const path = require("path");
const fs = require("fs");
const http = require("http");

const server = http.createServer((req, resp) => {
  let filename = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : req.url
  );
  const extname = path.extname(filename);

  let contentType = null;

  switch (extname) {
    case ".html":
      contentType = "text/html";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".js":
      contentType = "text/js";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    default:
      contentType = "text/html";
      break;
  }

  fs.readFile(filename, (err, data) => {
    if (err) {
      if (err.code == "ENOENT") {
        // not found
        fs.readFile(path.join(__dirname, "public", "404.html"), (err, data) => {
          resp.writeHead(404, { "Content-Type": "text/html" });
          resp.end(data, "utf8");
        });
      } else {
        // some server error
        resp.writeHead(500);
        resp.end(`Internal server error: ${err.code}`, "utf8");
      }
    } else {
      // success
      resp.writeHead(200, { "Content-Type": contentType });
      resp.end(data, "utf8");
    }
  });

  console.log(contentType);
  console.log(filename);
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
