import { AstEntity } from "json-to-ast";

export function walk(node: AstEntity, func: (node: AstEntity, type: 'Enter' | 'Exit') => void) {
    func(node, 'Enter');

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

    func(node, 'Exit');
}
