import { ExtensionContext, window } from "vscode";
import { translate } from "../verse-utils/translate";
import {
    bookName,
    generateReference,
    parseReference,
    parseReferenceRange,
    parseVerseId,
} from "../verse-utils/verse-utils";

export async function insertReference(context: ExtensionContext) {
    const raw = await window.showInputBox({
        value: "John 1:1",
        valueSelection: [0, 10],
        placeHolder: "Verse reference",
        validateInput: (text: string) => {
            const verseIds = parseReferenceRange(text, translate);
            return verseIds.length === 0 ? "Invalid reference" : null;
        },
    });

    if (raw === undefined) {
        return;
    }

    const verseIds = parseReferenceRange(raw, translate)!;
    if (verseIds.length === 0) {
        window.showErrorMessage(`Invalid reference: ${raw}`);
        return;
    }
    const verseInfo = parseVerseId(verseIds[0]);
    const chapter =
        bookName(verseInfo.bookId, translate).toLowerCase() +
        "/" +
        verseInfo.chapterNumber;
    let suffix =
        verseIds.length === 1
            ? ""
            : `-${parseVerseId(verseIds[verseIds.length - 1]).verseNumber}`;
    const reference = generateReference(verseInfo, translate) + suffix;

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
