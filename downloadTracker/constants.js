/* [Exports] */
export const URL_SINGLE_DOWNLOAD = "https://*/files/*/download?download_frd=1";
export const REGEX_SINGLE_DOWNLOAD = /.+\/files\/(?<id>\d+)\/download\?download_frd=1/u;

export const URL_MULTI_DOWNLOAD = "https://*/api/v1/courses/*/content_exports";

export const REGEX_COURSE_ID = /.+\/courses\/(?<id>\d+)\/files.*/u;

export const KEY_DOWNLOADS = "downloads";
export const KEY_DOWNLOADS_DEV = "downloadsDev";

export const TAG_PROCESSED = "tag-processed";
export const COLOUR_HIGHLIGHT = "var(--ic-brand-global-nav-menu-item__text-color--active)"; // Orange for NUS
export const COLOUR_DULL = "var(--fOyUs-color)"; // Greyish

export const FileStatus = {
	NEW: "new",
	DOWNLOADED_MODIFIED: "downloadedModified",
	DOWNLOADED: "downloaded"
};
