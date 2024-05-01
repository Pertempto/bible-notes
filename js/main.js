const vscode = acquireVsCodeApi();

const content = document.getElementById("content");

// Handle the message inside the webview
window.addEventListener("message", (event) => {
    const message = event.data; // The JSON data our extension sent
    console.log(message);
    switch (message.command) {
        case "contentChanged":
            content.textContent = message.content;
            break;
    }
});

document.getElementById("test").onclick = () => {
    vscode.postMessage({ type: "test" });
};
