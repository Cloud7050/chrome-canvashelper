/* [Imports] */
import { clearDownloads, getDownloads } from "../downloadTracker/storage.js";
import { notifyDownloadsChanged, onDownloadsChanged } from "../messenger.js";
import { getDevStorage, getDevTools, setDevStorage, setDevTools } from "../storage.js";
import { isDevMode, refreshBadge, singularPlural } from "../utilities.js";
/* [Main] */

let downloadsPromise = getDownloads();
let isDevToolsPromise = getDevTools();
let isDevStoragePromise = getDevStorage();

function Popup() {
  let [courseCount, setCourseCount] = React.useState(0);
  let [fileCount, setFileCount] = React.useState(0);
  let [isDevTools, setStateDevTools] = React.useState(false);
  let [isDevStorage, setStateDevStorage] = React.useState(false);

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

  async function downloadsChangedListener() {
    let downloads = await getDownloads();
    refreshDownloads(downloads);
  }

  React.useEffect(() => {
    // Initial load
    downloadsPromise.then(downloads => refreshDownloads(downloads));
    isDevToolsPromise.then(_isDevTools => {
      setStateDevTools(_isDevTools);
    });
    isDevStoragePromise.then(_isDevStorage => {
      setStateDevStorage(_isDevStorage);
    }); // Listener

    onDownloadsChanged(downloadsChangedListener);
  }, // Run once on mount, including adding the listener
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  function devToolsClick(_mouseEvent) {
    isDevTools = !isDevTools;
    setStateDevTools(isDevTools);
    setDevTools(isDevTools);
  }

  async function devStorageClick(_mouseEvent) {
    isDevStorage = !isDevStorage;
    setStateDevStorage(isDevStorage);
    await setDevStorage(isDevStorage);
    refreshBadge();
    notifyDownloadsChanged();
    downloadsChangedListener();
  }

  async function clearDownloadsClick(_mouseEvent) {
    await clearDownloads();
    notifyDownloadsChanged();
    downloadsChangedListener();
  }

  let isNoneTracked = courseCount === 0 && fileCount === 0;
  let skipToolsWarning = isDevTools || isDevMode();
  return /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-dark"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 p-3 bg-light border border-3 rounded"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mb-2"
  }, "Download Tracker"), /*#__PURE__*/React.createElement("div", null, isNoneTracked && /*#__PURE__*/React.createElement(React.Fragment, null, "Nothing tracked yet. Downloads are tracked as you download course files on Canvas."), !isNoneTracked && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, fileCount), " ", singularPlural(fileCount, "file", "files"), " currently tracked across ", /*#__PURE__*/React.createElement("b", null, courseCount), " ", singularPlural(courseCount, "course", "courses"), "."))), /*#__PURE__*/React.createElement("div", {
    className: `p-3 bg-light border border-3 rounded ${isDevTools ? "border-warning" : ""}`
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "form-check form-switch"
  }, /*#__PURE__*/React.createElement("input", {
    id: "devTools",
    "data-bs-target": skipToolsWarning ? null : "#devToolsModal",
    "data-bs-toggle": skipToolsWarning ? null : "modal",
    className: "mt-1-2 form-check-input",
    type: "checkbox",
    checked: isDevTools,
    onClick: skipToolsWarning ? devToolsClick : null
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "devTools",
    className: "mb-0 h3 form-check-label"
  }, "Dev Tools"))), isDevTools && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", {
    className: "my-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-check form-switch"
  }, /*#__PURE__*/React.createElement("input", {
    id: "devStorage",
    className: "form-check-input",
    type: "checkbox",
    checked: isDevStorage,
    onClick: devStorageClick
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "devStorage",
    className: "form-check-label"
  }, "Switch to dev storage"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    "data-bs-target": isDevStorage ? null : "#clearDownloadsModal",
    "data-bs-toggle": isDevStorage ? null : "modal",
    className: "btn btn-danger btn-sm",
    onClick: isDevStorage ? clearDownloadsClick : null
  }, "Clear Tracked Downloads")))), /*#__PURE__*/React.createElement("div", {
    id: "devToolsModal",
    className: "modal fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-dialog-centered modal-dialog-scrollable"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "py-2 modal-body"
  }, "Dev tools are more for development purposes. Messing with them if you aren't sure what they do may irreversibly damage existing data and impact functionality! Are you sure you want to enable dev tools?"), /*#__PURE__*/React.createElement("div", {
    className: "p-1 modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-warning btn-sm",
    "data-bs-dismiss": "modal",
    onClick: devToolsClick
  }, "Enable"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    "data-bs-dismiss": "modal"
  }, "Cancel"))))), /*#__PURE__*/React.createElement("div", {
    id: "clearDownloadsModal",
    className: "modal fade"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-dialog-centered modal-dialog-scrollable"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "py-2 modal-body"
  }, "Extension will forget all Canvas downloads it has tracked you making so far. Files it thinks you haven't downloaded will be highlighted as new until you redownload them. Proceed?"), /*#__PURE__*/React.createElement("div", {
    className: "p-1 modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-danger btn-sm",
    "data-bs-dismiss": "modal",
    onClick: clearDownloadsClick
  }, "Delete All"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary btn-sm",
    "data-bs-dismiss": "modal"
  }, "Cancel"))))));
}

let rootDiv = document.querySelector("#root");
let root = ReactDOM.createRoot(rootDiv);
root.render( /*#__PURE__*/React.createElement(Popup, null));