import { Context } from "../context";
import { AstObject } from "json-to-ast";
import { Rule } from "../rule";
import { findBlocks, findByPath, findProperty } from "../utils";

export class WarningInvalidButtonSize implements Rule {
    messages: {
        'WARNING.INVALID_BUTTON_SIZE': 'Размер кнопки блока warning должен быть на 1 шаг больше эталонного'
    };

    create(context: Context) {
        let sizes = {
            xxxs: 0,
            xxs: 1,
            s: 2,
            m: 3,
            l: 4,
            xl: 5,
            xxl: 6,
            xxxl: 7,
            xxxxl: 8,
            xxxxxl: 9
        };

        return {
            'Block:warning': function (node: AstObject) {
                // Проверяем, есть ли content.
                const content = findProperty(node, 'content');

                if (!content || content.value.type !== 'Array') {
                    return;
                }

                // Проверяем, есть ли блоки text.
                let textBlocks = findBlocks(content.value, 'text');

                if (textBlocks.length == 0) {
                    return;
                }

                // Проверяем, есть ли блоки button.
                let buttonBlocks = findBlocks(content.value, 'button');

                if (buttonBlocks.length == 0) {
                    return;
                }

                // Пытаемся получить размер текста.
                let sizeEntity = findByPath(textBlocks[0], 'mods.size');

                if (!sizeEntity || sizeEntity.type !== 'Literal') {
                    return;
                }

                let textSize = sizeEntity.value.toString();

                // Сравниваем размеры кнопок
                for (let buttonBlock of buttonBlocks) {
                    let sizeEntity = findByPath(buttonBlock, 'mods.size');

                    if (!sizeEntity || sizeEntity.type !== 'Literal') {
                        continue;
                    }

                    let buttonBlockSize = sizeEntity.value.toString();

                    if (sizes[buttonBlockSize] - sizes[textSize] !== 1) {
                        context.report({
                            node: buttonBlock,
                            messageId: 'WARNING.INVALID_BUTTON_SIZE'
                        });
                    }
                }
            }
        };
    }
}
