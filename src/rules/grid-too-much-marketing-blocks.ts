import { AstObject } from "json-to-ast";

import { Context } from "../context";
import { Rule } from "../rule";
import { findByPath, findProperty, getBlockName } from "../utils";

export class GridTooMuchMarketingBlocks implements Rule {
    messages = {
        'GRID.TOO_MUCH_MARKETING_BLOCKS': 'Маркетинговые блоки должны занимать не больше половины от всех колонок блока grid'
    };

    create(context: Context) {
        const marketingBlocks = ['commercial', 'offer'];

        const gridBlockInfos = new Array<{
            node: AstObject,
            columns: number,
            marketingBlockColumns: number;
        }>();

        return {
            'Bem:grid:Enter': function (node: AstObject) {
                const columnsEntity = findByPath(node, 'mods.m-columns');

                if (!columnsEntity || columnsEntity.type !== 'Literal') {
                    return;
                }

                const columns = +columnsEntity.value;

                gridBlockInfos.push({
                    node,
                    columns,
                    marketingBlockColumns: 0
                });
            },
            'Bem:grid:Exit': function (node: AstObject) {
                let gridBlockInfo = gridBlockInfos.pop();

                if (gridBlockInfo.marketingBlockColumns > gridBlockInfo.columns / 2) {
                    context.report({
                        node: gridBlockInfo.node,
                        code: 'GRID.TOO_MUCH_MARKETING_BLOCKS'
                    });
                }
            },
            'Bem:grid__fraction': function (node: AstObject) {
                // Проверяем, есть ли content
                const content = findProperty(node, 'content');

                if (!content || content.value.type !== 'Array') {
                    return;
                }

                // Проверяем, есть ли внутренние блоки
                if (content.value.children.length === 0) {
                    return;
                }

                // По условию внутри только один блок
                let innerBlock = content.value.children[0];

                // Проверяем, что это обьект
                if (innerBlock.type !== 'Object') {
                    return;
                }

                const innerBlockName = getBlockName(innerBlock).toString();

                // Получаем размер контента
                const colEntity = findByPath(node, 'elemMods.m-col');

                if (!colEntity || colEntity.type !== 'Literal') {
                    return;
                }

                const col = +colEntity.value;

                if (marketingBlocks.includes(innerBlockName)) {
                    gridBlockInfos[gridBlockInfos.length - 1].marketingBlockColumns += col;
                }
            }
        };
    }
}
