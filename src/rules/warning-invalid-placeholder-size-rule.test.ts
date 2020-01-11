import { initLinter } from "../linter";
import { WarningInvalidPlaceholderSizeRule } from "./warning-invalid-placeholder-size-rule";

function lint(object: object) {
    const linter = initLinter(new WarningInvalidPlaceholderSizeRule());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = {
        "block": "warning",
        "content": [
            { "block": "placeholder", "mods": { "size": "m" } }
        ]
    };

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint incorrect json', () => {
    const object = {
        "block": "warning",
        "content": [
            { "block": "placeholder", "mods": { "size": "xl" } }
        ]
    };

    const result = lint(object);

    expect(result.length).toEqual(1);
});
