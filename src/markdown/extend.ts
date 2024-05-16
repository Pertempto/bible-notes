import * as mdItContainer from "markdown-it-container";

const pluginKeyword = "mermaid";
const tokenTypeInline = "inline";
const ttContainerOpen = "container_" + pluginKeyword + "_open";
const ttContainerClose = "container_" + pluginKeyword + "_close";

export function extendMarkdownIt(
    md: any,
    config: { languageIds(): readonly string[] }
) {
    console.log('EXTEND');
    md.use(mdItContainer, pluginKeyword, {
        anyClass: true,
        validate: (info: string) => {
            return info.trim() === pluginKeyword;
        },

        render: (tokens: any[], idx: number) => {
            console.log('TOKENS', tokens);
            const token = tokens[idx];

            var src = "";
            if (token.type === ttContainerOpen) {
                for (var i = idx + 1; i < tokens.length; i++) {
                    const value = tokens[i];
                    if (
                        value === undefined ||
                        value.type === ttContainerClose
                    ) {
                        break;
                    }
                    src += value.content;
                    if (value.block && value.nesting <= 0) {
                        src += "\n";
                    }
                    // Clear these out so markdown-it doesn't try to render them
                    value.tag = "";
                    value.type = tokenTypeInline;
                    // Code can be triggered multiple times, even if tokens are not updated (eg. on editor losing and regaining focus). Content must be preserved, so src can be realculated in such instances.
                    //value.content = '';
                    value.children = [];
                }
            }

            if (token.nesting === 1) {
                return `<div class="${pluginKeyword}">${preProcess(src)}`;
            } else {
                return "</div>";
            }
        },
    });

    const highlight = md.options.highlight;
    md.options.highlight = (code: string, lang: string) => {
        const reg = new RegExp(
            "\\b(" + config.languageIds().map(escapeRegExp).join("|") + ")\\b",
            "i"
        );
        if (lang && reg.test(lang)) {
            return `<pre style="all:unset;"><div class="${pluginKeyword}">${preProcess(
                code
            )}</div></pre>`;
        }
        return highlight(code, lang);
    };
    return md;
}

function preProcess(source: string): string {
    return source
        .replace(/\</g, "&lt;")
        .replace(/\>/g, "&gt;")
        .replace(/\n+$/, "")
        .trimStart();
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
