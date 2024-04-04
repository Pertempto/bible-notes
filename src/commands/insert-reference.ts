import { ExtensionContext, window } from "vscode";
import { translate } from "../verse-utils/translate";
import {
    bookName,
    generateReference,
    parseReference,
    parseVerseId,
} from "../verse-utils/verse-utils";

export async function insertReference(context: ExtensionContext) {
    const raw = await window.showInputBox({
        value: "John 1:1",
        valueSelection: [0, 10],
        placeHolder: "Verse reference",
        validateInput: (text: string) => {
            const reference = parseReference(text, translate);
            window.showInformationMessage(`REF: ${reference}`);
            return reference === null ? "Invalid reference" : null;
        },
    });

    if (raw === undefined) {
        return;
    }

    const verseId = parseReference(raw, translate)!;
    const verseInfo = parseVerseId(verseId);
    const chapter =
        bookName(verseInfo.bookId, translate).toLowerCase() + "/" + verseInfo.chapterNumber;
    const reference = generateReference(verseInfo, translate);

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
