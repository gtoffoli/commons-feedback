var language = 'en';

var string_map = {
  session_info: { en: "session info", it: 'informazione sulla sessione',},
  user_label: { en: "user", it: 'utente', },
  event_label: { en: "event", it: 'evento', },
  no_session: { en: "no session is ongoing",},
  event_code_prompt: { en: "enter/change your personal event code",},
  event_code_new: { en: "new session",},
}

function _( id ) {
  return string_map[id][language];
}
