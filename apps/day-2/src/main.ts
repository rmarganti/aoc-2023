import * as NodeFileSystem from "@effect/platform-node/FileSystem";
import * as NodePath from "@effect/platform-node/Path";
import { Effect, Layer, pipe } from "effect";
import {
    GameData,
    readInputAndParse,
    sumPowersOfMinimalStones,
    sumValidGameIdsFromGameRecord,
} from "./app/fns.js";

const AVAILABLE_STONES = {
    red: 12,
    green: 13,
    blue: 14,
};

const day1program = (gameData: GameData[]) =>
    pipe(
        gameData,
        sumValidGameIdsFromGameRecord(AVAILABLE_STONES),
        (result) => Effect.logInfo(`Part 1 Total: ${result}`),
        Effect.withLogSpan("part 1"),
    );

const day2program = (gameData: GameData[]) =>
    pipe(
        gameData,
        sumPowersOfMinimalStones,
        (result) => Effect.logInfo(`Part 2 Total: ${result}`),
        Effect.withLogSpan("part 2"),
    );

const combinedProgram = pipe(
    readInputAndParse(),
    Effect.flatMap((gameData) =>
        Effect.all([day1program(gameData), day2program(gameData)], {
            concurrency: "unbounded",
        }),
    ),
    Effect.catchAll((e) => Effect.logError(e.message)),
);

const programLayer = Layer.merge(NodeFileSystem.layer, NodePath.layer);
const runnable = Effect.provide(combinedProgram, programLayer);

Effect.runPromise(runnable);
