import * as NodeFileSystem from "@effect/platform-node/FileSystem";
import * as NodePath from "@effect/platform-node/Path";
import { Effect, Layer, pipe } from "effect";
import { findAndSumPartNumbers } from "./app/fns.js";
import { readInput } from "@repo/shared-utils";

const day1program = (input: string) =>
    pipe(input, findAndSumPartNumbers, (result) =>
        Effect.logInfo(`Day 1 Total: ${result}`),
    );

const combinedProgram = pipe(
    readInput(),
    Effect.flatMap(day1program),
    Effect.catchAll((e) => Effect.logError(e.message)),
);

const programLayer = Layer.merge(NodeFileSystem.layer, NodePath.layer);
const runnable = Effect.provide(combinedProgram, programLayer);

Effect.runPromise(runnable);
