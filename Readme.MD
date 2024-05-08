# Ecobee Data Collector

***This project is not affiliated with the Ecobee company. All data is collected from the publicly available Ecobee API and has been tested on a legally purchased device.*

---

### Overview

I created this app because I was curious about smart-home gadgets and wanted to see what they could really do. I got myself an Ecobee Smart Thermostat and found out that it has a surprisingly versatile public API, which seemed like a fun thing to play around with.

The app works as a local, self-sufficient data collector. "Self-sufficient" meaning it automatically refreshes the API tokens when they expire, so it keeps running smoothly. It grabs thermostat data from the API whenever a cron job goes off, which checks for any changes in the thermostat's setup. For data storage, I'm using a Raspberry Pi 4 with a Docker container running MariaDB—it’s a pretty solid setup for this kind of thing.

#

#### Tech Stack
- NodeJs
- MariaDB
- Docker
- PiOS

---

## Setup (Application)

*To setup the application, ensure that you have NodeJS installed on your machine - this will allow you to run any NPM commands.*

1. Clone or download this repository to your local machine. If you download the ZIP file, be sure to extract it and keep track of where you store it.
2. Open your preferred command-line interface and navigate to the folder where the application is located.
3. Once you're in the correct directory, run `npm install` to install the necessary dependencies.
4. Sign up for an Ecobee Developer account and get your API key.
5. Create a file named .env in the root of your project, and add your API key to it using the key "API_KEY". For example, `API_KEY=your_api_key_here`.
6. Now you're set to run the application! Simply type `npm run dev` to start it.
