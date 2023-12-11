import { Number, ReadonlyArray, String, pipe } from "effect";

// ------------------------------------------------
// Part 1
// ------------------------------------------------

/**
 * Parse the provided input text and sum the IDs of the valid games.
 */
export const findAndSumPartNumbers = (input: string) =>
    pipe(
        input,
        readLines,
        findValidPartNumbers,
        ReadonlyArray.map((partNumber) => partNumber.number),
        Number.sumAll,
    );

const PART_NUMBER_REGEX = /\d+/g;

const findValidPartNumbers = (lines: string[]) =>
    pipe(lines, findAllPartNumbers, filterValidPartNumbers(lines));

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
// Part 2
// ------------------------------------------------

export const findAndSumGearRatios = (input: string) =>
    pipe(input, readLines, (lines) =>
        pipe(
            findAllPartNumbers(lines),
            findValidGears(lines),
            ReadonlyArray.map((gear) => gear.ratio),
            Number.sumAll,
        ),
    );

const findValidGears = (lines: string[]) => (partNumbers: PartNumber[]) =>
    pipe(
        findAllGears(lines),
        ReadonlyArray.map(addGearRatios(partNumbers)),
        ReadonlyArray.filter((gear) => gear.ratio > 0),
    );

const findAllGears = (lines: string[]) => {
    const gears: Gear[] = [];

    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];

        if (line === undefined) {
            continue;
        }

        for (let x = 0; x < line.length; x++) {
            const char = line[x];

            if (char === "*") {
                gears.push({ x, y });
            }
        }
    }

    return gears;
};

const addGearRatios = (partNumbers: PartNumber[]) => (gear: Gear) => {
    const adjacentPartNumbers = findAdjacentPartNumbers(partNumbers, gear);

    if (adjacentPartNumbers.length < 2) {
        return { ...gear, ratio: 0 };
    }

    const ratio = pipe(
        adjacentPartNumbers,
        ReadonlyArray.map((partNumber) => partNumber.number),
        Number.multiplyAll,
    );

    return {
        ...gear,
        ratio,
    };
};

const findAdjacentPartNumbers = (partNumbers: PartNumber[], gear: Gear) =>
    partNumbers.filter((partNumber) => {
        const numberLength = partNumber.number.toString().length;

        return (
            partNumber.x <= gear.x + 1 &&
            partNumber.x + numberLength >= gear.x &&
            partNumber.y <= gear.y + 1 &&
            partNumber.y >= gear.y - 1
        );
    });

// ------------------------------------------------
// Shared
// ------------------------------------------------

const readLines = (input: string): string[] =>
    pipe(
        input,
        String.split("\n"),
        ReadonlyArray.map((line) => line.trim()),
        ReadonlyArray.filter((line) => line !== ""),
    );

const findAllPartNumbers = (lines: string[]) =>
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

interface PartNumber {
    number: number;
    x: number;
    y: number;
}

interface Gear {
    x: number;
    y: number;
}
