/* [Imports] */
import { KEY_DEV_STORAGE } from "../constants.js";
import { clearDownloads } from "../downloadTracker/storage.js";
import { markAllTabs } from "../downloadTracker/utilities.js";
import { get, set } from "../storageSync.js";
import { refreshBadge } from "../utilities.js";



/* [Main] */
let isDevStoragePromise = get(KEY_DEV_STORAGE);

function Popup() {
	let [isDevStorage, setIsDevStorage] = React.useState(false);

	React.useEffect(
		() => {
			isDevStoragePromise.then(
				(realIsDevStorage) => {
					setIsDevStorage(realIsDevStorage);
				}
			);
		},
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

		markAllTabs();
	}

	async function clearDownloadsClick(_mouseEvent) {
		await clearDownloads();

		markAllTabs();
	}

	return <div className="p-3 bg-dark">
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
					data-bs-target="#clearDownloadsModal"
					className="btn btn-danger btn-sm"
					data-bs-toggle="modal"
				>
					Clear Tracked Downloads
				</button>
			</div>
		</div>

		<div id="clearDownloadsModal" className="modal fade">
			<div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
				<div className="modal-content">
					<div className="py-2 modal-body">
						<b>Forget all downloads</b> that&apos;ve been tracked? Extension will not know which files you&apos;ve already downloaded!
					</div>
					<div className="p-1 modal-footer">
						<button
							className="btn btn-danger btn-sm"
							data-bs-dismiss="modal"

							onClick={clearDownloadsClick}
						>
							Clear All
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
