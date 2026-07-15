import { describe, expect, test } from "bun:test";

import { rubberBand } from "../src/rubber-band";

describe("rubberBand", () => {
    test("returns zero for zero distance", () => {
        expect(rubberBand(0, 300, 0.55)).toBe(0);
    });

    test("matches the rubber-band formula", () => {
        const distance = 80;
        const dimension = 300;
        const coefficient = 0.55;
        const expected = (1 - 1 / ((distance * coefficient) / dimension + 1)) * dimension;

        expect(rubberBand(distance, dimension, coefficient)).toBeCloseTo(expected);
    });

    test("is symmetric for negative and positive distances", () => {
        expect(rubberBand(-120, 300, 0.55)).toBeCloseTo(-rubberBand(120, 300, 0.55));
    });

    test("grows monotonically while remaining below the dimension", () => {
        const distances = [10, 50, 100, 500, 10_000];
        const results = distances.map((distance) => rubberBand(distance, 300, 0.55));

        for (let index = 1; index < results.length; index += 1) {
            expect(results[index]).toBeGreaterThan(results[index - 1]!);
        }

        for (const result of results) {
            expect(result).toBeLessThan(300);
        }
    });

    test("applies more resistance with a smaller coefficient", () => {
        expect(rubberBand(100, 300, 0.25)).toBeLessThan(rubberBand(100, 300, 0.75));
    });

    test("falls back to the raw distance when the dimension is unavailable", () => {
        expect(rubberBand(80, 0, 0.55)).toBe(80);
    });
});
