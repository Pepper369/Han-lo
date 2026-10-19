const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const PORT = 8000;
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".cjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split("?")[0]);
  if (reqPath === "/" || reqPath === "") reqPath = "/index.html";

  const filePath = path.join(__dirname, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      const notFoundPath = path.join(__dirname, "404.html");
      if (fs.existsSync(notFoundPath)) {
        res.end(fs.readFileSync(notFoundPath));
      } else {
        res.end("<h1>404 Not Found</h1>");
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/index.html`;
  console.log(`\n======================================================`);
  console.log(`  🌟 Hán Lộ Web Server đang chạy tại:`);
  console.log(`  👉 ${url}`);
  console.log(`======================================================\n`);
  console.log(`Nhấn Ctrl+C để dừng server khi hoàn tất học tập.\n`);

  // Tự động mở trình duyệt mặc định trên Windows
  exec(`start "" "${url}"`, () => {});
});
