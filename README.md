# Чужая свадьба — premium / GitHub Pages

Статический сайт: HTML + CSS + JavaScript + БЭМ.

## Отправка заявок на почту

Для формы используется Formspree. GitHub Pages остаётся обычным статическим хостингом, а Formspree принимает POST-запрос и отправляет заявку на настроенный email.

### 1. Создай форму в Formspree

Открой https://formspree.io/ и создай аккаунт.

После создания формы Formspree покажет endpoint вида:

https://formspree.io/f/xxxxxxxx

### 2. Замени Form ID

В `index.html` найди:

`action="https://formspree.io/f/ВАШ_FORM_ID"`

и замени `ВАШ_FORM_ID` на ID своей формы.

Например:

`action="https://formspree.io/f/xabcdefg"`

### 3. Проверь Target Email

В настройках формы Formspree укажи почту, на которую должны приходить заявки, и подтверди её, если сервис попросит это сделать.

### 4. Опубликуй на GitHub Pages

Загрузи файлы в репозиторий GitHub и включи:

Settings → Pages → Deploy from a branch → main → / (root)

GitHub Pages публикует статические HTML/CSS/JS-файлы напрямую из репозитория.

## Какие данные отправляются

- name — имя гостя
- role — выбранная роль
- attendance — участие
- message — комментарий
- _subject — тема письма

Также добавлено honeypot-поле `_gotcha` для базовой защиты от автоматического спама.

## Важно

Formspree endpoint можно спокойно хранить в публичном HTML: это идентификатор формы, а не секретный API-ключ.

Для реального проекта дополнительно можно добавить:
- Telegram-уведомление;
- сохранение заявок в Google Sheets;
- подтверждающее письмо гостю;
- защиту от повторных заявок;
- отдельную страницу «Спасибо».
