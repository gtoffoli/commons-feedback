var validate_url = 'https://www.we-collab.eu/feedback/validate/';
app.event_code = '';

function SetSession(edt) {
    var event_code = this.GetText();
    var data = { event_code: event_code }
    var jsonString = JSON.stringify( data );
    /*
    fetch(validate_url, {
      method: "POST",
      body: jsonString,
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    */
    url = `${validate_url}?event_code=${event_code}`;
    fetch(validate_url, {
      method: "GET"
    })
    .then(response => response.json())
    .then(data => writePersisted(data))
    .catch(err => console.log(err));
}

function SessionScreen() {
  this.lay = app.CreateLayout( "linear", "VTop,FillXY" );

  heading = app.CreateText(_('session_info'),1,0.1,"VCenter,Center");
  this.lay.AddChild(heading);

  var sessionObject = readPersisted();
  var sessionText = null;
  if ( sessionObject ) {
    // var text = `%s: %s\n %s: %s` % (_('user_label'), sessionObject.user_name, _('event_label'), sessionObject.event_title);
    text = `${_('user_label')}: ${sessionObject.user_name}\n ${_('event_label')}: ${sessionObject.event_title}`;
    sessionText = app.CreateText(text,1,0.1,"Multiline"); 
  } else {
    text = _('no_session');
    sessionText = app.CreateText(text,1,0.1,"VCenter,Left,Multiline");
  }
  this.lay.AddChild(sessionText);

  var new_code_button = app.CreateButton( _('event_code_new') );
  new_code_button.SetOnTouch( ask_OnTouch );
  this.lay.AddChild( new_code_button );

  return this.lay;
}

function ask_OnTouch() {
  dialogTitle = _('event_code_prompt');
  dialogWidth = 1.0;
  eventDialog = new inputBox(dialogTitle, SetSession, app.event_code, dialogWidth);
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
    // btnOk.SetOnTouch( function(){okCallback.call(edt);dlg.Dismiss()} );
    btnOk.SetOnTouch( function(){okCallback.call(edt);} );
 
    // public functions
    dlg.ShowKeyboard = function(  )
    {edt.Focus();app.ShowKeyboard( edt );}
 
    dlg.SetText = function(txt){edt.SetText(txt);}
 
    dlg.ShowWithKeyboard=function()
    {setTimeout(dlg.ShowKeyboard, 100);dlg.Show();}
 
    // 
    return dlg
}
