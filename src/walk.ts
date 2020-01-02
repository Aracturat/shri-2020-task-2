import { AstEntity } from "json-to-ast";

let NODE_ID = 0;

export function walk(node: AstEntity, func: (node: AstEntity, nodeId: number, type: 'Enter' | 'Exit') => void) {
    const nodeId = NODE_ID++;

    func(node, nodeId, 'Enter');

    switch (node.type) {
        case 'Array':
        case 'Object':
            if (node.children) {
                node.children.forEach((item: AstEntity) => {
                    walk(item, func);
                });
            }

            break;
        case 'Property':
            walk(node.key, func);
            walk(node.value, func);

            break;
        case 'Literal':
        case 'Identifier':
            break;
    }

    func(node, nodeId, 'Exit');
}
