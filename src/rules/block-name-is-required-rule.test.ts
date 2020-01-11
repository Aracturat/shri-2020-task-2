import { createLinter } from "../linter";
import { BlockNameIsRequiredRule } from "./block-name-is-required-rule";

function lint(object: object) {
    const linter = createLinter(new BlockNameIsRequiredRule());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = {
        "block": "warning"
    };

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint correct json with mods', () => {
    const object = {
        "block": "warning",
        "mods": {}
    };

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint correct json with elemMods', () => {
    const object = {
        "block": "warning",
        "elem": "elem",
        "elemMods": {}
    };

    const result = lint(object);

    expect(result).toEqual([]);
});


test('lint incorrect json', () => {
    const object = {
        "test": "warning"
    };

    const result = lint(object);

    expect(result.length).toEqual(1);
});
