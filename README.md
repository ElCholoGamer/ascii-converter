# ascii-converter &middot; ![Build][build]

A library for converting images into high-quality ASCII art.

It includes a command line interface (CLI) to convert images directly from the Command Prompt.

## Installation

You can install this package using [npm][npm] or [yarn][yarn]:

Locally:

```bash
$ npm i ascii-converter
$ yarn add ascii-converter
```

Globally:

```bash
$ npm i -g ascii-converter
$ yarn global add ascii-converter
```

## Usage

```javascript
const convertToASCII = require('ascii-converter').default; // CommonJS module
// or:
import convertToASCII from 'ascii-converter'; // ES6 module

/**
 * Converts the local image "dog.png"
 * into ASCII text, and logs it on
 * the console.
 */
convertToASCII('dog.png')
	.then(ascii => console.log(ascii))
	.catch(console.error);
```

To use the CLI, this package must be installed globally. Then, you can run the following command:

```bash
$ ascii
```

This should show a menu to select a local image.

## Contributing

You can open pull requests on the project's [GitHub repository][repo], or make issues for major changes.

[build]: https://github.com/ElCholoGamer/ascii-converter/workflows/Build/badge.svg
[npm]: https://www.npmjs.com
[yarn]: https://yarnpkg.com
[repo]: https://github.com/ElCholoGamer/ascii-converter
