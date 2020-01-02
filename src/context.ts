import { AstEntity } from "json-to-ast";

export interface ErrorInfo {
    node: AstEntity,
    code: string
}

export interface Error {
    code: string;
    error: string;

    location: {
        start: { line: number; column: number; };
        end: { line: number; column: number; };
    };
}


export interface Context {
    report(errorInfo: ErrorInfo): void
}


export class WalkContext implements Context {
    private errorInfos = new Array<ErrorInfo>();

    report(errorInfo: ErrorInfo) {
        this.errorInfos.push(errorInfo);
    }

    getErrorWithMessages(messages: Map<string, string>): Array<Error> {
        return this.errorInfos
            .map(err => {
                return {
                    code: err.code,
                    error: messages.get(err.code),
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
                } as Error;
            });
    }
}
