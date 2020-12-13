/**
 * Options provided for the conversion of
 * an image to ASCII text in this package.
 */
interface ConvertOptions {
	/**
	 * The number of spaces to insert
	 * between characters.
	 *
	 * Default value: `0`
	 */
	spaceChars?: number;

	/**
	 * The width to resize the image to
	 */
	width?: number;

	/**
	 * The height to resize the image to
	 */
	height?: number;

	/**
	 * A custom ASCII character gray scale
	 *
	 * Default value: `' .:-=+*#%@'`
	 */
	grayScale?: string | string[];
}

export default ConvertOptions;
