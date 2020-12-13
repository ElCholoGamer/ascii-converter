import { Image } from 'canvas';
import chalk from 'chalk';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import inquirer, { QuestionCollection } from 'inquirer';
import { join, normalize } from 'path';
import { ConvertOptions } from '../';
import { defaultOptions } from '../options';
import { writeTemplate, writeTextFile } from './files';

export async function askFile(choices: string[]) {
	choices.push('[Choose another file]');

	let { file } = await inquirer.prompt({
		name: 'file',
		type: 'list',
		choices,
		message: 'Select an image to convert:',
	});

	if (file === choices[choices.length - 1]) {
		const { customFile } = await inquirer.prompt({
			type: 'input',
			name: 'customFile',
			message: 'Insert a custom file path:',
			validate: (s: string) =>
				existsSync(normalize(s.trim())) || "This file doesn't exist!",
		});

		file = customFile.trim();
	}

	return file;
}

const validateSize = (minValue: number) => (str: string) => {
	const num = Number(str);
	return (!isNaN(num) && num >= minValue) || 'Invalid number';
};

interface OptionAnswers {
	spaceChars: string;
	grayScale: string;
	width: string;
	height: string;
}

export async function askOptions(
	image: Image
): Promise<ConvertOptions | undefined> {
	const { useCustom } = await inquirer.prompt({
		type: 'confirm',
		name: 'useCustom',
		message: 'Use custom conversion options?',
	});

	if (!useCustom) return undefined;

	const questions: QuestionCollection<OptionAnswers> = [
		{
			name: 'spaceChars',
			type: 'input',
			message: 'Number of spaces to insert between characters:',
			validate: validateSize(0),
			default: defaultOptions.spaceChars,
		},
		{
			name: 'grayScale',
			type: 'input',
			message: 'ASCII gray scale to use for conversion:',
			validate: (s: string) =>
				s.length > 0 || 'Gray scale must be at least 1 character long',
			default: defaultOptions.grayScale,
		},
		{
			name: 'width',
			type: 'input',
			message: 'Width for resizing the image:',
			validate: validateSize(1),
			default: image.width,
		},
		{
			name: 'height',
			type: 'input',
			message: 'Height for resizing the image:',
			validate: validateSize(1),
			default: image.height,
		},
	];

	const { spaceChars, grayScale, width, height } = await inquirer.prompt(
		questions
	);

	return {
		spaceChars: Number(spaceChars),
		grayScale,
		width: Number(width),
		height: Number(height),
	};
}

export async function askDestinationPath(defaultPath?: string) {
	const { path } = await inquirer.prompt({
		type: 'input',
		name: 'path',
		message: 'Insert the file path:',
		default: defaultPath,
		validate: (s: string) => s.trim().length > 0 || 'Invalid file path!',
	});

	return normalize(path.trim());
}

export async function askFinalAction(ascii: string, filename: string) {
	const choices = ['An HTML document', 'A text file'];

	const { action } = await inquirer.prompt({
		name: 'action',
		message: 'Choose where to save the result:',
		type: 'list',
		choices,
	});

	switch (choices.indexOf(action)) {
		case 0:
			// HTML document
			const { fontSize } = await inquirer.prompt({
				type: 'input',
				name: 'fontSize',
				message: "Insert the document's font size:",
				validate: validateSize(1),
				default: 3,
			});

			return await writeTemplate(ascii, filename, fontSize);
		case 1:
			// Text file
			return await writeTextFile(ascii);
		default:
			throw new Error('Invalid final action provided');
	}
}
