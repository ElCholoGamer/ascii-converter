import chalk from 'chalk';
import { existsSync } from 'fs';
import { readdir, readFile, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { askDestinationPath } from './inquirer';

export async function readAllFiles(folder: string, ignore: string[] = []) {
	const files = (await readdir(folder)).filter(file => !ignore.includes(file));
	const result: string[] = [];

	await Promise.all(
		files.map(async file => {
			const path = join(folder, file);
			const fileStat = await stat(path);

			if (fileStat.isDirectory()) {
				const children = await readAllFiles(path);
				result.push(...children);
			} else {
				result.push(path);
			}
		})
	);

	return result;
}

export async function writeTemplate(
	ascii: string,
	title: string,
	fontSize: string
) {
	const templatePath = join(__dirname, '../../assets/template.html');
	if (!existsSync(templatePath)) {
		return chalk.red('The template file was not found!');
	}

	const template = (await readFile(templatePath)).toString();
	ascii = ascii.replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>');

	const finalContent = template
		.replace('%TITLE%', title)
		.replace('%BODY%', ascii)
		.replace('%FONTSIZE%', fontSize);

	const path = await askDestinationPath('index.html');
	await writeFile(path, finalContent + '\n');

	return path;
}

export async function writeTextFile(ascii: string) {
	const path = await askDestinationPath();
	await writeFile(path, ascii + '\n');

	return path;
}
