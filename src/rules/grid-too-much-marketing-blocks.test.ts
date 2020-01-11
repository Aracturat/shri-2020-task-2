import { createLinter } from "../linter";
import { GridTooMuchMarketingBlocks } from "./grid-too-much-marketing-blocks";

function lint(object: object) {
    const linter = createLinter(new GridTooMuchMarketingBlocks());

    return linter(JSON.stringify(object, null, 4));
}

test('lint correct json', () => {
    const object = {
        "block": "grid",
        "mods": {
            "m-columns": "10"
        },
        "content": [
            {
                "block": "grid",
                "elem": "fraction",
                "elemMods": {
                    "m-col": "8"
                },
                "content": [
                    {
                        "block": "payment"
                    }
                ]
            },
            {
                "block": "grid",
                "elem": "fraction",
                "elemMods": {
                    "m-col": "2"
                },
                "content": [
                    {
                        "block": "offer"
                    }
                ]
            }
        ]
    };

    const result = lint(object);

    expect(result).toEqual([]);
});

test('lint incorrect json', () => {
    const object = {
        "block": "grid",
        "mods": {
            "m-columns": "10"
        },
        "content": [
            {
                "block": "grid",
                "elem": "fraction",
                "elemMods": {
                    "m-col": "2"
                },
                "content": [
                    {
                        "block": "payment"
                    }
                ]
            },
            {
                "block": "grid",
                "elem": "fraction",
                "elemMods": {
                    "m-col": "8"
                },
                "content": [
                    {
                        "block": "offer"
                    }
                ]
            }
        ]
    };

    const result = lint(object);

    expect(result.length).toEqual(1);
});
