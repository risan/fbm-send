/**
 * Check if it's a URL.
 *
 * @param {String} url
 * @return {Boolean}
 */
const isUrl = url => /http[s]?:\/\//i.test(url);

module.exports = isUrl;
