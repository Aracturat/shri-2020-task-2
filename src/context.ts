import { AstEntity } from "json-to-ast";

export interface Context {
    report({ node, messageId }: { node: AstEntity, messageId: string })
}

export interface Error {
    node: AstEntity,
    messageId: string
}

export class WalkContext implements Context {
    private errors = new Array<Error>();

    report(error: Error) {
        this.errors.push(error);
    }

    getErrors() {
        return this.errors;
    }
}
