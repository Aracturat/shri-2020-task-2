import { AstEntity } from "json-to-ast";

export interface Context {
    report({node, messageId} : { node: AstEntity, messageId: string })
}
