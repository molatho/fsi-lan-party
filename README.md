# FS-I LAN-Party

> Ein NodeJS-Backend und Vue.js-Frontend

Die Backend- und Frontend-Lösungen können einfach separat in Visual Studio Code als Ordner geöffnet werden.

## Debugging
### Backend
Einfach in VS Code öffnen und mit Bordmitteln Debuggen (`F5`).
### Frontend
Das Frontend mit `npm start` ausführen und die [Vue-Erweiterung](https://github.com/vuejs/vue-devtools#vue-devtools) im Browser nutzen, um Nutzdaten und Komponenten zu analysieren.

## Deployment
1. Das Frontend bauen mit `node build/build.js` in `/frontend`
2. Build-Ergebnis aus `/frontend/dist` nach `/backend/public` kopieren
3. Backend starten mit `npm start` (oder `node ./app.js`) in `/backend`