/* [Exports] */
export const DOMAIN_NAME = "canvas.nus.edu.sg";
export const REGEX_CANVAS = new RegExp(`https://${DOMAIN_NAME}`, "u");

export const URL_SINGLE_DOWNLOAD = "https://*/files/*/download?download_frd=1";
export const REGEX_SINGLE_DOWNLOAD = /.+\/files\/(?<id>\d+)\/download\?download_frd=1/u;

export const URL_MULTI_DOWNLOAD = "https://*/api/v1/courses/*/content_exports";

export const REGEX_COURSE_ID = /.+\/courses\/(?<id>\d+)\/files.*/u;

export const KEY_DOWNLOADS = "downloads";
export const KEY_ALL = "timestamp";
