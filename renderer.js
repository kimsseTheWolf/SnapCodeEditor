// renderer.js
let editor;
let currentFilePath;
let client;
let isSaved = false;

const defaultTheme = {
    base: "vs-dark",
    inherit: true,
    rules: [
        {
            "background": "24292e",
            "token": ""
        },
        {
            "foreground": "959da5",
            "token": "comment"
        },
        {
            "foreground": "959da5",
            "token": "punctuation.definition.comment"
        },
        {
            "foreground": "959da5",
            "token": "string.comment"
        },
        {
            "foreground": "c8e1ff",
            "token": "constant"
        },
        {
            "foreground": "c8e1ff",
            "token": "entity.name.constant"
        },
        {
            "foreground": "c8e1ff",
            "token": "variable.other.constant"
        },
        {
            "foreground": "c8e1ff",
            "token": "variable.language"
        },
        {
            "foreground": "b392f0",
            "token": "entity"
        },
        {
            "foreground": "b392f0",
            "token": "entity.name"
        },
        {
            "foreground": "f6f899",
            "token": "variable.parameter.function"
        },
        {
            "foreground": "7bcc72",
            "token": "entity.name.tag"
        },
        {
            "foreground": "ea4a5a",
            "token": "keyword"
        },
        {
            "foreground": "ea4a5a",
            "token": "storage"
        },
        {
            "foreground": "ea4a5a",
            "token": "storage.type"
        },
        {
            "foreground": "f6f8fa",
            "token": "storage.modifier.package"
        },
        {
            "foreground": "f6f8fa",
            "token": "storage.modifier.import"
        },
        {
            "foreground": "f6f8fa",
            "token": "storage.type.java"
        },
        {
            "foreground": "79b8ff",
            "token": "string"
        },
        {
            "foreground": "79b8ff",
            "token": "punctuation.definition.string"
        },
        {
            "foreground": "79b8ff",
            "token": "string punctuation.section.embedded source"
        },
        {
            "foreground": "c8e1ff",
            "token": "support"
        },
        {
            "foreground": "c8e1ff",
            "token": "meta.property-name"
        },
        {
            "foreground": "fb8532",
            "token": "variable"
        },
        {
            "foreground": "f6f8fa",
            "token": "variable.other"
        },
        {
            "foreground": "d73a49",
            "fontStyle": "bold italic underline",
            "token": "invalid.broken"
        },
        {
            "foreground": "d73a49",
            "fontStyle": "bold italic underline",
            "token": "invalid.deprecated"
        },
        {
            "foreground": "fafbfc",
            "background": "d73a49",
            "fontStyle": "italic underline",
            "token": "invalid.illegal"
        },
        {
            "foreground": "fafbfc",
            "background": "d73a49",
            "fontStyle": "italic underline",
            "token": "carriage-return"
        },
        {
            "foreground": "d73a49",
            "fontStyle": "bold italic underline",
            "token": "invalid.unimplemented"
        },
        {
            "foreground": "d73a49",
            "token": "message.error"
        },
        {
            "foreground": "f6f8fa",
            "token": "string source"
        },
        {
            "foreground": "c8e1ff",
            "token": "string variable"
        },
        {
            "foreground": "79b8ff",
            "token": "source.regexp"
        },
        {
            "foreground": "79b8ff",
            "token": "string.regexp"
        },
        {
            "foreground": "79b8ff",
            "token": "string.regexp.character-class"
        },
        {
            "foreground": "79b8ff",
            "token": "string.regexp constant.character.escape"
        },
        {
            "foreground": "79b8ff",
            "token": "string.regexp source.ruby.embedded"
        },
        {
            "foreground": "79b8ff",
            "token": "string.regexp string.regexp.arbitrary-repitition"
        },
        {
            "foreground": "7bcc72",
            "fontStyle": "bold",
            "token": "string.regexp constant.character.escape"
        },
        {
            "foreground": "c8e1ff",
            "token": "support.constant"
        },
        {
            "foreground": "c8e1ff",
            "token": "support.variable"
        },
        {
            "foreground": "c8e1ff",
            "token": "meta.module-reference"
        },
        {
            "foreground": "fb8532",
            "token": "markup.list"
        },
        {
            "foreground": "0366d6",
            "fontStyle": "bold",
            "token": "markup.heading"
        },
        {
            "foreground": "0366d6",
            "fontStyle": "bold",
            "token": "markup.heading entity.name"
        },
        {
            "foreground": "c8e1ff",
            "token": "markup.quote"
        },
        {
            "foreground": "f6f8fa",
            "fontStyle": "italic",
            "token": "markup.italic"
        },
        {
            "foreground": "f6f8fa",
            "fontStyle": "bold",
            "token": "markup.bold"
        },
        {
            "foreground": "c8e1ff",
            "token": "markup.raw"
        },
        {
            "foreground": "b31d28",
            "background": "ffeef0",
            "token": "markup.deleted"
        },
        {
            "foreground": "b31d28",
            "background": "ffeef0",
            "token": "meta.diff.header.from-file"
        },
        {
            "foreground": "b31d28",
            "background": "ffeef0",
            "token": "punctuation.definition.deleted"
        },
        {
            "foreground": "176f2c",
            "background": "f0fff4",
            "token": "markup.inserted"
        },
        {
            "foreground": "176f2c",
            "background": "f0fff4",
            "token": "meta.diff.header.to-file"
        },
        {
            "foreground": "176f2c",
            "background": "f0fff4",
            "token": "punctuation.definition.inserted"
        },
        {
            "foreground": "b08800",
            "background": "fffdef",
            "token": "markup.changed"
        },
        {
            "foreground": "b08800",
            "background": "fffdef",
            "token": "punctuation.definition.changed"
        },
        {
            "foreground": "2f363d",
            "background": "959da5",
            "token": "markup.ignored"
        },
        {
            "foreground": "2f363d",
            "background": "959da5",
            "token": "markup.untracked"
        },
        {
            "foreground": "b392f0",
            "fontStyle": "bold",
            "token": "meta.diff.range"
        },
        {
            "foreground": "c8e1ff",
            "token": "meta.diff.header"
        },
        {
            "foreground": "0366d6",
            "fontStyle": "bold",
            "token": "meta.separator"
        },
        {
            "foreground": "0366d6",
            "token": "meta.output"
        },
        {
            "foreground": "ffeef0",
            "token": "brackethighlighter.tag"
        },
        {
            "foreground": "ffeef0",
            "token": "brackethighlighter.curly"
        },
        {
            "foreground": "ffeef0",
            "token": "brackethighlighter.round"
        },
        {
            "foreground": "ffeef0",
            "token": "brackethighlighter.square"
        },
        {
            "foreground": "ffeef0",
            "token": "brackethighlighter.angle"
        },
        {
            "foreground": "ffeef0",
            "token": "brackethighlighter.quote"
        },
        {
            "foreground": "d73a49",
            "token": "brackethighlighter.unmatched"
        },
        {
            "foreground": "d73a49",
            "token": "sublimelinter.mark.error"
        },
        {
            "foreground": "fb8532",
            "token": "sublimelinter.mark.warning"
        },
        {
            "foreground": "6a737d",
            "token": "sublimelinter.gutter-mark"
        },
        {
            "foreground": "79b8ff",
            "fontStyle": "underline",
            "token": "constant.other.reference.link"
        },
        {
            "foreground": "79b8ff",
            "fontStyle": "underline",
            "token": "string.other.link"
        }
    ],
    colors: {
        "editor.foreground": "#f6f8fa",
        "editor.background": "#24292e",
        "editor.selectionBackground": "#4c2889",
        "editor.inactiveSelectionBackground": "#444d56",
        "editor.lineHighlightBackground": "#444d56",
        "editorCursor.foreground": "#ffffff",
        "editorWhitespace.foreground": "#6a737d",
        "editorIndentGuide.background": "#6a737d",
        "editorIndentGuide.activeBackground": "#f6f8fa",
        "editor.selectionHighlightBorder": "#444d56"
    }
}

