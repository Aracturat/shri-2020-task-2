import { Rule } from './rule';
import { Context, ErrorInfo } from "./context";
import { RuleRegistry } from "./rule-registry";
import * as parseJson from "json-to-ast";
import { walk } from "./walk";
import AstEntity = JsonToAst.AstEntity;

class TestContext implements Context {
    public errors = new Array<string>();

    report(errorInfo: ErrorInfo) {
        this.errors.push(errorInfo.code);
    }
}

function initLinter(types: string[]): (object: object) => Array<string> {
    const context = new TestContext();
    const ruleRegistry = new RuleRegistry(context);

    class TestRule implements Rule {
        messages = {};

        create(context: Context) {
            function addChecker(type: string) {
                return {
                    [`${ type }:Enter`]: (node: AstEntity) => {
                        context.report({ node, code: `${ type }:Enter` });
                    },
                    [`${ type }:Exit`]: (node: AstEntity) => {
                        context.report({ node, code: `${ type }:Exit` });
                    }
                };
            }

            return types.reduce((checkers, type) => {
                return {
                    ...checkers,
                    ...addChecker(type)
                };
            }, {});
        };
    }

    ruleRegistry.add(new TestRule());

    return function (object: object) {
        const json = JSON.stringify(object, null, 2);

        const ast = parseJson(json);
        if (!ast) {
            return [];
        }

        walk(ast, ruleRegistry.applyCheckers.bind(ruleRegistry));

        return context.errors;
    };
}


describe('should call correct checkers', () => {
    let linter: (object: object) => Array<string>;

    beforeEach(() => {
        linter = initLinter([
            'Array',
            'Object',
            'Property',
            'Identifier',
            'Literal'
        ]);
    });

    test('empty object', () => {
        const object = {};

        const result = linter(object);

        expect(result).toEqual(['Object:Enter', 'Object:Exit']);
    });

    test('empty array', () => {
        const array: any = [];

        const result = linter(array);

        expect(result).toEqual(['Array:Enter', 'Array:Exit']);
    });

    test('object with block property', () => {
        const array: any = {
            "block": "value"
        };

        const result = linter(array);

        expect(result).toEqual([
            'Object:Enter',
            'Property:Enter',
            'Identifier:Enter',
            'Identifier:Exit',
            'Literal:Enter',
            'Literal:Exit',
            'Property:Exit',
            'Object:Exit'
        ]);
    });
});

describe('should call correct checkers for bem elements', () => {
    let linter: (object: object) => Array<string>;

    beforeEach(() => {
        linter = initLinter([
            'Bem:block',
            'Bem:block__elem',
        ]);
    });

    test('object', () => {
        const object = {};

        const result = linter(object);

        expect(result).toEqual([]);
    });

    test('block', () => {
        const object: any = {
            "block": "block"
        };
        const result = linter(object);

        expect(result).toEqual(['Bem:block:Enter', 'Bem:block:Exit']);
    });

    test('element', () => {
        const object: any = {
            "block": "block",
            "elem": "elem"
        };

        const result = linter(object);

        expect(result).toEqual(['Bem:block__elem:Enter', 'Bem:block__elem:Exit']);
    });
});
