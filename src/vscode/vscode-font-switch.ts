import { $ } from "bun";

const defaultFonts = ["'Droid Sans Mono'", "'monospace'", "monospace"] as const;
const fonts = [
	"Adwaita Mono",
	"Cascadia Code",
	"Fira Code",
	"JetBrains Mono",
	"Monoid",
	"Noto Mono",
	"Ubuntu Mono",
	...defaultFonts,
] as const;

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

type FontWeight = number | "normal";

const genDefaultConfigForFont = (font: Font): FontConfig =>
	genConfigForFont(font, 14, "normal");

const genConfigForFont = (font: Font, size: number, weight: FontWeight) => ({
	"debug.console.fontFamily": font,
	"editor.codeLensFontFamily": font,
	"editor.fontFamily": getEditorFontFamilyForFont(font),
	"editor.fontSize": size,
	"editor.fontWeight": `${weight}`,
	"terminal.integrated.fontSize": size,
	"terminal.integrated.fontWeight": `${weight}`,
	"terminal.integrated.fontWeightBold": genFontWeightBold(weight),
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

const genFontWeightBold = (normalWeight: FontWeight) =>
	typeof normalWeight === "number"
		? `${Math.min(normalWeight + 100, 1000)}`
		: normalWeight;

const addToFontMap = (
	fontMap: Map<Font, FontConfig>,
	font: Font,
	size: number,
	weight: FontWeight,
) => {
	fontMap.set(font, genConfigForFont(font, size, weight));
};

const font = (process.argv.at(2) ?? ("Cascadia Code" satisfies Font)) as Font;

if (!fonts.includes(font)) {
	throw Error(
		`Font '${font}' not valid. Valid fonts are: ${fonts.join(", ")}.`,
	);
}

const fontMap = new Map<Font, FontConfig>();

addToFontMap(fontMap, "Adwaita Mono", 15, 600);
addToFontMap(fontMap, "Cascadia Code", 15, 600);
addToFontMap(fontMap, "Fira Code", 14, 600);
addToFontMap(fontMap, "JetBrains Mono", 14, 700);
addToFontMap(fontMap, "Monoid", 14, 600);
addToFontMap(fontMap, "Noto Mono", 14, 700);
addToFontMap(fontMap, "Ubuntu Mono", 17, 700);

const path = process.argv.at(3) ?? "~/.config/Code/User/settings.json";

const config = fontMap.has(font)
	? fontMap.get(font)
	: genDefaultConfigForFont(font);

let settings: Record<PropertyKey, unknown> = await $`cat ${path}`.json();

settings = { ...settings, ...config };
await $`echo ${JSON.stringify(settings, null, 2)} > ${path}`;

settings = JSON.parse(await $`jq --sort-keys '.' ${path}`.text());
await $`echo ${JSON.stringify(settings, null, 2)} > ${path}`;

await $`prettier ${path} --write`.quiet();
