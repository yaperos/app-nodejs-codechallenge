/**
 * custom jest transformer https://facebook.github.io/jest/docs/en/configuration.html#transform-object-string-string
 * e.x. ('<svg>some stuff</svg>', '.../my-icon.svg') => function MyIcon(props) { return <svg {...props}/>; }
 * this is useful for rendering snapshots because it will appear as <SvgMyIcon /> in the .snap
 * @param src {string} full text of the file being read
 * @param filePath {string} full path to the file
 * @returns {string} the transformed svg file
 */
declare function process(src: string, filePath: string): string;
export default process;
