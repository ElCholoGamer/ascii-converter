#!/usr/bin/env node
import { loadImage } from 'canvas';
import chalk from 'chalk';
import figlet from 'figlet';
import { normalize } from 'path';

import convertToASCII from '../';
import { askFile, askFinalAction, askOptions } from './inquirer';
import { readAllFiles } from './files';
import { Spinner } from 'clui';

console.clear();
console.log(chalk.yellow(figlet.textSync('ASCII Converter')));

(async () => {
	// Get available images
	const regex = /\.(png|jpe?g|ico|gif)$/i;
	const images = (
		await readAllFiles('.', ['node_modules', '.git']).catch(() => [])
	).filter(file => regex.test(file));

	// Ask for file and check if image is valid
	const file = await askFile(images);
	const image = await loadImage(file).catch(() => null);
	if (image === null) {
		return console.log(chalk.red('The provided image path is invalid!'));
	}

	// Ask for options
	const options = await askOptions(image);

	// Show status spinner
	const status = new Spinner('Converting image...');
	status.start();

	try {
		// Convert image to ASCII text
		const ascii = await convertToASCII(normalize(file), options);

		// Done messages
		status.stop();
		console.log(chalk.green.bold('Done!'));

		// Save results and show path
		const path = await askFinalAction(ascii, file);
		console.log(chalk.blue(`ASCII text saved to ${chalk.bold(path)}`));
	} catch (err) {
		console.log(
			chalk.red(`An error occurred! "${err.message || err || 'Unknown error'}"`)
		);
	}
})();
