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
    pipe(gameData, sumValidGameIdsFromGameRecord(AVAILABLE_STONES), (result) =>
        Effect.logInfo(`Day 1 Total: ${result}`),
    );

const day2program = (gameData: GameData[]) =>
    pipe(gameData, sumPowersOfMinimalStones, (result) =>
        Effect.logInfo(`Day 2 Total: ${result}`),
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
