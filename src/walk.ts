import { AstEntity } from "json-to-ast";

export function walk(node: AstEntity, func: (node: AstEntity, type: 'Enter' | 'Exit') => void) {
    const queue = [node];

    for (const queueItem of queue) {
        func(queueItem, 'Enter');

        switch (queueItem.type) {
            case 'Array':
            case 'Object':
                if (queueItem.children) {
                    queueItem.children.forEach((item: AstEntity) => {
                        queue.push(item);
                    });
                }

                break;
            case 'Property':
                queue.push(queueItem.key);
                queue.push(queueItem.value);

                break;
            case 'Literal':
            case 'Identifier':
                break;
        }

        func(queueItem, 'Exit');
    }
}
