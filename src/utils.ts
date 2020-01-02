import { AstArray, AstEntity, AstObject, AstProperty } from "json-to-ast";

export function findProperty(object: AstObject, identifier: string): AstProperty {
    if (!object || !object.children) {
        return null;
    }

    return object.children.find(e => e.key.value === identifier);
}

export function findPropertyValue(object: AstObject, propertyName: string): AstEntity {
    let property = findProperty(object, propertyName);

    if (!property) {
        return null;
    }

    return property.value;
}

export function getBlockName(node: AstObject) {
    const block = findProperty(node, 'block');
    if (!block) {
        return null;
    }

    if (block.value.type === 'Literal') {
        return block.value.value;
    }
}

export function findBlocks(array: AstArray, blockName: string): AstObject[] {
    if (!array) {
        return [];
    }

    return array.children.filter(e => {
        if (e.type === 'Object') {
            return getBlockName(e) === blockName;
        }

        return false;
    }) as AstObject[];
}

export function findByPath(object: AstObject, path: string): AstEntity {
    if (!object || !path) {
        return null;
    }

    let keys = path.split(".");

    let result: AstEntity = object;

    for (let key of keys) {
        if (!result || result.type !== "Object") {
            return null;
        }

        result = findPropertyValue(result, key);
    }

    return result;
}

export function tryGetBemInfo(object: AstObject): { block?: string, elem?: string } {
    if (!object) {
        return {};
    }

    const blockProperty = findProperty(object, 'block');

    if (!blockProperty || blockProperty.value.type !== 'Literal') {
        return {};
    }

    const elemProperty = findProperty(object, 'elem');

    if (!elemProperty || elemProperty.value.type !== 'Literal') {
        return {
            block: blockProperty.value.value.toString(),
        };
    }

    return {
        block: blockProperty.value.value.toString(),
        elem: elemProperty.value.value.toString()
    };
}
