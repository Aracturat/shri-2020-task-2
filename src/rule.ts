import { Context } from "./context";
import { AstEntity } from "json-to-ast";

export interface Rule {
    messages: { [code: string]: string };

    create(context: Context): { [nodeType: string]: (node: AstEntity) => void };
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


