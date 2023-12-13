import { ParseError, readInput } from "@repo/shared-utils";
import { Effect, Number, ReadonlyArray, String, pipe } from "effect";

// ------------------------------------------------
// Part 1
// ------------------------------------------------

/**
 * Parse the provided input text and sum the IDs of the valid games.
 */
export const sumValidGameIdsFromGameRecord =
    (availableStones: HandfulContents) => (gameData: GameData[]) =>
        pipe(gameData, filterValidGames(availableStones), totalGameIds);

/**
 * Sum the IDs of all provided games.
 */
const totalGameIds = (games: GameData[]) => {
    return games.reduce((total, game) => total + game.id, 0);
};

// ------------------------------------------------
// Part 2
// ------------------------------------------------

export const sumPowersOfMinimalStones = (gameData: GameData[]) =>
    pipe(gameData, determineMinimalStones, calculatePowers, Number.sumAll);

const determineMinimalStones = (games: GameData[]) =>
    games.map(determineMinimalStonesForGame);

const determineMinimalStonesForGame = (game: GameData): HandfulContents => ({
    red: determineMinimalStonesForColor(game, "red"),
    green: determineMinimalStonesForColor(game, "green"),
    blue: determineMinimalStonesForColor(game, "blue"),
});

const determineMinimalStonesForColor = (
    game: GameData,
    color: keyof HandfulContents,
) =>
    pipe(
        game.handfuls,
        ReadonlyArray.map((handful) => handful[color]),
        (counts) => Math.max(...counts),
    );

const calculatePowers = (minimumsForGames: HandfulContents[]) =>
    minimumsForGames.map((m) => m.red * m.green * m.blue);

// ------------------------------------------------
// Shared
// ------------------------------------------------

export interface GameData {
    id: number;
    handfuls: HandfulContents[];
}

interface HandfulContents {
    red: number;
    green: number;
    blue: number;
}

export const readInputAndParse = () =>
    pipe(readInput(), Effect.flatMap(parseFileContents));

export const parseFileContents = (fileContents: string) =>
    pipe(
        // Split the file into lines
        fileContents,
        String.split("\n"),
        ReadonlyArray.map((line) => line.trim()),
        ReadonlyArray.filter((line) => line !== ""),

        // Parse each line into a game
        ReadonlyArray.map(parseGame),
        Effect.all,
    );

/**
 * Parse a single game from a line of text.
 */
const parseGame = (game: string) =>
    pipe(
        Effect.succeed(game.split(": ")),

        // Ensure both Game ID and Game Data are present
        Effect.filterOrElse(
            (input): input is [string, string] =>
                input[0] !== undefined && input[1] !== undefined,
            () =>
                Effect.fail(
                    new ParseError(
                        `Could not identify id and handful pieces from:\n${game}`,
                    ),
                ),
        ),

        // Parse the individual pieces
        Effect.flatMap(([idString, handfulStrings]) =>
            Effect.all([parseGameId(idString), parseHandfuls(handfulStrings)]),
        ),

        // Combine the pieces into a GameData object and add the totals
        Effect.map(([id, handfuls]) => ({ id, handfuls })),
    );

/**
 * Parse a game ID from a string that looks like `Game 01`.
 */
const parseGameId = (idString: string) =>
    Effect.try({
        try: () => {
            const numbersOnly = idString.replace(/[^0-9]/g, "");
            return parseInt(numbersOnly);
        },
        catch: () => new ParseError(`Invalid game ID string`),
    });

/**
 * Parse all handfuls from a string that looks like `3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green`.
 */
const parseHandfuls = (handfulStrings: string) => {
    const handfuls = handfulStrings.split("; ").map(parseHandful);
    return Effect.all(handfuls);
};

const COLOR_REGEX = /(\d+) (red|blue|green)/;

/**
 * Parse a handful from a string that looks like `3 blue, 1 red, 2 green`.
 */
const parseHandful = (handfulString: string) => {
    const stones = handfulString.split(", ");

    const handful: HandfulContents = {
        red: 0,
        green: 0,
        blue: 0,
    };

    for (const stone of stones) {
        const match = stone.match(COLOR_REGEX);

        if (match === null) {
            return Effect.fail(new ParseError(`Invalid stone: ${stone}`));
        }

        const count = parseInt(match[1] || "0");
        const color = match[2] as keyof HandfulContents;

        handful[color] = count;
    }

    return Effect.succeed(handful);
};

/**
 * Filter out games that have more stones than are available.
 */
const filterValidGames =
    (availableStones: HandfulContents) => (games: GameData[]) => {
        return games.filter(isValidGame(availableStones));
    };

const isValidGame = (availableStones: HandfulContents) => (game: GameData) =>
    game.handfuls.every(
        (h) =>
            h.red <= availableStones.red &&
            h.green <= availableStones.green &&
            h.blue <= availableStones.blue,
    );
