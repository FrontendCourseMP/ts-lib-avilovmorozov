# ts-val — валидация форм на HTML5

Небольшая обёртка над нативной HTML5-валидацией. Позволяет описывать правила для инпутов цепочками методов и запускать проверку при отправке формы.

# Участники:
Морозов Владислав Алексеевич
Авилов Иван Дмитриевич

## Установка и запуск
- `npm install`
- `npm run dev` — режим разработки (Vite)
- `npm run build` — сборка
- `npm run preview` — предпросмотр сборки
- `npm run test` — тесты (vitest)
- `npm run lint` — eslint

## Быстрый старт
Разметка формы должна соблюдать требования: у каждого `input` есть `name`, хотя бы один `<label>`, атрибут `aria-describedby` с привязанным `<span id="...">` для вывода ошибки.

Пример (`index.html`):
```html
<form novalidate class="form__main" id="auth">
  <div class="input__container">
    <label for="phone" class="input__label">Номер телефона</label>
    <input class="input__main" name="phone" id="phone"
      aria-describedby="phone-error" type="text" required
      pattern="\+\d-\d{3}-\d{3}-\d{4}">
    <span class="input__error" id="phone-error"></span>
  </div>

  <div class="input__container">
    <label for="password" class="input__label">Пароль</label>
    <input class="input__main" name="password" id="password"
      aria-describedby="password-error" type="text" required>
    <span class="input__error" id="password-error"></span>
  </div>

  <button class="form__button" type="submit">Отправить</button>
</form>
```

Инициализация (`src/index.ts`):
```ts
import * as z from "./lib";

const authForm = document.querySelector("#auth") as HTMLFormElement;
const authValidator = z.form(authForm);

authValidator
  .field("phone")
  .string()
  .pattern("Введите корректный номер")
  .required("Заполните поле");

authValidator.validate((data) => console.log(Object.fromEntries(data)));
```

## API
### form(element)
Создаёт валидатор для формы.

### .field(name)
Возвращает объект `Input` для поля `name`. Бросит ошибку, если поле не найдено или отсутствуют обязательные атрибуты (`name`, `label`, `aria-describedby`).

### Методы Input
- `.string()` — ожидает `type="text"`, иначе ошибка.
- `.number()` — ожидает `type="number"`.
- `.required(message)` — включает правило `required`, сохраняет текст ошибки.
- `.pattern(message)` — использует атрибут `pattern`, текст ошибки `message`.
- `.min(message)` — для `type="number"/"range"` использует атрибут `min`; иначе `minlength`.
- `.max(message)` — для `type="number"/"range"` использует атрибут `max`; иначе `maxlength`.

### .validate(callback)
Добавляет обработчик `submit`. Если все поля валидны — вызывает `callback(FormData)`. Сообщения об ошибках записываются в связанный `span#aria-describedby`.

## Правила вёрстки
- Всегда задавайте `name` и `id` для инпута.
- Обязательно `aria-describedby` указывает на `span` с ошибкой.
- У инпута должен быть `<label>` (или несколько).
- Для правил `.min/.max/.pattern/.required` соответствующие атрибуты должны присутствовать.

## Стили
Базовые стили формы лежат в `src/styles.css`; при желании замените на свои. Их подключение уже есть в `src/index.ts`.