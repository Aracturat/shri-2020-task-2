import { createLinter } from "../linter";
import { UppercaseNamesAreForbiddenRule } from "./uppercase-names-are-forbidden-rule";


function lint(object: object) {
    const linter = createLinter(new UppercaseNamesAreForbiddenRule());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = {
        "block": "warning",
        "content": []
    };

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint incorrect json', () => {
    const object = {
        "BLOCK": "warning",
        "content": []
    };

    const result = lint(object);

    expect(result.length).toEqual(1);
});
