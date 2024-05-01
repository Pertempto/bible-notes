import {
    CancellationToken,
    CustomTextEditorProvider,
    Disposable,
    ExtensionContext,
    TextDocument,
    Uri,
    WebviewPanel,
    window,
    workspace,
} from "vscode";
import path from "path";

export class SequenceEditorProvider implements CustomTextEditorProvider {
    public static register(context: ExtensionContext): Disposable {
        const provider = new SequenceEditorProvider(context);
        const providerRegistration = window.registerCustomEditorProvider(
            SequenceEditorProvider.viewType,
            provider
        );
        return providerRegistration;
    }

    private static readonly viewType = "bible-notes.sequence";

    constructor(private readonly context: ExtensionContext) {}

    public async resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
        _token: CancellationToken
    ): Promise<void> {
        const cssURI = webviewPanel.webview.asWebviewUri(
            Uri.file(path.join(this.context.extensionPath, "css", "style.css"))
        );
        const jsURI = webviewPanel.webview.asWebviewUri(
            Uri.file(path.join(this.context.extensionPath, "js", "main.js"))
        );
        console.log(jsURI);
        window.showInformationMessage(this.context.extensionPath);

        webviewPanel.webview.options = { enableScripts: true };
        webviewPanel.webview.html = getWebviewContent(cssURI, jsURI);

        const updateContent = (content: string) =>
            webviewPanel.webview.postMessage({
                command: "contentChanged",
                content,
            });

        updateContent(document.getText());

        webviewPanel.webview.onDidReceiveMessage((message) => {
            console.log("MESSAGE:", message);
            switch (message.type) {
                case "test":
                    // TODO: something
                    break;
            }
        });

        workspace.onDidChangeTextDocument((event) => {
            if (event.document.uri.toString() !== document.uri.toString()) {
                return;
            }
            updateContent(event.document.getText());
        });
    }
}

function getWebviewContent(cssURI: Uri, jsURI: Uri) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel='stylesheet' href='${cssURI.toString()}' />
    <title>Example Webview</title>
  </head>
  <body>
    <h1>This works!</h1>
    <pre id="content">CONTENT</pre>
    <button id="test">Test</button>
    <script src='${jsURI.toString()}'></script>
  </body>
</html>`;
}
