import { window, ExtensionContext } from "vscode";

export async function insertVerse(context: ExtensionContext) {
    const result = await window.showInputBox({
        value: "John 1:1",
        valueSelection: [0, 10],
        placeHolder: "Verse reference",
        validateInput: (text: string) => {
            // TODO: check that the text is a valid reference
            // window.showInformationMessage(`Validating: ${text}`);
            return null;
        },
    });

    const editor = window.activeTextEditor;
    if (editor !== undefined) {
        // TODO: get the contents of the verse
        const verseContents = result + '\n';
        editor.edit((editBuilder) =>
            editBuilder.insert(editor.selection.active, verseContents)
        );
    } else {
        window.showInformationMessage('No editor open to receive verse!');
    }
}
