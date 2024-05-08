# Ecobee Data Collector

***This project is not affiliated with the Ecobee company. All data is collected from the publicly available Ecobee API and has been tested on a legally purchased device.*

---

### Overview

I created this app because I was curious about smart-home gadgets and wanted to see what they could really do. I got myself an Ecobee Smart Thermostat and found out that it has a surprisingly versatile public API, which seemed like a fun thing to play around with.

The app works as a local, self-sufficient data collector. "Self-sufficient" meaning it automatically refreshes the API tokens when they expire, so it keeps running smoothly. It grabs thermostat data from the API whenever a cron job goes off, which checks for any changes in the thermostat's setup. For data storage, I'm using a Raspberry Pi 4 with a Docker container running MariaDB—it’s a pretty solid setup for this kind of thing.