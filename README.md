# Issue Analysis Webextension

The Issue Analysis browser extension is a tool to assess issue reports. It distinguishes bugs and non-bugs and can provide a quality rating as well as improvement suggestions for bug reports to the user. After the installation, a star icon appears next to search bar. A click on the icon shows a popup with the assessment results.

The extension is compatible with Firefox and Chrome and requires a server running the [Issue Analysis module](https://github.com/curtys/issue-analysis):
* [Tomcat webapp](https://github.com/curtys/issue-analysis-service)
* [Embedded Jetty server](https://github.com/curtys/issue-analysis-service-embedded)

It may be necessary to configure the service URL. This can be done on the settings page of the add-ons:
* **Firefox:** Menu -> Add-ons -> Issue Analysis -> Preferences
* **Chrome:** Menu -> More tools -> Extensions -> Issue Analysis -> Options

## Build
Requirements:
* npm

Clone the repository and step into the directory. Run
```
npm install
```
to download and install all project dependencies. Then run
```
au build --prod
```
to build the extension.

## License
MIT
