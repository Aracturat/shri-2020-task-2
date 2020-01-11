import { createLinter } from "../linter";
import { WarningTextSizesShouldBeEqualRule } from "./warning-text-sizes-should-be-equal-rule";

function lint(object: object) {
    const linter = createLinter(new WarningTextSizesShouldBeEqualRule());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = {
        "block": "warning",
        "content": [
            { "block": "text", "mods": { "size": "l" } },
            { "block": "text", "mods": { "size": "l" } }
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
            { "block": "text", "mods": { "size": "m" } }
        ]
    };

    const result = lint(object);

    expect(result.length).toEqual(1);
});

test('lint incorrect json and return one error for block', () => {
    const object = {
        "block": "warning",
        "content": [
            { "block": "text", "mods": { "size": "l" } },
            { "block": "text", "mods": { "size": "m" } },
            { "block": "text", "mods": { "size": "m" } }
        ]
    };

    const result = lint(object);

    expect(result.length).toEqual(1);
});
