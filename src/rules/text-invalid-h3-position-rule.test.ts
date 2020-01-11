import { TextInvalidH3PositionRule } from "./text-invalid-h3-position-rule";
import { createLinter } from "../linter";

function lint(object: object) {
    const linter = createLinter(new TextInvalidH3PositionRule());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = [
        {
            "block": "text",
            "mods": { "type": "h2" }
        },
        {
            "block": "text",
            "mods": { "type": "h3" }
        }
    ];

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint incorrect json', () => {
    const object = [
        {
            "block": "text",
            "mods": { "type": "h3" }
        },
        {
            "block": "text",
            "mods": { "type": "h2" }
        }
    ];

    const result = lint(object);

    expect(result.length).toEqual(1);
});
