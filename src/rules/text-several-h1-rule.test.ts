import { TextSeveralH1Rule } from "./text-several-h1-rule";
import { createLinter } from "../linter";


function lint(object: object) {
    const linter = createLinter(new TextSeveralH1Rule());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = [
        {
            "block": "text",
            "mods": { "type": "h1" }
        }
    ];

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint incorrect json', () => {
    const object = [
        {
            "block": "text",
            "mods": { "type": "h1" }
        },
        {
            "block": "text",
            "mods": { "type": "h1" }
        }
    ];

    const result = lint(object);

    expect(result.length).toEqual(1);
});
