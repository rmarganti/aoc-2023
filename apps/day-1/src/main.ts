import { readInput } from "@repo/shared-utils";
import * as NodeFileSystem from "@effect/platform-node/FileSystem";
import * as NodePath from "@effect/platform-node/Path";
import {
    Effect,
    Layer,
    Number,
    ReadonlyArray,
    String,
    pipe,
} from "effect";
import { findDoubleDigitNumber } from "./app/fns.js";

const program = pipe(
    readInput(),
    Effect.map(String.split("\n")),
    Effect.map(ReadonlyArray.filter((line) => line !== "")),
    Effect.flatMap((lines) =>
        Effect.all(ReadonlyArray.map(lines, findDoubleDigitNumber)),
    ),
    Effect.map(Number.sumAll),
    Effect.tap((total) => Effect.logInfo(`Total: ${total}`)),
    Effect.catchAll((e) => Effect.logError(`Error: ${e.message}`)),
    Effect.withLogSpan("part 2"), // I didn't keep part 1 around :(
);

const programLayer = Layer.merge(NodeFileSystem.layer, NodePath.layer);
const runnable = Effect.provide(program, programLayer);

Effect.runPromise(runnable);
