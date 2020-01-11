import { createLinter } from "../linter";
import { WarningInvalidButtonSizeRule } from "./warning-invalid-button-size-rule";

function lint(object: object) {
    const linter = createLinter(new WarningInvalidButtonSizeRule());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = {
        "block": "warning",
        "content": [
            { "block": "text", "mods": { "size": "l" } },
            { "block": "button", "mods": { "size": "xl" } }
        ]
    };

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint incorrect json', () => {
    const object = {
        "block": "warning",
        "content": [
            { "block": "text", "mods": { "size": "l" } },
            { "block": "button", "mods": { "size": "s" } }
        ]
    };

    const result = lint(object);

    expect(result.length).toEqual(1);
});
