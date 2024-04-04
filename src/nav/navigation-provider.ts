// This file is based off of https://github.com/foambubble/foam/blob/db7eb9775f0a94e99ea73e17b64e1360a831e99e/packages/foam-vscode/src/features/navigation-provider.ts

import {
    DefinitionProvider,
    DocumentLink,
    DocumentLinkProvider,
    ExtensionContext,
    Location,
    LocationLink,
    Position,
    ProviderResult,
    ReferenceProvider,
    TextDocument,
    languages
} from "vscode";

const mdDocSelector = [
    { language: "markdown", scheme: "file" },
    { language: "markdown", scheme: "untitled" },
];

export default async function activate(context: ExtensionContext) {
    const navigationProvider = new NavigationProvider();

    context.subscriptions.push(
        languages.registerDefinitionProvider(mdDocSelector, navigationProvider),
        languages.registerDocumentLinkProvider(
            mdDocSelector,
            navigationProvider
        ),
        languages.registerReferenceProvider(mdDocSelector, navigationProvider)
    );
}

/**
 * Provides navigation and references for Foam links.
 * - We create definintions for existing wikilinks but not placeholders
 * - We create links for both
 * - We create references for both
 *
 * Placeholders are created as links so that when clicking on them a new note will be created.
 * Definitions are automatically invoked by VS Code on hover, whereas links require
 * the user to explicitly clicking - and we want the note creation to be explicit.
 *
 * Also see https://github.com/foambubble/foam/pull/724
 */
export class NavigationProvider
    implements DefinitionProvider, DocumentLinkProvider, ReferenceProvider
{
    constructor() {}

    /**
     * Provide references for links and placeholders
     */
    public provideReferences(
        document: TextDocument,
        position: Position
    ): ProviderResult<Location[]> {
        return [];
        // const resource = this.parser.parse(
        //     fromVsCodeUri(document.uri),
        //     document.getText()
        // );
        // const targetLink: ResourceLink | undefined = resource.links.find(
        //     (link) => Range.containsPosition(link.range, position)
        // );
        // if (!targetLink) {
        //     return;
        // }

        // const uri = this.workspace.resolveLink(resource, targetLink);

        // return this.graph.getBacklinks(uri).map((connection) => {
        //     return new vscode.Location(
        //         toVsCodeUri(connection.source),
        //         toVsCodeRange(connection.link.range)
        //     );
        // });
    }

    /**
     * Create definitions for resolved links
     */
    public provideDefinition(
        document: TextDocument,
        position: Position
    ): LocationLink[] {
        return [];
        // const resource = this.parser.parse(
        //     fromVsCodeUri(document.uri),
        //     document.getText()
        // );
        // const targetLink: ResourceLink | undefined = resource.links.find(
        //     (link) => Range.containsPosition(link.range, position)
        // );
        // if (!targetLink) {
        //     return;
        // }

        // const uri = this.workspace.resolveLink(resource, targetLink);
        // if (uri.isPlaceholder()) {
        //     return;
        // }

        // const targetResource = this.workspace.get(uri);
        // const section = Resource.findSection(targetResource, uri.fragment);

        // const targetRange = section
        //     ? section.range
        //     : Range.createFromPosition(
        //           Position.create(0, 0),
        //           Position.create(0, 0)
        //       );
        // const targetSelectionRange = section
        //     ? section.range
        //     : Range.createFromPosition(targetRange.start);

        // const result: vscode.LocationLink = {
        //     originSelectionRange: new vscode.Range(
        //         targetLink.range.start.line,
        //         targetLink.range.start.character +
        //             (targetLink.type === "wikilink" ? 2 : 0),
        //         targetLink.range.end.line,
        //         targetLink.range.end.character -
        //             (targetLink.type === "wikilink" ? 2 : 0)
        //     ),
        //     targetUri: toVsCodeUri(uri.asPlain()),
        //     targetRange: toVsCodeRange(targetRange),
        //     targetSelectionRange: toVsCodeRange(targetSelectionRange),
        // };
        // return [result];
    }

    /**
     * Create links for wiki links and placeholders
     */
    public provideDocumentLinks(
        document:TextDocument
    ): DocumentLink[] {
        return [];
        // const documentUri = fromVsCodeUri(document.uri);
        // const resource = this.parser.parse(documentUri, document.getText());

        // const targets: { link: ResourceLink; target: URI }[] =
        //     resource.links.map((link) => ({
        //         link,
        //         target: this.workspace.resolveLink(resource, link),
        //     }));

        // return targets
        //     .filter((o) => o.target.isPlaceholder()) // links to resources are managed by the definition provider
        //     .map((o) => {
        //         const command = CREATE_NOTE_COMMAND.forPlaceholder(
        //             Location.forObjectWithRange(documentUri, o.link),
        //             this.workspace.defaultExtension,
        //             {
        //                 onFileExists: "open",
        //             }
        //         );

        //         const documentLink = new vscode.DocumentLink(
        //             new vscode.Range(
        //                 o.link.range.start.line,
        //                 o.link.range.start.character + 2,
        //                 o.link.range.end.line,
        //                 o.link.range.end.character - 2
        //             ),
        //             commandAsURI(command)
        //         );
        //         documentLink.tooltip = `Create note for '${o.target.path}'`;
        //         return documentLink;
        //     });
    }
}
