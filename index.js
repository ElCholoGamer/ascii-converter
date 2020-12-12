const { createCanvas, loadImage } = require('canvas');
const { writeFile, readFile } = require('fs/promises');

(async () => {
	const image = await loadImage(process.argv[2] || 'img.png');
	let { width, height } = image;

	// Create canvas
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Draw image on canvas
	ctx.drawImage(image, 0, 0, width, height);

	// Get image data
	const { data } = ctx.getImageData(0, 0, width, height);

	// Transform into pixel brightness array
	const pixels = data.reduce((acc, val, index) => {
		const pos = index % 4;

		if (pos === 0) {
			// R
			acc.push(val);
		} else if (pos === 3) {
			// A
			acc[acc.length - 1] /= 255 * 3;
			acc[acc.length - 1] *= val / 255;
		} else {
			// GB
			acc[acc.length - 1] += val;
		}

		return acc;
	}, []);

	// Transform into pixel rows
	const rows = [];
	for (let i = 0; i < pixels.length; i += width) {
		rows.push(pixels.slice(i, i + width));
	}

	const chars = ' .:-=+*#%@';

	const lines = rows.map(row =>
		row.reduce(
			(acc, val) => acc + chars[Math.floor(val * (chars.length - 1))],
			''
		)
	);

	const text = lines.map(l => l.split('').join(' ')).join('\n');
	const template = (await readFile('template.html')).toString();
	await writeFile(
		'index.html',
		template.replace(
			'%BODY%',
			text.split('\n').join('<br>').replace(/ /g, '&nbsp;')
		)
	);
	console.log(text);
})();
