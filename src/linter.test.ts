import { lint } from "./linter";

it('lints simple correct block', () => {
    // Из тестов для WarningTextSizesShouldBeEqualRule
    const object = {
        "block": "warning"
    };

    const json = JSON.stringify(object, null, 4);

    const result = lint(json);

    expect(result.length).toEqual(0);
});

it('returns empty array for bad json string', () => {
    const result = lint('{{12');

    expect(result.length).toEqual(0);
});
