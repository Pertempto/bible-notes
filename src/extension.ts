// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { insertReference } from "./commands/insert-reference";
import { insertVerse } from "./commands/insert-verse";
import { SequenceEditorProvider } from "./editors/sequence-editor";
import { extendMarkdownIt } from "./markdown/extend";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    const commands = {
        "bible-notes.insert-reference": insertReference,
        "bible-notes.insert-verse": insertVerse,
    };

    for (const [commandId, handler] of Object.entries(commands)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(commandId, () => handler(context))
        );
    }

    SequenceEditorProvider.register(context);

    return {
        extendMarkdownIt(md: any) {
            extendMarkdownIt(md, {
                languageIds: () => {
                    // TODO: what does this do?
                    return ["mermaid"];
                },
            });
            md.use(injectTheme);
            return md;
        },
    };
}

function injectTheme(md: any) {
    const render = md.renderer.render;
    md.renderer.render = function () {
        return `<span>TEST INJECTION</span>`;
    };
    return md;
}

// This method is called when your extension is deactivated
export function deactivate() {}
