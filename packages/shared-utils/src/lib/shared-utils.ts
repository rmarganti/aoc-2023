import { FileSystem } from "@effect/platform/FileSystem";
import { Path } from "@effect/platform/Path";
import { pipe, Effect } from "effect";

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
