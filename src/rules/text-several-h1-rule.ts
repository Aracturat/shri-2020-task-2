import { Context } from "../context";
import { AstObject } from "json-to-ast";
import { Rule } from "../rule";
import { findBlocks, findByPath, findProperty, tryGetBemInfo } from "../utils";

export class TextSeveralH1Rule implements Rule {
    messages = {
        'TEXT.SEVERAL_H1': 'Заголовок первого уровня (блок text с модификатором type h1) на странице должен быть единственным'
    };

    create(context: Context) {
        let h1Found = false;

        return {
            'Object': function (node: AstObject) {
                let bemInfo = tryGetBemInfo(node);
                if (bemInfo.block !== 'text') {
                    return;
                }

                // Получаем mods.
                let typeEntity = findByPath(node, 'mods.type');
                if (!typeEntity || typeEntity.type !== 'Literal') {
                    return;
                }

                let type = typeEntity.value.toString();
                if (type !== 'h1') {
                    return;
                }

                if (h1Found) {
                    context.report({
                        node: node,
                        messageId: 'TEXT.SEVERAL_H1'
                    });
                } else {
                    h1Found = true;
                }
            }
        };
    }
}
