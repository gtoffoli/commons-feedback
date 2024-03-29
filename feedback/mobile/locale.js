var language = 'en';

var string_map = {
  home: { en: "home", it: 'home',},
  validate: { en: "validate session", it: 'valida la sessione',},
  attend: { en: "attend and react", it: 'segui e reagisci',},
  chat: { en: "chat", it: 'chatta',},
  chat_label: { en: "chat log", it: 'conversazione',},
  chat_input_hint: { en: "enter new message here", it: 'inserisci qui un nuovo messaggio',},
  session_info: { en: "session info", it: 'info sulla sessione',},
  website: { en: "website", it: 'sito web',},
  exit: { en: "exit app", it: 'termina',},
  user_label: { en: "user", it: 'utente', },
  event_label: { en: "event", it: 'evento', },
  start_label: { en: "start time", it: 'inizio', },
  end_label: { en: "end time", it: 'fine', },
  warning_label: { en: "warning", it: 'attenzione', },
  error_label: { en: "error", it: 'errore', },
  no_session: { en: "no session is ongoing", it: "nessuna sessione in corso"},
  event_code_new: { en: "new session", it: "nuova sessione"},
  cancel: { en: "Cancel", it:"Annulla"},
  your_email: { en: "Your email", it:"La tua email"},
  your_code: { en: "Your event code", it:"Il tuo codice dell'evento"},
  go_on: { en: "go-on", it:"continua"},
  slower: { en: "slower", it:"più lentamente"},
  louder: { en: "louder", it:"più forte"},
  pause: { en: "pause", it:"pausa"},
  repeat: { en: "repeat", it:"ripeti"},
  explain: { en: "explain", it:"spiega"},
  context: { en: "context", it:"contesto"},
  example:{ en: "example", it:"esempio"},
  recap: { en: "recap", it:"riepilogo"},
}

function _( id ) {
  return string_map[id][language];
}
