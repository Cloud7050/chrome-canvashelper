/* [Imports] */
import { KEY_DEV_STORAGE } from "../constants.js";
import { clearDownloads, getDownloads } from "../downloadTracker/storage.js";
import { notifyDownloadsChanged, onDownloadsChanged } from "../messenger.js";
import { get, set } from "../storageSync.js";
import { refreshBadge, singularPlural } from "../utilities.js";



/* [Main] */
let downloadsPromise = getDownloads();
let isDevStoragePromise = get(KEY_DEV_STORAGE);

function Popup() {
	let [courseCount, setCourseCount] = React.useState(0);
	let [fileCount, setFileCount] = React.useState(0);

	let [isDevStorage, setIsDevStorage] = React.useState(false);

	function refreshDownloads(downloads) {
		let _courseCount = Object.keys(downloads).length;
		setCourseCount(_courseCount);

		let _fileCount = 0;
		for (let courseId in downloads) {
			let trackedFileIds = downloads[courseId];
			_fileCount += Object.keys(trackedFileIds).length;
		}
		setFileCount(_fileCount);
	}

	async function _onDownloadsChanged() {
		let downloads = await getDownloads();
		refreshDownloads(downloads);
	}

	React.useEffect(
		() => {
			// Initial load
			downloadsPromise.then(
				(downloads) => refreshDownloads(downloads)
			);
			isDevStoragePromise.then(
				(_isDevStorage) => {
					setIsDevStorage(_isDevStorage);
				}
			);

			// Listener
			onDownloadsChanged(_onDownloadsChanged);
		},
		// Run once on mount, including adding the listener
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	async function devStorageClick(_mouseEvent) {
		isDevStorage = !isDevStorage;
		setIsDevStorage(isDevStorage);

		await set(
			KEY_DEV_STORAGE,
			isDevStorage
		);
		refreshBadge();

		notifyDownloadsChanged();
		_onDownloadsChanged();
	}

	async function clearDownloadsClick(_mouseEvent) {
		await clearDownloads();

		notifyDownloadsChanged();
		_onDownloadsChanged();
	}

	let isNoneTracked = (
		courseCount === 0
		&& fileCount === 0
	);
	return <div className="p-3 bg-dark">
		<div className="mb-3 p-3 bg-light rounded">
			<h3 className="mb-2">
				Download Tracker
			</h3>
			<div>
				{ isNoneTracked &&
					<div>
						Nothing tracked yet. Downloads are tracked as you download course files on Canvas.
					</div>
				}
				{ !isNoneTracked &&
					<div>
						<b>{fileCount}</b> {singularPlural(fileCount, "file", "files")} currently tracked across <b>{courseCount}</b> {singularPlural(courseCount, "course", "courses")}.
					</div>
				}
			</div>
		</div>

		<div className="p-3 bg-light rounded">
			<h3 className="mb-2">
				Debug
			</h3>
			<div className="mb-2">
				<div className="form-check form-switch">
					<input
						className="form-check-input"
						type="checkbox"
						checked={isDevStorage}

						onClick={devStorageClick}
					/>
					<label htmlFor="devStorage" className="form-check-label">Switch to dev storage</label>
				</div>
			</div>
			<div>
				<button
					data-bs-target={isDevStorage ? null : "#clearDownloadsModal"}
					data-bs-toggle={isDevStorage ? null : "modal"}
					className="btn btn-danger btn-sm"

					onClick={isDevStorage ? clearDownloadsClick : null}
				>
					Clear Tracked Downloads
				</button>
			</div>
		</div>

		<div id="clearDownloadsModal" className="modal fade">
			<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
				<div className="modal-content">
					<div className="py-2 modal-body">
						Extension will forget all Canvas downloads it has tracked you making so far. Files it thinks you haven&apos;t downloaded will be highlighted as new until you redownload them. Proceed?
					</div>
					<div className="p-1 modal-footer">
						<button
							className="btn btn-danger btn-sm"
							data-bs-dismiss="modal"

							onClick={clearDownloadsClick}
						>
							Delete All
						</button>
						<button className="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancel</button>
					</div>
				</div>
			</div>
		</div>
	</div>;
}



let rootDiv = document.querySelector("#root");
let root = ReactDOM.createRoot(rootDiv);
root.render(<Popup />);