require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], function() {
    monaco.editor.defineTheme('currentTheme', defaultTheme);
    editor = monaco.editor.create(document.getElementById('container'), {
        value: '',
        language: 'javascript',
        theme: 'currentTheme',
    });

    editor.onDidChangeCursorPosition(function (e) {
        // Get the current position
        let position = editor.getPosition();

        // Update the cursor position display
        document.getElementById('cursorPosition').textContent = 'Row: ' + position.lineNumber + ', Column: ' + position.column;
    });
    
    editor.onDidChangeModelContent(function (e) {
        // The user has made changes to the file, so it's not saved
        isSaved = false;

        // Update the save status display
        document.getElementById('saveStatus').textContent = 'Unsaved changes';
    });

    // Add event listener for language selection
    document.getElementById('language').addEventListener('change', function () {
        monaco.editor.setModelLanguage(editor.getModel(), this.value);
    });

    window.ipcRenderer.on('file-opened', (event, filePath, content, fileName) => {
        currentFilePath = filePath;
        editor.setValue(content);
        document.getElementById("pathDisplay").innerText = fileName;
    });

    window.ipcRenderer.on('file-saved', (event, filePath, fileName) => {
        console.log("file-saved");
        currentFilePath = filePath;
        document.getElementById("pathDisplay").innerText = fileName;

        // The file has been saved
        isSaved = true;

        // Update the save status display
        document.getElementById('saveStatus').textContent = 'Saved';
    });

    window.ipcRenderer.on('file-renamed', (event, filePath, fileName) => {
        currentFilePath = filePath;
        document.getElementById("pathDisplay").innerText = fileName;
    });
});

function openFile() {
    window.ipcRenderer.send('open-file');
}

function saveFile() {
    window.ipcRenderer.send('save-file', currentFilePath, editor.getValue());
}

function createNewFile() {
    if (!isSaved) {
        let response = confirm('You have unsaved changes. Are you sure you want to create a new file?');
        if (!response) {
            return;
        }
    }
    // Clear the editor
    // editor.setValue('');

    // Reset the current file path
    currentFilePath = undefined;
    document.getElementById("pathDisplay").innerText = currentFilePath;

    // Set the file to unsaved
    isSaved = false;
    document.getElementById('saveStatus').textContent = 'Unsaved changes';

    editor.focus();
    console.log("done");
}

function renameFile() {
    if (currentFilePath !== undefined) {
        window.ipcRenderer.send('rename-file', currentFilePath);
    }
}

async function handleRenameFile() {
    const filePath = await dialog.showSaveDialog(mainWindow, {});
    console.log(filePath);
}


document.getElementById("pathDisplay").innerText = currentFilePath;
document.getElementById('openFileButton').addEventListener('click', openFile);
document.getElementById('newFileButton').addEventListener('click', createNewFile);
document.getElementById('saveFileButton').addEventListener('click', saveFile);
document.getElementById('renameFileButton').addEventListener('click', renameFile);

window.addEventListener('resize', function () {
    editor.layout();
});
window.addEventListener('keydown', function (e) {
    // Check if the key combination Ctrl+S or Command+S was pressed
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        // Prevent the browser's default save dialog from showing up
        e.preventDefault();

        // Call your save function
        saveFile();
    }
});

window.addEventListener('keydown', function (e) {
    // Check if the key combination Ctrl+R or Command+R was pressed
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        // Prevent the browser's default refresh action from being triggered
        e.preventDefault();
    }
});