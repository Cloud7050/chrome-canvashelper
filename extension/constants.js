/* [Exports] */

// [Storage Keys]
export const KEY_DEV_TOOLS = "isDevTools";
export const KEY_DEV_STORAGE = "isDevStorage";

export const KEY_DOWNLOADS = "downloads";
export const KEY_DOWNLOADS_DEV = "downloadsDev";

// [Messages]
export const MESSAGE_DOWNLOADS_CHANGED = "downloadsChanged";

// [Colours]
export const COLOUR_CYAN = "#55FFFF";

// NUS Canvas lighter orange fill
export const COLOUR_HIGHLIGHT = "#EF7C00";
// NUS Canvas grey dark font
export const COLOUR_DULL = "#2D3C45";

// [Page/Link Recognition]
export const DOMAIN_NAME = "canvas.nus.edu.sg";
export const REGEX_DOMAIN = /^https:\/\/(?<domain>.+?)(?:\/.*)?$/u;

export const REGEX_COURSE_ID = /^.+\/courses\/(?<id>\d+)\/files.*$/u;
export const REGEX_FILE_ID = /^.+\/files\/(?<id>\d+)\/download\?download_frd=1$/u;
export const REGEX_QUIZ_ID = /^.+\/courses\/\d+\/quizzes\/(?<id>\d+)$/u;

// [Other]
//NOTE when domain name is made dynamic, ensure bad url inputs don't cause errors

// Disallow additional query string params, eg from verifier of zip download after content export
export const URL_SINGLE_DOWNLOAD = `https://${DOMAIN_NAME}/files/*/download?download_frd=1`;
export const URL_MULTI_DOWNLOAD = `https://${DOMAIN_NAME}/api/v1/courses/*/content_exports`;
