node-sync
=========

work in progress.

Node.JS File Manager Outline
____________________________

TODO
Maintain sqlite (written in a wrapper so it can be changed with anything) database database of files

What should be stored in database:
File listing
Host listing
	- Each file can be assigned a host (to download or not - download priority)
	- Speed limits

Rules
	- For handling new files
	- Each host can automatically have files added to it by type, name, location

Running:
- Scan a watch directory, compare files to database, add new files

Have a call access point, when accessed, provides a url for the next file to download (will be served up through the node connection to provide throttling)

Credentials
	- U/P or what?

DL speed throttling
	- Set dl speeds by time of day

Provide GUI front end for flexget + tv episode database for what episodes are left undownloaded

Allow file renaming


Cron job will run on host computer - with an assigned uid by the node application - which at a given interval will contact the node server and request the next file in sequence

