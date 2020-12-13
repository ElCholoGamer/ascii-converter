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

interface IDefaultOptions extends ConvertOptions {
	spaceChars: number;
	grayScale: string;
}

/**
 * Default values to be provided
 * when converting an image to
 * ASCII text, if not present.
 */
export const defaultOptions: IDefaultOptions = {
	spaceChars: 0,
	grayScale: ' .:-=+*#%@',
};

export default ConvertOptions;
