import { Context } from "./context";
import { AstEntity } from "json-to-ast";

export type Checker = (node: AstEntity, nodeId?: number) => void

export interface Rule {
    messages: { [code: string]: string };

    create(context: Context): { [nodeType: string]: Checker };
}


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

        const addToCheckers = (key: string, checker: Checker) => {
            if (!this.checkers.has(key)) {
                this.checkers.set(key, []);
            }

            this.checkers.get(key).push(checker);
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

    applyCheckers(node: AstEntity, nodeId: number, type: 'Enter' | 'Exit') {
        let checkers = this.checkers.get(`${ node.type }:${ type }`);

        if (checkers) {
            checkers.forEach(checker => checker(node, nodeId));
        }
    }

    getMessages() {
        return this.messages;
    }
}
