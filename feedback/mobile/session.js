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
    .then(data => { writePersisted( data ) })
    .catch(err => { app.Debug( err ) });
    sessionRefresh();
}

function sessionScreen() {
  this.lay = app.CreateLayout( "linear", "VTop,FillXY" );

  padding = app.CreateText('',1,0.2,"VCenter,Center");
  this.lay.AddChild(padding);

  heading = app.CreateText(_('session_info'),1,0.1,"VTop,Center");
  this.lay.AddChild(heading);

  sessionText = app.CreateText('',1,0.2,"VTop,Left,Multiline");
  this.lay.AddChild(sessionText);
  app.sessionText = sessionText;
  sessionRefresh();

  var new_code_button = app.CreateButton( _('event_code_new') );
  new_code_button.SetOnTouch( ask_OnTouch );
  this.lay.AddChild( new_code_button );

  return this.lay;
}

function sessionRefresh() {
  var sessionObject = readPersisted();
  if ( sessionObject ) {
    text = `${_('user_label')}: ${sessionObject.user}\n ${_('event_label')}: ${sessionObject.event}`;
    app.event_code = sessionObject.event_code;
  } else
    text = _('no_session');
  app.sessionText.SetText(text);
}

function ask_OnTouch() {
  dialogTitle = _('event_code_prompt');
  dialogWidth = 1.0;
  eventDialog = new inputBox(dialogTitle, setSession, app.event_code, dialogWidth);
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
    var options = "NoCancel"
    title = title || "";
    hint = hint || "Your text";
    //suppress title line if no title - pass " " to override
    if( title==="") options += ",NoTitle";
 
    // create dialog
    var dlg = app.CreateDialog( title, options  );
    var lay = app.CreateLayout( "Linear", "" );
    dlg.AddLayout( lay );
 
    // add controls
    var edt = app.CreateTextEdit( "", width );
    edt.SetHint( hint );
    lay.AddChild( edt );
    var layBtn = app.CreateLayout( "Linear", "Horizontal" );
    lay.AddChild( layBtn );
    var btnCancel = app.CreateButton( "Cancel",-1,-1,"custom" );
    btnCancel.SetOnTouch( function(){dlg.Dismiss();} );
    layBtn.AddChild( btnCancel );
    var btnOk = app.CreateButton( "Ok",-1,-1,"custom" );
    layBtn.AddChild( btnOk );    
    btnOk.SetOnTouch( function(){okCallback.call(edt);dlg.Dismiss()} );
    // btnOk.SetOnTouch( function(){okCallback.call(edt);} );
 
    // public functions
    dlg.ShowKeyboard = function(  )
    {edt.Focus();app.ShowKeyboard( edt );}
 
    dlg.SetText = function(txt){edt.SetText(txt);}
 
    dlg.ShowWithKeyboard=function()
    {setTimeout(dlg.ShowKeyboard, 100);dlg.Show();}
 
    // 
    return dlg
}