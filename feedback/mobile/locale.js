var language = 'en';

var string_map = {
  home: { en: "home", it: 'home',},
  validate: { en: "validate session", it: 'valida la sessione',},
  attend: { en: "attend and react", it: 'segui e reagisci',},
  session_info: { en: "session info", it: 'informazione sulla sessione',},
  website: { en: "website", it: 'sito web',},
  exit: { en: "exit app", it: 'termina',},
  user_label: { en: "user", it: 'utente', },
  event_label: { en: "event", it: 'evento', },
  no_session: { en: "no session is ongoing", it: "nessuna sessione è in corso"},
  event_code_prompt: { en: "enter/change your event code", it: "digita/cambia il tuo codice dell'evento"},
  event_code_new: { en: "new session", it: "nuova sessione"},
  cancel: { en: "Cancel", it:"Abbandona"},
  your_code: { en: "Your code", it:"il tuo codice"},
  go_on: { en: "go on", it:"continua"},
  slower: { en: "slower", it:"più lentamente"},
  louder: { en: "louder", it:"più forte"},
  pause: { en: "pause", it:"pausa"},
  repeat: { en: "repeat", it:"ripeti"},
  explain: { en: "explain", it:"spiega"},
  context: { en: "context", it:"contesto"},
  example:{ en: "example", it:"esempio"},
  recap: { en: "recap", it:"riepiloga"},
}

function _( id ) {
  return string_map[id][language];
}
