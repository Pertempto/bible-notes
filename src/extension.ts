// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { insertVerse } from "./insert-verse";
import { insertReference } from "./insert-reference";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const commands = {
        "bible-notes.insert-reference": insertReference,
        "bible-notes.insert-verse": insertVerse,
    };

    for (const [commandId, handler] of Object.entries(commands)) {
        context.subscriptions.push(
            vscode.commands.registerCommand(commandId, () => handler(context))
        );
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}
