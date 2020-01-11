import { AstArray, AstIdentifier, AstLiteral, AstObject, AstProperty } from "json-to-ast";

import { Context } from "./context";

export type Checker =
    | ((node: AstObject) => void)
    | ((node: AstArray) => void)
    | ((node: AstLiteral) => void)
    | ((node: AstIdentifier) => void)
    | ((node: AstProperty) => void)


export interface Rule {
    messages: { [code: string]: string };

    create(context: Context): { [nodeType: string]: Checker | Checker[] };
}
