import * as parseJson from "json-to-ast";

import { walk } from "./walk";
import { WalkContext } from "./context";
import { WarningTextSizesShouldBeEqualRule } from "./rules/warning-text-sizes-should-be-equal-rule";
import { RuleRegistry } from "./rule";

import { WarningInvalidButtonSizeRule } from "./rules/warning-invalid-button-size-rule";
import { WarningInvalidButtonPositionRule } from "./rules/warning-invalid-button-position-rule";
import { WarningInvalidPlaceholderSizeRule } from "./rules/warning-invalid-placeholder-size-rule";

import { TextSeveralH1Rule } from "./rules/text-several-h1-rule";
import { TextInvalidH2PositionRule } from "./rules/text-invalid-h2-position-rule";
import { TextInvalidH3PositionRule } from "./rules/text-invalid-h3-position-rule";

export function lint(json: string) {
    const ast = parseJson(json);

    const context = new WalkContext();
    const ruleRegistry = new RuleRegistry(context);

    ruleRegistry.add(new WarningTextSizesShouldBeEqualRule());
    ruleRegistry.add(new WarningInvalidButtonSizeRule());
    ruleRegistry.add(new WarningInvalidButtonPositionRule());
    ruleRegistry.add(new WarningInvalidPlaceholderSizeRule());

    ruleRegistry.add(new TextSeveralH1Rule());
    ruleRegistry.add(new TextInvalidH2PositionRule());
    ruleRegistry.add(new TextInvalidH3PositionRule());

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
