const lerp = (val, a1, b1, a2, b2) => {
    return a2 + (val - a1) * (b2 - a2) / (b1 - a1);
}

const constrain = (x, a, b) => (x < a) ? a : (x > b) ? b : x;

const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return {r, g, b}
}

export { lerp, constrain, hexToRgb }