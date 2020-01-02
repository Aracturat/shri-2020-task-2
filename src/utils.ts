import { AstArray, AstEntity, AstObject, AstProperty } from "json-to-ast";

export function findProperty(object: AstObject, identifier: string): AstProperty | undefined {
    if (!object || !object.children) {
        return undefined;
    }

    return object.children.find(e => e.key.value === identifier);
}

export function findPropertyValue(object: AstObject, propertyName: string): AstEntity | undefined {
    let property = findProperty(object, propertyName);

    if (!property) {
        return undefined;
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

export function findByPath(object: AstObject, path: string): AstEntity | undefined {
    if (!object || !path) {
        return undefined;
    }

    let keys = path.split(".");

    let result: AstEntity | undefined = object;

    for (let key of keys) {
        if (!result || result.type !== "Object") {
            return undefined;
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

    if (!blockProperty || blockProperty.value.type !== 'Literal' || !blockProperty.value.value) {
        return {};
    }

    const elemProperty = findProperty(object, 'elem');

    if (!elemProperty || elemProperty.value.type !== 'Literal' || !elemProperty.value.value) {
        return {
            block: blockProperty.value.value.toString(),
        };
    }

    return {
        block: blockProperty.value.value.toString(),
        elem: elemProperty.value.value.toString()
    };
}
