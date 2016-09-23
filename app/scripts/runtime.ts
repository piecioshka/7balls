let EventEmitter = require('super-event-emitter');

// Współdzielony obiekt między stanami.
let runtime: EventEmitter = Object.create(null);

// Rozszerzamy obiekt gry o zdarzenia, aby np. podłączyć statystyki.
EventEmitter.mixin(runtime);

export default runtime;
