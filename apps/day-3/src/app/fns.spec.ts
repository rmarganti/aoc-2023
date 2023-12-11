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

test("findAndSumGearNumbers", () => {
    const result = findAndSumGearRatios(input);
    expect(result).toEqual(467835);
});
