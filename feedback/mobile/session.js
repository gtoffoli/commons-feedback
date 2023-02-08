var validate_url = 'https://www.we-collab.eu/feedback/validate/';
app.event_code = '';
app.event_name = '';

// retry argument is true if called from sessionRefresh
function setSession(lay=app.lay_session, retry=false) {
    var sessionObject, data, body;
    var user_email = null, event_code = null;
    if (retry) {
      sessionObject = readPersisted();
      if (sessionObject) {
        user_email = sessionObject.user_email;
        event_code = sessionObject.event_code;
	  }
	} else {
      user_email = this.email.GetText();
      event_code = this.code.GetText();
    }
    if (!user_email || !event_code)
      return;
    data = { event_code: event_code, user_email: user_email };
    body = JSON.stringify( data );
    fetch(validate_url, {
      method: "POST",
      body: body,
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json())
    .then(data => {
      writePersisted( data );
      // sessionRefresh(null);
      sessionRefresh(lay=lay, show_error=true); 
    })
    .catch(err => { app.Debug( err ) });
}

function addSessionInfo(lay) {

  heading = app.CreateText(_('session_info'),1,0.06,"VBottom,Center, Bold");
  heading.SetTextColor("white");
  heading.SetTextSize(32,"ps");
  lay.AddChild(heading);

  // sessionText = app.CreateText('',1,0.14,"VTop,Left,Multiline");
  sessionText = app.CreateText('',1,0.2,"VTop,Left,Multiline");
  sessionText.SetTextColor("white");
  sessionText.SetTextSize(24,"ps");
  sessionText.SetPadding(0.018,0,0.018,0);
  lay.AddChild(sessionText);
  lay.sessionText = sessionText;
}

function sessionScreen() {
  this.lay = app.CreateLayout( "linear", "Vertical, FillXY" );
  addSessionInfo(this.lay)
  sessionRefresh(this.lay, show_error=false);

  var new_code_button = app.CreateButton( _('event_code_new') );
  new_code_button.SetBackColor("#ff66aa66");
  new_code_button.SetTextSize(30,"ps");
  new_code_button.SetOnTouch( ask_OnTouch );
  this.lay.AddChild( new_code_button );

  return this.lay;
}

function formatEventDate(date) {
  return date.substring(0, 10) + ` ` + date.substring(11, 16);
}

// function sessionRefresh() {
function sessionRefresh(lay, show_error=false) {
  if (!show_error)
    setSession(lay=lay, retry=true); // retry session validation with persisted data
  var sessionObject = readPersisted();
  if (sessionObject) {
    app.event_code = sessionObject.event_code;
    app.event_name = sessionObject.event_name;
    app.user_email = sessionObject.user_email;
    if (sessionObject.error)
      if (show_error)
        text = `\n ${_('error_label')}: ${sessionObject.error}`;
      else
        text = `\n ${_('no_session')}`;
    else {
      text  = ` ${_('user_label')}: ${sessionObject.user}\n`;
      text += ` ${_('event_label')}: ${sessionObject.event}\n`;
      text += ` ${_('start_label')}: ${formatEventDate(sessionObject.start)}\n`;
      text += ` ${_('end_label')}: ${formatEventDate(sessionObject.end)}\n\n`;
      if (sessionObject.warning)
        text += ` ${_('warning_label')}: ${sessionObject.warning}`;
    }
  } else
    text = `\n ${_('no_session')}`;
  if (lay === null) {
    app.lay_session.sessionText.SetText(text);
  }
  else
    lay.sessionText.SetText(text);
}

function ask_OnTouch() {
  dialogWidth = 1.0;
  eventDialog = new inputBox("", setSession, dialogWidth);
  eventDialog.SetBackColor("#333333");
  eventDialog.ShowWithKeyboard();
}


/* (see: https://droidscript.org/wiki/doku.php?id=sample_code:inputbox)
   This function returns an input dialog
   title (optional) dialog title, suppressed if empty
   okCallback (required) function called when Ok touched
   width (optional) 0 to 1 used when creating TextBox */
function inputBox(title, okCallback, width)
{
    var options = "NoCancel";
    title = title || "";
    //suppress title line if no title - pass " " to override
    if( title==="") options += ",NoTitle";
 
    // create dialog
    var dlg = app.CreateDialog( title, options );
    var lay = app.CreateLayout( "Linear", "" );
    dlg.AddLayout( lay );
 
    // add edit controls
    var edtEmail = app.CreateTextEdit( "", width );
    edtEmail.SetBackColor("#333333");
    edtEmail.SetTextColor("white");
    edtEmail.SetTextSize(30, "ps");
    edtEmail.SetHint( _("your_email") );
    lay.AddChild( edtEmail );
    var edtCode = app.CreateTextEdit( "", width );
    edtCode.SetBackColor("#333333");
    edtCode.SetTextColor("white");
    edtCode.SetTextSize(30, "ps");
    edtCode.SetHint( _("your_code") );
    lay.AddChild( edtCode );

    
    var layBtn = app.CreateLayout( "Linear", "Horizontal" );
    lay.AddChild( layBtn );
    var btnCancel = app.CreateButton( _("cancel"),-1,-1 );
    btnCancel.SetOnTouch( function() {dlg.Dismiss();} );
    btnCancel.SetBackColor("#ff66aa66");
    btnCancel.SetTextSize(30,"ps");
    layBtn.AddChild( btnCancel );
    var btnOk = app.CreateButton( "Ok",-1,-1 );
    btnOk.SetBackColor("#ff66aa66");
    btnOk.SetTextSize(30,"ps");
    layBtn.AddChild( btnOk );    
    dlg.email = edtEmail;
    dlg.code = edtCode;
    btnOk.SetOnTouch( function() {okCallback.call(dlg); dlg.Dismiss()} );
 
    // public functions
    dlg.ShowKeyboard = function(  )
    {edtEmail.Focus(); app.ShowKeyboard( edtEmail );}

    dlg.ShowWithKeyboard=function()
    {setTimeout(dlg.ShowKeyboard, 100); dlg.Show();}

    return dlg
}
