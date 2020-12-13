# ascii-converter &middot; ![Build][build]

A library for converting images into high-quality ASCII art.

## Installation

You can install this package using [npm][npm] or [yarn][yarn]:

```bash
$ npm i ascii-converter
$ yarn add ascii-converter
```

## Usage

```js
const convertToASCII = require('ascii-converter').default; // CommonJS module
// or:
import convertToASCII from 'ascii-converter'; // ES6 module

convertToASCII('dog.png')
	.then(ascii => console.log(ascii))
	.catch(console.error);
```

## Contributing

You can open pull requests on the project's [GitHub repository][repo], or make issues for major changes.

[build]: https://github.com/ElCholoGamer/ascii-converter/workflows/Build/badge.svg
[npm]: https://www.npmjs.com
[yarn]: https://yarnpkg.com
[repo]: https://github.com/ElCholoGamer/ascii-converter
