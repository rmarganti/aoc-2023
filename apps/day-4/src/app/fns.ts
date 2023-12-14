import { ParseError, inputToLines } from "@repo/shared-utils";
import { Effect, Number, ReadonlyArray, pipe } from "effect";

// ------------------------------------------------
// Part 1
// ------------------------------------------------

/**
 * Parse the provided input text and sum the IDs of the valid games.
 */
export const parseAndSumCardPoints = (input: string) =>
    pipe(
        parseCards(input),
        Effect.map(ReadonlyArray.map((card) => card.points)),
        Effect.map(Number.sumAll),
    );

// ------------------------------------------------
// Part 2
// ------------------------------------------------

export const parseAndCountCards = (input: string) =>
    pipe(
        parseCards(input),
        Effect.map((cards) =>
            ReadonlyArray.flatMap(cards, (card) => makeCopies(card, cards)),
        ),
        Effect.map(ReadonlyArray.length),
    );

const makeCopies = (
    card: CardWithPoints,
    cards: ReadonlyArray<CardWithPoints>,
): CardWithPoints[] =>
    pipe(
        {
            cardIndex: findCardIndex(card, cards),
            matchCount: countMatches(card),
        },
        ({ cardIndex, matchCount }) =>
            cards.slice(cardIndex + 1, cardIndex + 1 + matchCount),
        (matches) =>
            ReadonlyArray.flatMap(matches, (card) => makeCopies(card, cards)),
        (recursiveMatches) => [card, ...recursiveMatches],
    );

const findCardIndex = (card: Card, cards: ReadonlyArray<Card>): number =>
    cards.findIndex((c) => c.id === card.id);

// ------------------------------------------------
// Shared
// ------------------------------------------------

interface Card {
    id: number;
    winningNumbers: ReadonlyArray<number>;
    scratchedNumbers: ReadonlyArray<number>;
}

interface CardWithPoints extends Card {
    points: number;
}

const CARD_REGEX = /^Card\s+(\d+): (.*) \| (.*)$/;

const parseCards = (input: string) =>
    pipe(input, inputToLines, ReadonlyArray.map(parseCard), Effect.all);

const parseCard = (line: string) =>
    pipe(
        // Run RegExp to split the line into groups
        CARD_REGEX.exec(line),
        Effect.fromNullable,
        Effect.catchTag("NoSuchElementException", () =>
            Effect.fail(new ParseError(`Could not parse Card line: ${line}`)),
        ),

        // Parse each group
        Effect.flatMap((regExpArray) =>
            Effect.all([
                parseCardId(regExpArray[1]),
                parseNumbers(regExpArray[2]),
                parseNumbers(regExpArray[3]),
            ]),
        ),

        // Combine the groups into a Card
        Effect.map(([id, winningNumbers, scratchedNumbers]) => ({
            id,
            winningNumbers,
            scratchedNumbers,
        })),

        //Add the point totals
        Effect.map(addPointTotals),
    );

const parseCardId = (id?: string) =>
    pipe(
        Effect.succeed(id),
        Effect.filterOrFail(
            (id): id is string => id !== undefined,
            () => new ParseError("Card ID is undefined"),
        ),
        Effect.flatMap(safeParseInt),
    );

const NUMBERS_REGEX = /\d+/g;

/**
 * Parse all the numbers from a string.
 *
 * @example parseNumbers("10     20 30") // [10, 20, 30]
 */
const parseNumbers = (numbersString?: string) =>
    pipe(
        Effect.succeed(numbersString),

        // Don't accept undefined
        Effect.filterOrFail(
            (id): id is string => id !== undefined,
            () => new ParseError("A numbers string cannot be undefined"),
        ),

        // Run the RegExp
        Effect.map((numbersString) => numbersString.match(NUMBERS_REGEX)),
        Effect.flatMap(Effect.fromNullable),
        Effect.catchTag("NoSuchElementException", () =>
            Effect.fail(
                new ParseError(
                    `Could not parse numbers string: ${numbersString}`,
                ),
            ),
        ),

        // Parse all matches to integers
        Effect.flatMap((numberStrings) =>
            Effect.all(ReadonlyArray.map(numberStrings, safeParseInt)),
        ),
    );

/**
 * Safely parse an integer from a string.
 */
const safeParseInt = (input: string) =>
    Effect.try({
        try: () => parseInt(input),
        catch: (e) =>
            new ParseError("Unable to parse integer from string", { cause: e }),
    });

/**
 * Determine which scratched numbers match the winning numbers and determine the card's value.
 */
const addPointTotals = (card: Card): CardWithPoints =>
    pipe(
        // Determine which numbers match
        countMatches(card),

        // Find the point value
        (matchLength) => (matchLength > 0 ? 2 ** (matchLength - 1) : 0),

        // Add it to the Card
        (points) => ({ ...card, points }),
    );

/**
 * Count how many of the scratched numbers match the winning numbers.
 */
const countMatches = (card: Card) =>
    pipe(
        card.scratchedNumbers,
        ReadonlyArray.filter((scratchedNum) =>
            card.winningNumbers.includes(scratchedNum),
        ),
        (matches) => matches.length,
    );
