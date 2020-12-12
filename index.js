const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');
const { readFile } = require('fs/promises');

(async () => {
	const [maxWidth, maxHeight] = [256, 256];

	// Load and resize image
	const buffer = await readFile(process.argv[2] || 'img.png');
	const image = await loadImage(buffer);
	let { width, height } = image;

	if (width > maxWidth) {
		const diff = maxWidth / width;
		width *= diff;
		height *= diff;
	}

	if (height > maxHeight) {
		const diff = maxHeight / height;
		height *= diff;
		width *= diff;
	}

	// Create canvas
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Draw image on canvas
	const finalBuffer = await sharp(buffer).resize(width, height).toBuffer();
	const finalImage = await loadImage(finalBuffer);
	ctx.drawImage(finalImage, 0, 0, width, height);

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
			acc[acc.length - 1] *= val / 255;
			acc[acc.length - 1] /= 255 * 3;
		} else {
			// GB
			acc[acc.length - 1] += val;
		}

		return acc;
	}, []);

	// Transform into pixeñ rows
	const rows = [];
	for (let i = 0; i < pixels.length; i += width) {
		rows.push(pixels.slice(i, i + width));
	}

	const chars = ' .:-=+*#%@';

	const lines = rows.map(row =>
		row.reduce(
			(acc, val) => acc + chars[Math.round(val * (chars.length - 1))],
			''
		)
	);

	lines.forEach(line =>
		console.log(
			line
				.split('')
				.map(e => `${e} `)
				.join('')
		)
	);
})();
