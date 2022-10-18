var validate_url = 'https://www.we-collab.eu/feedback/validate/';
app.event_code = '';

// function setSession(edt) {
function setSession(dlg) {
    // var event_code = this.GetText();
    var user_email = this.email.GetText();
    var event_code = this.code.GetText();
    // var data = { event_code: event_code };
    var data = { event_code: event_code, user_email: user_email };
    var body = JSON.stringify( data );
    fetch(validate_url, {
      method: "POST",
      body: body,
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json())
    .then(data => {
      writePersisted( data );
      sessionRefresh(null);
    })
    .catch(err => { app.Debug( err ) });
}

function addSessionInfo(lay) {

  heading = app.CreateText(_('session_info'),1,0.06,"VBottom,Center, Bold");
  heading.SetTextColor("white");
  heading.SetTextSize(32,"ps");
  lay.AddChild(heading);

  sessionText = app.CreateText('',1,0.14,"VTop,Left,Multiline");
  sessionText.SetTextColor("white");
  sessionText.SetTextSize(30,"ps");
  lay.AddChild(sessionText);
  lay.sessionText = sessionText;
}

function sessionScreen() {
  this.lay = app.CreateLayout( "linear", "Vertical, FillXY" );
  addSessionInfo(this.lay)
  sessionRefresh(this.lay);

  var new_code_button = app.CreateButton( _('event_code_new') );
  new_code_button.SetBackColor("#ff66aa66");
  new_code_button.SetTextSize(30,"ps");
  new_code_button.SetOnTouch( ask_OnTouch );
  this.lay.AddChild( new_code_button );

  return this.lay;
}

function sessionRefresh(lay) {
  var sessionObject = readPersisted();
  if ( sessionObject ) {
    app.event_code = sessionObject.event_code;
    app.user_email = sessionObject.user_email;
    // text = `  ${_('user_label')}: ${sessionObject.user}\n  ${_('event_label')}: ${sessionObject.event}`;
    text  = ` ${_('user_label')}: ${sessionObject.user}\n`;
    text += ` ${_('event_label')}: ${sessionObject.event}\n`;
    text += ` ${_('start_label')}: ${sessionObject.start}\n`;
    text += ` ${_('end_label')}: ${sessionObject.end}\n`;
    if (sessionObject.warning)
      text += ` ${_('warning_label')}: ${sessionObject.warning}`;
  } else
    text = _('no_session');
  if (lay === null) {
    app.lay_session.sessionText.SetText(text);
  }
  else
    lay.sessionText.SetText(text);
}

function ask_OnTouch() {
  dialogTitle = _('event_code_prompt');
  // var lay = app.CreateLayout( "Linear", "" );
  dialogWidth = 1.0;
  // eventDialog = new inputBox(dialogTitle, setSession, app.event_code, dialogWidth);
  eventDialog = new inputBox(dialogTitle, setSession, dialogWidth);
  eventDialog.SetBackColor("#333333");
  //eventDialog.SetTextColor("white");
  eventDialog.ShowWithKeyboard();
}


/* (see: https://droidscript.org/wiki/doku.php?id=sample_code:inputbox)
   This function returns an input dialog
   title (optional) dialog title, suppressed if empty
   okCallback (required) function called when Ok touched
   width (optional) 0 to 1 used when creating TextBox */
// function inputBox(title, okCallback, hint, width)
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
    // btnOk.SetOnTouch( function() {okCallback.call(edtCode); dlg.Dismiss()} );
    dlg.email = edtEmail;
    dlg.code = edtCode;
    btnOk.SetOnTouch( function() {okCallback.call(dlg); dlg.Dismiss()} );
 
    // public functions
    dlg.ShowKeyboard = function(  )
    {edtCode.Focus(); app.ShowKeyboard( edtCode );}

    dlg.ShowWithKeyboard=function()
    {setTimeout(dlg.ShowKeyboard, 100); dlg.Show();}

    return dlg
}
