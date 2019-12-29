declare namespace JsonToAst {
    export interface AstPosition {
        line: number;
        column: number;
        offset: number;
    }

    export interface AstLocation {
        start: AstPosition;
        end: AstPosition;
    }

    export interface AstLiteral {
        type: 'Literal';
        value: string | number | boolean | null;
        raw: string;
        loc: AstLocation;
    }

    export interface AstArray {
        type: 'Array';
        children: Array<AstEntity>;
        loc: AstLocation;
    }

    export interface AstObject {
        type: 'Object';
        children: AstProperty[];
        loc: AstLocation;
    }

    export interface AstProperty {
        type: 'Property';
        key: AstIdentifier;
        value: AstEntity;
        loc: AstLocation;
    }

    export interface AstIdentifier {
        type: 'Identifier';
        value: string;
        raw: string;
    }

    export type AstEntity = AstObject | AstArray | AstLiteral;
}

declare function JsonToAst(json: string): JsonToAst.AstEntity;

declare module "json-to-ast" {
    export = JsonToAst;
}
