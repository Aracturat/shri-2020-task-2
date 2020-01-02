require('./build/linter')

let json = `
{
    "block": "warning",
    "content": [
        { "block": "text", "mods": { "size": "l" } },
        { "block": "text", "mods": { "size": "m" } }
    ]
}
`;

console.log(JSON.stringify(lint(json), null, 2));
