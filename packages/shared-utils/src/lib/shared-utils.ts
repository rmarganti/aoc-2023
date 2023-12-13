import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";
import { pipe, Effect, String, ReadonlyArray } from "effect";

/**
 * Read the input.txt in the current working directory.
 */
export const readInput = () =>
    pipe(
        Effect.all([FileSystem, Path]),
        Effect.flatMap(([fileSystem, path]) =>
            pipe(
                path.resolve(process.cwd(), "input.txt"),
                fileSystem.readFileString,
            ),
        ),
    );

/**
 * Read the input.txt in the current working directory and split it into lines,
 * trimming white space and removing empty lines.
 */
export const inputToLines = (input: string) =>
    pipe(
        input,
        String.split("\n"),
        ReadonlyArray.map((line) => line.trim()),
        ReadonlyArray.filter((line) => line !== ""),
    );

export class ParseError extends Error {
    readonly _tag = "ParseError";
}
