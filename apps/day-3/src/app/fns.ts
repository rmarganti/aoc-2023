import { Number, ReadonlyArray, String, pipe } from "effect";

// ------------------------------------------------
// Day 1
// ------------------------------------------------

/**
 * Parse the provided input text and sum the IDs of the valid games.
 */
export const findAndSumPartNumbers = (input: string) =>
    pipe(input, readLines, findPartNumbers);

const readLines = (input: string): string[] =>
    pipe(
        input,
        String.split("\n"),
        ReadonlyArray.map((line) => line.trim()),
        ReadonlyArray.filter((line) => line !== ""),
    );

const PART_NUMBER_REGEX = /\d+/g;

const findPartNumbers = (lines: string[]) =>
    pipe(
        lines,
        findAllNumbers,
        filterValidPartNumbers(lines),
        ReadonlyArray.map((partNumber) => partNumber.number),
        Number.sumAll,
    );

const findAllNumbers = (lines: string[]) =>
    lines.reduce<PartNumber[]>((carrier, line, lineIdx) => {
        const matches = line.matchAll(PART_NUMBER_REGEX);
        const lineMatches: PartNumber[] = [];

        for (const match of matches) {
            lineMatches.push({
                number: +match[0],
                x: match.index as number,
                y: lineIdx,
            });
        }
        return [...carrier, ...lineMatches];
    }, []);

const filterValidPartNumbers = (lines: string[]) => (numbers: PartNumber[]) =>
    ReadonlyArray.filter(numbers, isValidPartNumber(lines));

const isValidPartNumber = (lines: string[]) => (partNumber: PartNumber) => {
    const lineLength = (lines[0] || "").length;
    const numberLength = partNumber.number.toString().length;
    const minX = Math.max(0, partNumber.x - 1);
    const maxX = Math.min(lineLength - 1, partNumber.x + numberLength);

    const minY = Math.max(0, partNumber.y - 1);
    const maxY = Math.min(lines.length - 1, partNumber.y + 1);

    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const line = lines[y];
            const char = line ? line[x] : undefined;

            if (isSymbol(char)) {
                return true;
            }
        }
    }

    return false;
};

const INVALID_CHARS = [
    undefined,
    ".",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
];

const isSymbol = (char: string | undefined) => {
    return !INVALID_CHARS.includes(char);
};

// ------------------------------------------------
// Day 2
// ------------------------------------------------

export const findAndSumGearRatios = (input: string) => pipe(input, (a) => a);

// ------------------------------------------------
// Shared
// ------------------------------------------------

interface PartNumber {
    number: number;
    x: number;
    y: number;
}
