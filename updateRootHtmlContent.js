const fs = require("fs");
const path = require("path");
// Get the current directory
const rootDir = process.cwd();
// Read all items in the directory
const items = fs.readdirSync(rootDir, { withFileTypes: true });
// Filter only directories
const folders = items.filter((item) => item.isDirectory());
// Map folders to desired array of objects
const folderArray = folders
  .map((folder) => {
    const name = folder.name;
    const firstThree = name.substring(0, 3);
    return { name, firstThree };
  })
  .filter((item) => /^\d{3}$/.test(item.firstThree)) // keep only if first 3 chars are digits
  .map((item) => ({
    // tabButtonText: item.firstThree,
    tabButtonText: item.name,
    iframeSrc: `./${item.name}/index.html`,
  }));
// Output the result
fs.writeFileSync("content.json", JSON.stringify(folderArray, null, 2));
