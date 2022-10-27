function sendChatMessage(message) {
  var data = { message: message, event_code: app.event_code };
  var body = JSON.stringify(data);
  fetch("https://www.we-collab.eu/feedback/chat/", {
      method: "POST",
      body: body,
      headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .then(response => response.json()) 
  .then(data => {
      console.log(data);
  })
  .catch(err => console.log(err));
}

function chat_OnEnter() {
  app.HideKeyboard();
  sendChatMessage(app.chat_input.GetText());
  app.chat_input.SetText('');
}

function addChat() {
    //Create a layout with objects vertically centered.
    lay_chat = app.CreateLayout( "linear", "Vertical,FillXY" );

    addSessionInfo(lay_chat);
    sessionRefresh(lay_chat);

    chatHeading = app.CreateText(_('chat_label'),1,0.06,"VBottom,Center, Bold");
    chatHeading.SetTextColor("white");
    chatHeading.SetTextSize(32,"ps");
    lay_chat.AddChild(chatHeading);

    chatLog = app.CreateText( '', 1, 0.4, "Multiline,Left" );
    chatLog.SetMargins( 0,0.02,0,0 );
    chatLog.SetBackColor("#ff66aa66");
    chatLog.SetTextColor("white");
    chatLog.SetTextSize(24,"ps");
    lay_chat.AddChild( chatLog );
 
    chatInput = app.CreateTextEdit( '', 1, 0.1, "Left,NoSpell" );
    chatInput.SetMargins( 0,0.04,0,0 );
    // chatInput.SetBackColor("#ff66aa66");
    // chatInput.SetTextColor("white");
    chatInput.SetBackColor("white");
    chatInput.SetTextColor("black");
    chatInput.SetTextSize(24,"ps");
    chatInput.SetHint( _('chat_input_hint') );
    chatInput.SetOnEnter( chat_OnEnter );
    lay_chat.AddChild( chatInput );
    app.chat_input = chatInput;

    return lay_chat;
}
