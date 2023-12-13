import * as NodeFileSystem from "@effect/platform-node/FileSystem";
import * as NodePath from "@effect/platform-node/Path";
import { Effect, Layer, pipe } from "effect";
import { parseAndSumCardPoints } from "./app/fns.js";
import { readInput } from "@repo/shared-utils";

const day1program = (input: string) =>
    pipe(
        input,
        parseAndSumCardPoints,
        Effect.tap((result) => Effect.logInfo(`Part 1 Total: ${result}`)),
    );

// const day2program = (input: string) =>
//     pipe(input, findAndSumGearRatios, (result) =>
//         Effect.logInfo(`Part 2 Total: ${result}`),
//     );

const combinedProgram = pipe(
    readInput(),
    Effect.flatMap((input) =>
        Effect.all([day1program(input)], {
            concurrency: "unbounded",
        }),
    ),
    Effect.catchAll((e) => Effect.logError(e.message)),
);

const programLayer = Layer.merge(NodeFileSystem.layer, NodePath.layer);
const runnable = Effect.provide(combinedProgram, programLayer);

Effect.runPromise(runnable);
