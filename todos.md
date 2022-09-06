# Download Tracker

## Short-Term TODOs

- Mark current folder as part of popup, context-dependent
- Set up dynamic Canvas URL
- Context menu in multiple appropriate places with similar options as popup. Context menu class + context menu manager

## Ideas

- Dropdown + enable, to treat all files **available** x time older than now as already downloaded, or disable
	- Effective download timestamp is download timestamp, or if not exists then assumed timestamp
		- If really downloaded then assumed timestamp is moved forward, download timestamp may be older than would-be assumed timestamp
	- For timed release, effective creation timestamp is max of creation and release timestamps
		- If downloaded after release then release date is moved forward, download timestamp may be older than effective creation timestamp
- Toggle to hide modified date if same as created
	- Undownloaded: Still highlight created date (older), modified may or may not be hidden
	- Downloaded but modified: Still highlight modified date (newer), modified will be shown as download timestamp would be between created and modified
	- Downloaded: Instead of always modified, highlight newer (modified, or if hidden then created)
- Toggle for dates to relative d h m ago
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
