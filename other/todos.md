# Download Tracker

## Short-Term TODOs

- Toggle for which storage to use
- Mark current folder as part of popup, context-dependent
- Confirmation to delete all
- Set up dynamic Canvas URL
- Context menu in multiple appropriate places with similar options as popup. Refactor with page checker utils, context menu class + context menu manager

## Ideas

- Dropdown + enable, to treat all files x time older than now as already downloaded, or disable
- First time installation where storage is empty, then go through setup page of Canvas URL, which files are downloaded (or skip)
- Details on features as built-in page
- Configurable colours
- Downloaded folders' contents are unknown, only have the folder ID. Need to query the API to get the file IDs at the time of download, and recurse for any further folder IDs within
- Support course file downloads from alternative locations like My Files
- Send message to disconnect observers when extension unloads and context invalidates
- Actively look for new files and list them for the user, don't just reactively mark visible files

# Quiz Transferer

## Short-Term TODOs

- Integrate, adapt storage, edit logs
