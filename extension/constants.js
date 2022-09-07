/* [Exports] */

// [Storage Keys]
export const KEY_DEV_STORAGE = "isDevStorage";

export const KEY_DOWNLOADS = "downloads";
export const KEY_DOWNLOADS_DEV = "downloadsDev";

// [Colours]
export const COLOUR_CYAN = "#55FFFF";

export const COLOUR_HIGHLIGHT = "#EF7C00"; // NUS Canvas lighter orange fill
export const COLOUR_DULL = "#2D3C45"; // NUS Canvas grey dark font

// [Page/Link Recognition]
export const DOMAIN_NAME = "canvas.nus.edu.sg";
export const REGEX_CANVAS = new RegExp(`https://${DOMAIN_NAME}`, "u");

export const REGEX_COURSE_ID = /^.+\/courses\/(?<id>\d+)\/files.*$/u;
export const REGEX_FILE_ID = /^.+\/files\/(?<id>\d+)\/download.*$/u;
export const REGEX_QUIZ_ID = /^.+\/courses\/\d+\/quizzes\/(?<id>\d+)$/u;

// [Other]
export const URL_SINGLE_DOWNLOAD = "https://*/files/*/download*";
export const URL_MULTI_DOWNLOAD = "https://*/api/v1/courses/*/content_exports";
