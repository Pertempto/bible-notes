import * as vscode from "vscode";

export async function insertVerse(context: vscode.ExtensionContext) {
    const result = await vscode.window.showInputBox({
        value: "John 1:1",
        valueSelection: [0, 10],
        placeHolder: "Verse reference",
        validateInput: (text: string) => {
            vscode.window.showInformationMessage(`Validating: ${text}`);
            // TODO: check that the text is a valid reference
            return null;
        },
    });
    // TODO: insert verse into document
    vscode.window.showInformationMessage(`Got: ${result}`);
}
