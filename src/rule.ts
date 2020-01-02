import { AstEntity } from "json-to-ast";

import { Context } from "./context";


export type Checker = (node: AstEntity) => void

export interface Rule {
    messages: { [code: string]: string };

    create(context: Context): { [nodeType: string]: Checker | Checker[] };
}
