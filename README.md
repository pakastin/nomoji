# nomoji
Replace emojis in text with SVG images

## installation
```bash
npm i nomoji
```

## usage
`nomoji(text, [prefix], [disableSanitation])`
```js
nomoji('Hello from 🇫🇮')
```
```html
Hello from <img draggable="false" class="emoji" src="svg/1f1eb_1f1ee.svg">
```
The optional prefix parameter defines where to find image files
```js
nomoji('Hello from 🇫🇮', 'nomoji/')
```
```html
Hello from <img draggable="false" class="emoji" src="nomoji/svg/1f1eb_1f1ee.svg">
```
The optional disableSanitation parameter disables HTML sanitation
```js
nomoji('Hello <b>HTML</b> 🤩!');
```
```html
Hello &#60;b&#62;HTML&#60;/b&#62; <img draggable="false" class="emoji" src="svg/1f929.svg">!
```
```js
nomoji('Hello <b>HTML</b> 🤩!', null, true);
```
```html
Hello <b>HTML</b> <img draggable="false" class="emoji" src="dist/svg/1f929.svg">!
```
