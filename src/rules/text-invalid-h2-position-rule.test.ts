import { createLinter } from "../linter";
import { TextInvalidH2PositionRule } from "./text-invalid-h2-position-rule";

function lint(object: object) {
    const linter = createLinter(new TextInvalidH2PositionRule());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = [
        {
            "block": "text",
            "mods": { "type": "h1" }
        },
        {
            "block": "text",
            "mods": { "type": "h2" }
        }
    ];

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint incorrect json', () => {
    const object = [
        {
            "block": "text",
            "mods": { "type": "h2" }
        },
        {
            "block": "text",
            "mods": { "type": "h1" }
        }
    ];

    const result = lint(object);

    expect(result.length).toEqual(1);
});
