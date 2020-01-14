import * as parseJson from "json-to-ast";
import { walk } from './walk';


test('walk', () => {
    const object = [{
        'block': 'name'
    }];

    let ast = parseJson(JSON.stringify(object));

    const nodeTypes: string[] = [];

    walk((node, parent, type) => nodeTypes.push(`${ node.type }:${ type }`), ast);

    expect(nodeTypes).toEqual([
        'Array:Enter',
        'Object:Enter',
        'Property:Enter',
        'Identifier:Enter',
        'Identifier:Exit',
        'Literal:Enter',
        'Literal:Exit',
        'Property:Exit',
        'Object:Exit',
        'Array:Exit'
    ]);
});
