import * as parseJson from "json-to-ast";

import { walk } from "./walk";
import { Error } from "./error";
import { WalkContext } from "./context";

import { Rule } from "./rule";
import { RuleRegistry } from "./rule-registry";
import {
    GridTooMuchMarketingBlocks,
    TextInvalidH2PositionRule,
    TextInvalidH3PositionRule,
    TextSeveralH1Rule,
    WarningInvalidButtonPositionRule,
    WarningInvalidButtonSizeRule,
    WarningInvalidPlaceholderSizeRule,
    WarningTextSizesShouldBeEqualRule
} from "./rules";

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

