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
  React.useEffect(() => {
    isDevStoragePromise.then(realIsDevStorage => {
      setIsDevStorage(realIsDevStorage);
    });
  }, []);

  async function devStorageClick(_mouseEvent) {
    isDevStorage = !isDevStorage;
    setIsDevStorage(isDevStorage);
    await set(KEY_DEV_STORAGE, isDevStorage);
    refreshBadge();
    markAllTabs();
  }

  async function clearDownloadsClick(_mouseEvent) {
    await clearDownloads();
    markAllTabs();
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mb-2"
  }, "Debug"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-check form-switch"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-check-input",
    type: "checkbox",
    checked: isDevStorage,
    onClick: devStorageClick
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "devStorage",
    className: "form-check-label"
  }, "Switch to dev storage"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    "data-bs-target": "#clearDownloadsModal",
    className: "btn btn-danger btn-sm",
    "data-bs-toggle": "modal"
  }, "Clear Tracked Downloads"))), /*#__PURE__*/React.createElement("div", {
    id: "clearDownloadsModal",
    className: "modal fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-dialog-centered modal-dialog-scrollable"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "py-2 modal-body"
  }, /*#__PURE__*/React.createElement("b", null, "Forget all downloads"), " that've been tracked? Extension will not know which files you've already downloaded!"), /*#__PURE__*/React.createElement("div", {
    className: "p-1 modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    "data-bs-dismiss": "modal",
    onClick: clearDownloadsClick
  }, "Clear All"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    "data-bs-dismiss": "modal"
  }, "Cancel"))))));
}

let rootDiv = document.querySelector("#root");
let root = ReactDOM.createRoot(rootDiv);
root.render( /*#__PURE__*/React.createElement(Popup, null));