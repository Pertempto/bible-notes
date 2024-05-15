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
        const fs = workspace.fs;
        const pathToHtml = Uri.file(
            path.join(
                this.context.extensionPath,
                "editor-content",
                "sequence",
                "main.html"
            )
        );

        webviewPanel.webview.options = { enableScripts: true };

        fs.readFile(pathToHtml).then((data) => {
            webviewPanel.webview.html = data.toString();
        });

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
                    updateContent("You pressed test");
                    break;
                case "listFiles":
                    const uris = workspace.textDocuments.map((t) =>
                        t.uri.toString()
                    );
                    webviewPanel.webview.postMessage({
                        command: "uris",
                        uris,
                    });
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
