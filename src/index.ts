import { createCanvas, loadImage } from 'canvas';

const grayscale = ' .:-=+*#%@';

/**
 * Converts the given image path of buffer
 * to an ASCII text string.
 * @param src The image path or buffer
 */
async function convertToASCII(src: string | Buffer) {
	const image = await loadImage(src);
	const { width, height } = image;

	// Create canvas
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	// Draw image on canvas
	ctx.drawImage(image, 0, 0, width, height);

	// Get image data
	const { data } = ctx.getImageData(0, 0, width, height);

	// Transform into pixel brightness array
	const pixels = data.reduce<number[]>((acc, val, index) => {
		const pos = index % 4; // Position in RGBA

		if (pos === 0) {
			// Case R
			acc.push(val);
		} else if (pos === 3) {
			// Case A
			acc[acc.length - 1] /= 255 * 3;
			acc[acc.length - 1] *= val / 255;
		} else {
			// Case GB
			acc[acc.length - 1] += val;
		}

		return acc;
	}, []);

	// Transform into pixel rows
	const rows = [];
	for (let i = 0; i < pixels.length; i += width) {
		rows.push(pixels.slice(i, i + width));
	}

	const lines = rows.map(row =>
		row.reduce(
			(acc, val) => acc + grayscale[Math.floor(val * (grayscale.length - 1))],
			''
		)
	);

	const text = lines.join('\n');
	return text;
}

export default convertToASCII;
