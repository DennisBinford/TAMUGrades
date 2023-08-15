In order for this script to work you must put your own MongoDB connection link in databaselink.py and the path to the process folder.
The path to the process folder does not need to be changed if running main.py from the folder main.py is being run from, if you refactor it will need to be changed.

Currently this populates the database every 10 files and has no saving mechanism or parsing out failing pdfs, use process folder with a lot of pdfs when confident none will fail

Things that can be added at a future time if time permits:
- add variable to change frequency of populating MongoDB documents from files
- add logic to save the file if it works, and to put in in fail if it failed