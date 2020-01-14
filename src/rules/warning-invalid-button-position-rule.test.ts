import { createLinter } from "../linter";
import { WarningInvalidButtonPositionRule } from "./warning-invalid-button-position-rule";


function lint(object: object) {
    const linter = createLinter(new WarningInvalidButtonPositionRule());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = {
        "block": "warning",
        "content": [
            { "block": "placeholder", "mods": { "size": "m" } },
            { "block": "button", "mods": { "size": "m" } }
        ]
    };

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint incorrect json', () => {
    const object = {
        "block": "warning",
        "content": [
            { "block": "button", "mods": { "size": "m" } },
            { "block": "placeholder", "mods": { "size": "m" } }
        ]
    };

    const result = lint(object);

    expect(result.length).toEqual(1);
});
