import * as parseJson from "json-to-ast";

import { walk } from "./walk";
import { WalkContext } from "./context";
import { WarningTextSizesShouldBeEqualRule } from "./rules/warning-text-sizes-should-be-equal-rule";
import { RuleRegistry } from "./rule";
import { WarningInvalidButtonSizeRule } from "./rules/warning-invalid-button-size-rule";

export function lint(json: string) {
    const ast = parseJson(json);

    const context = new WalkContext();
    const ruleRegistry = new RuleRegistry(context);

    ruleRegistry.add(new WarningTextSizesShouldBeEqualRule());
    ruleRegistry.add(new WarningInvalidButtonSizeRule());

    if (ast) {
        walk(ast, ruleRegistry.applyCheckers.bind(ruleRegistry));
    }

    let messages = ruleRegistry.getMessages();

    return context.getErrors()
        .map(err => {
            return {
                code: err.messageId,
                error: messages.get(err.messageId),
                location: {
                    start: {
                        line: err.node.loc.start.line,
                        column: err.node.loc.start.column
                    },
                    end: {
                        line: err.node.loc.end.line,
                        column: err.node.loc.end.column
                    }
                }
            };
        });
}
