const fs = require('fs');
const os = require('os');
const path = require('path');

// Define the path to the snapCode folder in the home directory
const snapCodeFolderPath = path.join(os.homedir(), 'snapCode');

// Check if the folder exists when the app starts up
function checkSnapCodeFolder() {
    if (!fs.existsSync(snapCodeFolderPath)) {
        fs.mkdirSync(snapCodeFolderPath);
    }
}

module.exports = {
    snapCodeFolderPath,
    checkSnapCodeFolder
}