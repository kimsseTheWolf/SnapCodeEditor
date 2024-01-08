
window.ipcRenderer.on("output", (event, data) => {
    document.getElementById("output").textContent += (data + "\n");
})

document.getElementById("input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        window.ipcRenderer.send("input", document.getElementById("input").value);
        document.getElementById("input").value = "";
    }
})
