var chat_url = 'https://www.we-collab.eu/feedback/chat/';
var chat_socket_base_url = 'wss://www.we-collab.eu/ws/chat/';

function sendChatMessage(message) {
  var data = { message: message, event_code: app.event_code };
  var body = JSON.stringify(data);
  fetch(chat_url, {
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

//Connect to server via web sockets.
function Connect()
{
  //Check web sockets are supported.
  if (!window.WebSocket) 
  {
    console.log("WebSocket not supported by this browser");
    return;
  }
  chat_socket_url = chat_socket_base_url + app.event_name + '/';
  console.log(chat_socket_url);
  chatSocket = new WebSocket(chat_socket_url);
  chatSocket.onopen = chat_socket_onopen;
  chatSocket.onmessage = chat_socket_onmessage;
  chatSocket.onclose = chat_socket_onclose;
  chatSocket.onerror = chat_socket_onerror;    
}

function chat_socket_onopen() {
  console.log('chat socket open');
}
function chat_socket_onmessage(e) {
  console.log('chat socket message');
  data = JSON.parse(e.data);
  message = data.message;
  text = app.chat_log.GetText();
  text += ('\n' + message);
  app.chat_log.SetText(text);
}
function chat_socket_onclose() {
  console.log('chat socket closed');
}
function chat_socket_onerror() {
  console.log('chat socket error');
}

function chat_OnEnter() {
  app.HideKeyboard();
  message = app.chat_input.GetText().trim();
  sendChatMessage(message);
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

    chatLog = app.CreateText( '', 1, 0.45, "Multiline,Left" );
    chatLog.SetMargins( 0,0.02,0,0 );
    chatLog.SetBackColor("#ff66aa66");
    chatLog.SetTextColor("white");
    chatLog.SetTextSize(24,"ps");
    lay_chat.AddChild( chatLog );
    app.chat_log = chatLog;

    chatInput = app.CreateTextEdit( '', 1, 0.07, "SingleLine, Left" );
    chatInput.SetMargins( 0,0.03,0,0 );
    chatInput.SetBackColor("white");
    chatInput.SetTextColor("black");
    chatInput.SetTextSize(24,"ps");
    chatInput.SetHint( _('chat_input_hint') );
    chatInput.SetOnEnter( chat_OnEnter );
    lay_chat.AddChild( chatInput );
    app.chat_input = chatInput;
    
    Connect();

    return lay_chat;
}
