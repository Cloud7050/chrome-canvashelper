# Download Tracker

- Set up dynamic Canvas URL
- Mark current folder as part of popup, context-dependent
- Downloaded folders' contents are unknown, only have the folder ID. Need to query the API to get the file IDs at the time of download, and recurse for any further folder IDs within
- Support course file downloads from alternative locations like My Files
- Send message to disconnect observers when extension unloads and context invalidates
- Actively look for new files and list them for the user, don't just reactively mark visible files

# Quiz Transferer

- Integrate, adapt storage, edit logs
