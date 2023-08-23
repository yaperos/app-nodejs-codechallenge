/**
 * creates valid javascript identifiers from strings with dashes in them
 * '/home/user/project/my-icon-kappa.svg' => SvgMyIconKappa
 * 'my.icon.kappa' => MyIconKappa
 * 'my icon kappa' => MyIconKappa
 * @param str {string} a string with dashes in it
 * @returns {string} camelcased with non-word characters removed
 */
declare function escapeFileName(str: string): string;
export default escapeFileName;
