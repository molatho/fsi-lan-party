# FS-I LAN-Party

> Ein NodeJS-Backend und Vue.js-Frontend

Die Backend- und Frontend-Lösungen können einfach separat in Visual Studio Code als Ordner geöffnet werden.

## Debugging
### Backend
Einfach in VS Code öffnen und mit Bordmitteln Debuggen (`F5`).
### Frontend
Das Frontend mit `npm start` ausführen und die [Vue-Erweiterung](https://github.com/vuejs/vue-devtools#vue-devtools) im Browser nutzen, um Nutzdaten und Komponenten zu analysieren.

## Deployment
```
cd ./backend
npm install
cd ../frontend
npm install
npm run-script build
cd ../backend
node app.js
```
Beschreibung:
* Dependencies des Backends und Frontends installieren
* Frontend compilen
* Backend starten


## Resourcen
* [BootstrapVue](https://github.com/bootstrap-vue/bootstrap-vue)
    * [Bootstrap 4](https://github.com/twbs/bootstrap)
    * [Vue.js](https://vuejs.org)
* [NodeJS v8.9.1 & npm@6.9.0](https://nodejs.org/)