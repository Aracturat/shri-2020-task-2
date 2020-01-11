import * as parseJson from "json-to-ast";

import { walk } from "./walk";
import { Error, WalkContext } from "./context";
import { WarningTextSizesShouldBeEqualRule } from "./rules/warning-text-sizes-should-be-equal-rule";
import { RuleRegistry } from "./rule-registry";

import { WarningInvalidButtonSizeRule } from "./rules/warning-invalid-button-size-rule";
import { WarningInvalidButtonPositionRule } from "./rules/warning-invalid-button-position-rule";
import { WarningInvalidPlaceholderSizeRule } from "./rules/warning-invalid-placeholder-size-rule";

import { TextSeveralH1Rule } from "./rules/text-several-h1-rule";
import { TextInvalidH2PositionRule } from "./rules/text-invalid-h2-position-rule";
import { TextInvalidH3PositionRule } from "./rules/text-invalid-h3-position-rule";
import { GridTooMuchMarketingBlocks } from "./rules/grid-too-much-marketing-blocks";
import { Rule } from "./rule";

export function lint(json: string): Array<Error> {
    const linter = initLinter(
        new WarningTextSizesShouldBeEqualRule(),
        new WarningInvalidButtonSizeRule(),
        new WarningInvalidButtonPositionRule(),
        new WarningInvalidPlaceholderSizeRule(),

        new TextSeveralH1Rule(),
        new TextInvalidH2PositionRule(),
        new TextInvalidH3PositionRule(),

        new GridTooMuchMarketingBlocks()
    );

    return linter(json);
}

export function initLinter(...rules: Rule[]): (json: string) => Array<Error> {
    const context = new WalkContext();

    const ruleRegistry = new RuleRegistry(context);

    rules.forEach(rule => ruleRegistry.add(rule));

    return function (json: string) {
        const ast = parseJson(json);
        if (!ast) {
            return [];
        }

        walk(ast, ruleRegistry.applyCheckers.bind(ruleRegistry));

        return context.getErrorWithMessages(ruleRegistry.getMessages());
    };
}

