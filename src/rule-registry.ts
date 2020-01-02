import { AstEntity } from "json-to-ast";

import { Context } from "./context";
import { tryGetBemInfo } from "./utils";
import { Checker, Rule } from "./rule";

export class RuleRegistry {
    private readonly context: Context;
    private readonly checkers = new Map<string, Array<Checker>>();
    private readonly messages = new Map<string, string>();

    constructor(context: Context) {
        this.context = context;
    }

    add(rule: Rule) {
        Object.keys(rule.messages)
            .forEach(key => {
                this.messages.set(key, rule.messages[key]);
            });

        let checkers = rule.create(this.context);

        const addToCheckers = (key: string, checker: Checker | Array<Checker>) => {
            if (!this.checkers.has(key)) {
                this.checkers.set(key, new Array<Checker>());
            }

            if (checker instanceof Array) {
                this.checkers.get(key).push(...checker);
            } else {
                this.checkers.get(key).push(checker);
            }
        };

        Object.keys(checkers)
            .forEach(key => {
                if (!key.endsWith(':Enter') && !key.endsWith(':Exit')) {
                    addToCheckers(`${ key }:Enter`, checkers[key]);
                } else {
                    addToCheckers(key, checkers[key]);
                }
            });
    }

    private applyCheckersByCheckerType(checkerType: string, node: AstEntity) {
        let checkers = this.checkers.get(checkerType);

        if (checkers) {
            checkers.forEach(checker => checker(node));
        }
    }

    applyCheckers(node: AstEntity, type: 'Enter' | 'Exit') {
        this.applyCheckersByCheckerType(`${ node.type }:${ type }`, node);

        if (node.type === 'Object') {
            let bemInfo = tryGetBemInfo(node);

            if (bemInfo.block && !bemInfo.elem) {
                this.applyCheckersByCheckerType(`Bem:${ bemInfo.block }:${ type }`, node);
            }
            if (bemInfo.block && bemInfo.elem) {
                this.applyCheckersByCheckerType(`Bem:${ bemInfo.block }__${ bemInfo.elem }:${ type }`, node);
            }
        }
    }

    getMessages() {
        return this.messages;
    }
}
