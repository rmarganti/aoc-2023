import { Effect, pipe } from "effect";

export class FindNumberError {
    readonly _tag = "NumberLikeError";
    constructor(readonly message: string) {}
}

/**
 * Find the first and last number in a string and combine them together.
 * It will find both digits (ie. `3`) and words (ie. `two`).
 *
 * ie. "abcdtwoghi8jk9lmn" => 29
 */
export const findDoubleDigitNumber = (
    line: string,
    idx: number,
): Effect.Effect<never, FindNumberError, number> => {
    const numberLikeMatches = findDigitLikes(line);

    const firstNumber = numberLikeToNumber(numberLikeMatches[0]).pipe(
        Effect.mapError(
            (e) =>
                new FindNumberError(
                    `Could not find first number for line ${idx + 1}: ${
                        e.message
                    }`,
                ),
        ),
    );

    const lastNumber = numberLikeToNumber(numberLikeMatches.slice(-1)[0]).pipe(
        Effect.mapError(
            (e) =>
                new FindNumberError(
                    `Could not find last number for line ${idx + 1}: ${
                        e.message
                    }`,
                ),
        ),
    );

    return pipe(
        Effect.all([firstNumber, lastNumber]),
        Effect.map(([first, last]) => first * 10 + last),
    );
};

/**
 * A list of digit-like strings and their corresponding number value.
 */
const numberLikeMap = new Map([
    ["1", 1],
    ["2", 2],
    ["3", 3],
    ["4", 4],
    ["5", 5],
    ["6", 6],
    ["7", 7],
    ["8", 8],
    ["9", 9],
    ["one", 1],
    ["two", 2],
    ["three", 3],
    ["four", 4],
    ["five", 5],
    ["six", 6],
    ["seven", 7],
    ["eight", 8],
    ["nine", 9],
]);

/**
 * Iterate over all possible digit substrings of a string and return a list of
 * matches. We can't just use a regex, because we have to identify possibly
 * overlapping words (like `nineight`).
 */
const findDigitLikes = (line: string): ReadonlyArray<string> => {
    const matches: string[] = [];

    for (let i = 0; i < line.length; i++) {
        for (let j = i + 1; j <= line.length; j++) {
            const maybeNumberLike = line.slice(i, j);
            if (numberLikeMap.has(maybeNumberLike)) {
                matches.push(maybeNumberLike);
            }
        }
    }

    return matches;
};

const numberLikeToNumber = (
    numberLike: string | undefined,
): Effect.Effect<never, FindNumberError, number> => {
    if (numberLike === undefined) {
        return Effect.fail(
            new FindNumberError("Could not determine number-like value"),
        );
    }

    const maybeNumber = numberLikeMap.get(numberLike);

    if (maybeNumber !== undefined) {
        return Effect.succeed(maybeNumber);
    }

    return Effect.succeed(+numberLike);
};
