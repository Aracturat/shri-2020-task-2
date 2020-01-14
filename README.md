# Задание 2. Напишите линтер

В этом репозитории находятся решение тестового задания «Напишите линтер» для [16-й Школы разработки интерфейсов](https://yandex.ru/promo/academy/shri) (зима 2020, Москва).

## Используемые инструменты

- json-to-ast
- Typescript
- TsLint
- Jest
- Webpack

## Доступные команды

`npm run build` - сборка production версии скриптов build.

`npm run dev` - запуск сборки в development версии, с автоматической пересборкой при изменении файлов.

`npm run test` - запуск тестов.

`npm run test:watch` - запуск тестов в watch режиме, с автоматическим перезапуском при изменении файлов.

`npm run test:coverage` - запуск тестов с подсчетом покрытия (текущее покрытие по строкам ~ 93 процента).

## Описание решения

Общая идея модульных правил взята из проекта eslint.

### Правила 

Файлы правил лежат в папке `src\rules`. Каждое правило выглядит следущим образом:

```ts
import { AstEntity, AstObject } from "json-to-ast";

import { Context } from "../context";
import { Rule } from "../rule";

export class NewRule implements Rule {
    messages = {
        'NEW_RULE_PROBLEM_CODE': 'Описание проблемы'
    };

    create(context: Context) {
        return {
            'Object': function (node: AstObject, parent: AstEntity | null) {
                ...
            }
        };
    }
}
```

Каждое правило объявляет все возможные сообщения в поле messages.

Основная логика хранится в методе create. Данный метод принимает класс Context 
(в данный момент он содержит только один метод report, позволяющий сообщить об проблеме в json).

Данный метод должен вернуть объект, содержащий информацию об обработчиках узлов AST дерева json файла.
Обработчик узла - это функция, которая будет вызвана на узле при обходе AST дерева в глубину.

Обход в глубину реализован с помощью рекурсии. Была предпринята попытка использовать для данной задачи стек, 
но тесты производительности на файлах из задания 1 показали преимущество рекурсии по времени в несколько раз.

Следует учесть, что функция обработчика может быть вызваны на каждом узле в один из двух моментов:
в первый раз при заходе в узел (далее момент `Enter`), второй раз после обработки всех его потомков (далее момент `Exit`).

Ключи данного объекта соответствуют типам узлов AST дерева с небольшими дополнениями.
Значения данного объекта описывают обработчики, это может быть как одиночная функция, так и массив обработчиков.

Доступны следующие базовые ключи:

- Array - массив
- Object - объект
- Property - свойство объекта
- Identifier - идентификатор свойства
- Literal - литерал

А также набор ключей, созданных для облегчения работы с Bem деревом:
- Bem:block-name - bem блок с именем block-name
- Bem:block-name__elem-name - bem элемент с именем elem-name и блоком block-name

Для того, чтобы разделить моменты Enter и Exit, к вышеописанным ключам нужно добавить `:Enter` или `:Exit`, 
к примеру `Object:Enter` или `Bem:block-name:Exit`. 
Если конкретный момент вызова не указан, то считается, что это момент `Enter`.

### Регистрация правил

Для того, чтобы правило начало использоваться, его надо указать в файле `linter.ts` в функции `getAllRules()`. 
В данный момент линтер содержит все правила для задания 2 и задания 3:

```ts
export function getAllRules(): Array<Rule> {
    return [
        new WarningTextSizesShouldBeEqualRule(),
        new WarningInvalidButtonSizeRule(),
        new WarningInvalidButtonPositionRule(),
        new WarningInvalidPlaceholderSizeRule(),

        new TextSeveralH1Rule(),
        new TextInvalidH2PositionRule(),
        new TextInvalidH3PositionRule(),

        new GridTooMuchMarketingBlocksRule(),

        new BlockNameIsRequiredRule(),
        new UppercaseNamesAreForbiddenRule()
    ];
}
```
