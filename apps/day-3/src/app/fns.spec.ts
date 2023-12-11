import { findAndSumGearRatios, findAndSumPartNumbers } from "./fns.js";

const input = `
    467..114..
    ...*......
    ..35..633.
    ......#...
    617*......
    .....+.58.
    ..592.....
    ......755.
    ...$.*....
    .664.598..
`;

test("findAndSumPartNumbers()", () => {
    const result = findAndSumPartNumbers(input);
    expect(result).toEqual(4361);
});

test("sumPowersOfMinimalStones", () => {
    const program = sumPowersOfMinimalStones(input);
    const result = Effect.runSync(program);

    expect(result).toEqual(2286);
});
