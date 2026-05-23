const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "dist");
const filesToCopy = ["index.html", "styles.css", "app.js"];

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

for (const file of filesToCopy) {
  fs.copyFileSync(path.join(__dirname, file), path.join(distDir, file));
}

console.log("RoleRadar static site built in dist/");
