import { readInput } from "@repo/shared-utils";
import * as NodeFileSystem from "@effect/platform-node/FileSystem";
import * as NodePath from "@effect/platform-node/Path";
import { Console, Effect, Layer, Number, ReadonlyArray, String } from "effect";
import { findDoubleDigitNumber } from "./app/fns.js";

const program = Effect.gen(function* (_) {
    const fileContents = yield* _(readInput());

    const total = yield* _(
        fileContents,
        String.split("\n"),
        ReadonlyArray.filter((line) => line !== ""),
        ReadonlyArray.map(findDoubleDigitNumber),
        Effect.all,
        Effect.map(Number.sumAll),
    );

    yield* _(Console.log(`Total: ${total}`));
}).pipe(Effect.catchAll((e) => Console.error(`Error: ${e.message}`)));

const programLayer = Layer.merge(NodeFileSystem.layer, NodePath.layer);
const runnable = Effect.provide(program, programLayer);

Effect.runPromise(runnable);
