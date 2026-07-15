export function rubberBand(distance: number, dimension: number, coefficient: number) {
    "worklet";

    if (distance === 0) {
        return 0;
    }

    if (!Number.isFinite(dimension) || dimension <= 0) {
        return distance;
    }

    const absoluteDistance = Math.abs(distance);
    const dampedDistance = (1 - 1 / ((absoluteDistance * coefficient) / dimension + 1)) * dimension;

    return Math.sign(distance) * dampedDistance;
}
