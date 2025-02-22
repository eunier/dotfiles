import { $ } from "bun";

const genDefaultConfigForFont = (font: Font): FontConfig => ({
	"debug.console.fontFamily": font,
	"editor.codeLensFontFamily": font,
	"editor.fontFamily": getEditorFontFamilyForFont(font),
	"editor.fontSize": 14,
	"editor.fontWeight": "normal",
	"terminal.integrated.fontSize": 14,
	"terminal.integrated.fontWeight": "normal",
	"terminal.integrated.fontWeightBold": "bold",
});

const getEditorFontFamilyForFont = (font: Font) => {
	let fontFamily = font;

	for (const fontItem of fonts) {
		if (fontItem !== font) {
			fontFamily = `${fontFamily}, ${fontItem}` as Font;
		}
	}

	return fontFamily;
};

const genFontWeightBold = (normalWeight: number) =>
	`${Math.min(normalWeight + 100, 1000)}`;

const font = (process.argv.at(2) ?? ("Cascadia Code" satisfies Font)) as Font;

const defaultFonts = ["'Droid Sans Mono'", "'monospace'", "monospace"] as const;
const fonts = ["Cascadia Code", ...defaultFonts] as const;

type Font = (typeof fonts)[number];

interface FontConfig {
	"debug.console.fontFamily": Font;
	"editor.codeLensFontFamily": Font;
	"editor.fontFamily": string;
	"editor.fontSize": number;
	"editor.fontWeight": string;
	"terminal.integrated.fontSize": number;
	"terminal.integrated.fontWeight": string;
	"terminal.integrated.fontWeightBold": string;
}

const fontMap = new Map<Font, FontConfig>();

fontMap.set("Cascadia Code", {
	"debug.console.fontFamily": "Cascadia Code",
	"editor.codeLensFontFamily": "Cascadia Code",
	"editor.fontFamily": getEditorFontFamilyForFont(font),
	"editor.fontSize": 14,
	"editor.fontWeight": "600",
	"terminal.integrated.fontSize": 14,
	"terminal.integrated.fontWeight": "600",
	"terminal.integrated.fontWeightBold": genFontWeightBold(600),
});

const path = "~/.config/Code/User/settings.json";

const config = fontMap.has(font)
	? fontMap.get(font)
	: genDefaultConfigForFont(font);

let settings: object = await $`cat ${path}`.json();

settings = { ...settings, ...config };
await $`echo ${JSON.stringify(settings, null, 2)} > ${path}`;

settings = JSON.parse(await $`jq --sort-keys '.' ${path}`.text());
await $`echo ${JSON.stringify(settings, null, 2)} > ${path}`;

await $`prettier ${path} --write`.quiet();
