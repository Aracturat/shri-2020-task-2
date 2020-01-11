import * as parseJson from "json-to-ast";
import { findBlocks, findByPath, findProperty, findPropertyValue, getBlockName, tryGetBemInfo } from "./utils";

describe('findProperty', () => {
    it('finds property', () => {
        const block = {
            'key': 'value'
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = findProperty(object, 'key');

        expect(result).toBeDefined();
        expect(result?.type).toEqual('Property');
        expect(result?.key.value).toEqual('key');
    });

    it('returns undefined for missing property', () => {
        const block = {
            'key': 'value'
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = findProperty(object, 'key2');

        expect(result).toBeUndefined();
    });
});


describe('findPropertyValue', () => {
    it('finds property value', () => {
        const block = {
            'key': 'value'
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = findPropertyValue(object, 'key');

        expect(result).toBeDefined();
        expect(result?.type).toEqual('Literal');

        if (result?.type === 'Literal') {
            expect(result?.value?.toString()).toEqual('value');
        }
    });

    it('returns undefined for missing property', () => {
        const block = {
            'key': 'value'
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = findPropertyValue(object, 'key2');

        expect(result).toBeUndefined();
    });
});


describe('getBlockName', () => {
    it('gets block name', () => {
        const block = {
            'block': 'name'
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = getBlockName(object);

        expect(result).toEqual('name');
    });

    it('returns undefined for object without block property', () => {
        const block = {
            'test': 'name'
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = getBlockName(object);

        expect(result).toBeUndefined();
    });
});


describe('findBlocks', () => {
    it('finds blocks by name', () => {
        const block = [{
            'block': 'name'
        }];

        const array = parseJson(JSON.stringify(block)) as JsonToAst.AstArray;

        const result = findBlocks(array, 'name');

        expect(result.length).toEqual(1);
    });

    it('returns empty array if can\'t find block', () => {
        const block = [{
            'block': 'name'
        }];

        const array = parseJson(JSON.stringify(block)) as JsonToAst.AstArray;

        const result = findBlocks(array, 'name2');

        expect(result.length).toEqual(0);
    });
});


describe('findByPath', () => {
    it('finds children by path', () => {
        const block = {
            'block': 'text',
            'mods': { 'type': 'h1' }
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = findByPath(object, 'mods.type');

        expect(result).toBeDefined();
        expect(result?.type).toEqual('Literal');

        if (result?.type === 'Literal') {
            expect(result.value).toEqual('h1');
        }
    });

    it('returns undefined for bad path', () => {
        const block = {
            'block': 'text',
            'mods': { 'type': 'h1' }
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = findByPath(object, 'mods.size');

        expect(result).toBeUndefined();
    });
});


describe('tryGetBemInfo', () => {
    it('gets block info', () => {
        const block = {
            'block': 'name'
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = tryGetBemInfo(object);

        expect(result).toEqual({ block: 'name' });
    });

    it('gets element info', () => {
        const block = {
            'block': 'name',
            'elem': 'elem-name'
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = tryGetBemInfo(object);

        expect(result).toEqual({ block: 'name', elem: 'elem-name' });
    });

    it('returns empty object for object without block property', () => {
        const block = {
            'elem': 'elem-name'
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const result = tryGetBemInfo(object);

        expect(result).toEqual({});
    });

    it('returns empty object if parent mods property', () => {
        const block = {
            'block': 'parent',
            'mods': {
                'block': 'test'
            }
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const property = findProperty(object, 'mods');

        expect(property).toBeDefined();

        if (property && property.value.type === 'Object') {
            const result = tryGetBemInfo(property.value, property);

            expect(result).toEqual({});
        }
    });

    it('returns empty object if parent elemMods property', () => {
        const block = {
            'block': 'parent',
            'elem': 'elem',
            'elemMods': {
                'block': 'test'
            }
        };

        const object = parseJson(JSON.stringify(block)) as JsonToAst.AstObject;

        const property = findProperty(object, 'elemMods');

        expect(property).toBeDefined();

        if (property && property.value.type === 'Object') {
            const result = tryGetBemInfo(property.value, property);

            expect(result).toEqual({});
        }
    });
});
