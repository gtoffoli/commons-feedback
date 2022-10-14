var validate_url = 'https://www.we-collab.eu/feedback/validate/';
app.event_code = '';

function setSession(edt) {
    var event_code = this.GetText();
    var data = { event_code: event_code }
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
    text = `  ${_('user_label')}: ${sessionObject.user}\n  ${_('event_label')}: ${sessionObject.event}`;
    app.event_code = sessionObject.event_code;
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
  eventDialog = new inputBox(dialogTitle, setSession, app.event_code, dialogWidth);
  eventDialog.SetBackColor("#333333");
  //eventDialog.SetTextColor("white");
  eventDialog.ShowWithKeyboard();
}


/* (see: https://droidscript.org/wiki/doku.php?id=sample_code:inputbox)
   This function returns an input dialog
   title (optional) dialog title, suppressed if empty
   okCallback (required) function called when Ok touched
   hint (optional) empty string displays no hint
   width (optional) 0 to 1 used when creating TextBox */
function inputBox(title, okCallback, hint, width)
{
    var options = "NoCancel";
    title = title || "";
    hint = hint || _("your_code");
    //suppress title line if no title - pass " " to override
    if( title==="") options += ",NoTitle";
 
    // create dialog
    var dlg = app.CreateDialog( title, options  );
    var lay = app.CreateLayout( "Linear", "" );
    dlg.AddLayout( lay );
 
    // add controls
    var edt = app.CreateTextEdit( "", width );
    edt.SetBackColor("#333333");
    edt.SetTextColor("white");
    edt.SetTextSize(30, "ps");
    edt.SetHint( hint );
    lay.AddChild( edt );
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
    btnOk.SetOnTouch( function() {okCallback.call(edt); dlg.Dismiss()} );
 
    // public functions
    dlg.ShowKeyboard = function(  )
    {edt.Focus();app.ShowKeyboard( edt );}
 
    dlg.SetText = function(txt){edt.SetText(txt);}
 
    dlg.ShowWithKeyboard=function()
    {setTimeout(dlg.ShowKeyboard, 100); dlg.Show();}
 
    return dlg
}
