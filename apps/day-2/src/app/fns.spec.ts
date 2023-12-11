import { Effect } from "effect";
import {
    parseFileContents,
    sumPowersOfMinimalStones,
    sumValidGameIdsFromGameRecord,
} from "./fns.js";

const availableStones = {
    red: 12,
    green: 13,
    blue: 14,
};

const input = `
    Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
    Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
    Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
    Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;

const parsedInput = Effect.runSync(parseFileContents(input));

test("sumValidGameIdsFromGameRecord()", () => {
    const result = sumValidGameIdsFromGameRecord(availableStones)(parsedInput);
    expect(result).toEqual(8);
});

test("sumPowersOfMinimalStones", () => {
    const result = sumPowersOfMinimalStones(parsedInput);
    expect(result).toEqual(2286);
});
