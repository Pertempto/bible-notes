import { window, ExtensionContext } from "vscode";

export async function insertReference(context: ExtensionContext) {
    const reference = await window.showInputBox({
        value: "John 1:1",
        valueSelection: [0, 10],
        placeHolder: "Verse reference",
        validateInput: (text: string) => {
            // TODO: check that the text is a valid reference
            // window.showInformationMessage(`Validating: ${text}`);
            return null;
        },
    });

    if (reference === undefined) {
        return;
    }

    const chapter = reference.split(":")[0];

    const editor = window.activeTextEditor;
    if (editor !== undefined) {
        const link = `[[${chapter}|${reference}]]`;
        editor.edit((editBuilder) =>
            editBuilder.insert(editor.selection.active, link)
        );
    } else {
        window.showInformationMessage("No editor open to receive reference!");
    }
}
