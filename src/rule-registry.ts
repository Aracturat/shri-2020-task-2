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

            const checkers = this.checkers.get(key);
            if (checkers) {
                if (checker instanceof Array) {
                    checkers.push(...checker);
                } else {
                    checkers.push(checker);
                }
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

    private applyCheckersByCheckerType(checkerType: string, node: AstEntity, parent: AstEntity | null) {
        let checkers = this.checkers.get(checkerType);

        if (checkers) {
            // any используется чтобы работало со strict: true
            checkers.forEach(checker => checker(node as any, parent));
        }
    }

    applyCheckers(node: AstEntity, parent: AstEntity | null, type: 'Enter' | 'Exit') {
        this.applyCheckersByCheckerType(`${ node.type }:${ type }`, node, parent);

        if (node.type === 'Object') {
            let bemInfo = tryGetBemInfo(node, parent);

            if (bemInfo.block && !bemInfo.elem) {
                this.applyCheckersByCheckerType(`Bem:${ bemInfo.block }:${ type }`, node, parent);
            }
            if (bemInfo.block && bemInfo.elem) {
                this.applyCheckersByCheckerType(`Bem:${ bemInfo.block }__${ bemInfo.elem }:${ type }`, node, parent);
            }
        }
    }

    getMessages() {
        return this.messages;
    }
}
