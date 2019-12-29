import * as jsonToAst from "json-to-ast";
import { Rule } from "./rule";

export type JsonAST = jsonToAst.AstEntity | undefined;

export interface LinterProblem<TKey> {
    key: TKey;
    loc: jsonToAst.AstLocation;
}

export function lint<TProblemKey>(
    json: string,
): LinterProblem<TProblemKey>[] {
    return makeLint(json, property => [], property => []);
}

function makeLint<TProblemKey>(
    json: string,
    validateProperty: (property: jsonToAst.AstProperty) => LinterProblem<TProblemKey>[],
    validateObject: (property: jsonToAst.AstObject) => LinterProblem<TProblemKey>[]
): LinterProblem<TProblemKey>[] {

    function walk(
        node: jsonToAst.AstEntity,
        cbProp: (property: jsonToAst.AstProperty) => void,
        cbObj: (property: jsonToAst.AstObject) => void
    ) {
        switch (node.type) {
            case 'Array':
                node.children.forEach((item: jsonToAst.AstEntity) => {
                    walk(item, cbProp, cbObj);
                });
                break;
            case 'Object':
                cbObj(node);

                node.children.forEach((property: jsonToAst.AstProperty) => {
                    cbProp(property);
                    walk(property.value, cbProp, cbObj);
                });
                break;
        }
    }

    function parseJson(json: string): JsonAST {
        return jsonToAst(json);
    }

    const errors: LinterProblem<TProblemKey>[] = [];
    const ast: JsonAST = parseJson(json);

    if (ast) {
        walk(ast,
            (property: jsonToAst.AstProperty) => errors.concat(...validateProperty(property)),
            (obj: jsonToAst.AstObject) => errors.concat(...validateObject(obj)));
    }

    return errors;
}
class RuleRegistry {

    messages: Map<string, string>;

    constructor() {
        this.messages = new Map<string, string>();
    }

    add(rule: Rule) {
        Object.keys(rule.messages)
            .forEach(key => {
                this.messages.set(key, rule.messages[key]);
            });
    }
}


