import * as NodeFileSystem from "@effect/platform-node/FileSystem";
import * as NodePath from "@effect/platform-node/Path";
import { Effect, Layer, pipe } from "effect";
import { findAndSumGearRatios, findAndSumPartNumbers } from "./app/fns.js";
import { readInput } from "@repo/shared-utils";

const day1program = (input: string) =>
    pipe(
        input,
        findAndSumPartNumbers,
        (result) => Effect.logInfo(`Part 1 Total: ${result}`),
        Effect.withLogSpan("part 1"),
    );

const day2program = (input: string) =>
    pipe(
        input,
        findAndSumGearRatios,
        (result) => Effect.logInfo(`Part 2 Total: ${result}`),
        Effect.withLogSpan("part 2"),
    );

const combinedProgram = pipe(
    readInput(),
    Effect.flatMap((input) =>
        Effect.all([day1program(input), day2program(input)], {
            concurrency: "unbounded",
        }),
    ),
    Effect.catchAll((e) => Effect.logError(e.message)),
);

const programLayer = Layer.merge(NodeFileSystem.layer, NodePath.layer);
const runnable = Effect.provide(combinedProgram, programLayer);

Effect.runPromise(runnable);
