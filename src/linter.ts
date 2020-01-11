import * as parseJson from "json-to-ast";

import { walk } from "./walk";
import { Error } from "./error";
import { WalkContext } from "./context";

import { Rule } from "./rule";
import { RuleRegistry } from "./rule-registry";
import {
    BlockNameIsRequiredRule,
    GridTooMuchMarketingBlocksRule,
    TextInvalidH2PositionRule,
    TextInvalidH3PositionRule,
    TextSeveralH1Rule,
    UppercaseNamesAreForbiddenRule,
    WarningInvalidButtonPositionRule,
    WarningInvalidButtonSizeRule,
    WarningInvalidPlaceholderSizeRule,
    WarningTextSizesShouldBeEqualRule
} from "./rules";
import AstEntity = JsonToAst.AstEntity;

/**
 * Проверить на ошибки json
 * @param json строка, содержащая json
 */
export function lint(json: string): Array<Error> {
    const linter = createLinter(
        new WarningTextSizesShouldBeEqualRule(),
        new WarningInvalidButtonSizeRule(),
        new WarningInvalidButtonPositionRule(),
        new WarningInvalidPlaceholderSizeRule(),

        new TextSeveralH1Rule(),
        new TextInvalidH2PositionRule(),
        new TextInvalidH3PositionRule(),

        new GridTooMuchMarketingBlocksRule(),

        new BlockNameIsRequiredRule(),
        new UppercaseNamesAreForbiddenRule()
    );

    return linter(json);
}

/**
 * Создать линтер с заданными правилами.
 * @param rules правила
 */
export function createLinter(...rules: Rule[]): (json: string) => Array<Error> {
    const context = new WalkContext();

    const ruleRegistry = new RuleRegistry(context);

    rules.forEach(rule => ruleRegistry.add(rule));

    return function (json: string) {
        let ast: AstEntity | null = null;

        // Может быть невалидный json
        try {
            ast = parseJson(json);
        } catch {

        }

        if (!ast) {
            return [];
        }

        walk(ruleRegistry.applyCheckers.bind(ruleRegistry), ast);

        return context.getErrorWithMessages(ruleRegistry.getMessages());
    };
}
