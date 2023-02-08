function sendReaction()
{
    var sessionObject = readPersisted();
    if (sessionObject.error || sessionObject.warning)
        return;
    var message = this.GetText();
    var data = { message: message, event_code: app.event_code };
    var body = JSON.stringify(data);
    fetch("https://www.we-collab.eu/feedback/reaction/", {
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

function addKeypad() {
    //Create a layout with objects vertically centered.
    lay_2 = app.CreateLayout( "linear", "Vertical,FillXY" );

    addSessionInfo(lay_2);
    sessionRefresh(lay_2, false);

    //Add a 3x3 button matrix 

    layHorizA = app.CreateLayout( "Linear", "Horizontal" );
    lay_2.AddChild( layHorizA );

    btnA1 = app.CreateButton( _("go_on"), 0.33, 0.1);
    btnA1.SetBackColor("#ff66aa66");
    btnA1.SetTextSize(30, 'ps');
    btnA1.SetOnTouch( sendReaction );
    layHorizA.AddChild( btnA1 );
    btnA2 = app.CreateButton( _("slower"), 0.33, 0.1 );
    btnA2.SetBackColor("#ff66aa66");
    btnA2.SetTextSize(30, 'ps');
    btnA2.SetOnTouch( sendReaction );
    layHorizA.AddChild( btnA2 );
    btnA3 = app.CreateButton( _("louder"), 0.33, 0.1);
    btnA3.SetBackColor("#ff66aa66");
    btnA3.SetTextSize(30, 'ps');
    btnA3.SetOnTouch( sendReaction );
    layHorizA.AddChild( btnA3 );

    layHorizB = app.CreateLayout( "Linear", "Horizontal" );
    lay_2.AddChild( layHorizB );

    btnB1 = app.CreateButton( _("pause"), 0.33, 0.1 );
    btnB1.SetBackColor("#ff66aa66");
    btnB1.SetTextSize(30, 'ps');
    btnB1.SetOnTouch( sendReaction );
    layHorizB.AddChild( btnB1 );
    btnB2 = app.CreateButton( _("repeat"), 0.33, 0.1);
    btnB2.SetBackColor("#ff66aa66");
    btnB2.SetTextSize(30, 'ps');
    btnB2.SetOnTouch( sendReaction );
    layHorizB.AddChild( btnB2 );
    btnB3 = app.CreateButton( _("explain"), 0.33, 0.1 );
    btnB3.SetBackColor("#ff66aa66");
    btnB3.SetTextSize(30, 'ps');
    btnB3.SetOnTouch( sendReaction );
    layHorizB.AddChild( btnB3 );

    layHorizC = app.CreateLayout( "Linear", "Horizontal" );
    lay_2.AddChild( layHorizC );

    btnC1 = app.CreateButton( _("context"), 0.33, 0.1);
    btnC1.SetBackColor("#ff66aa66");
    btnC1.SetTextSize(30, 'ps');
    btnC1.SetOnTouch( sendReaction );
    layHorizC.AddChild( btnC1 );
    btnC2 = app.CreateButton( _("example"), 0.33, 0.1 );
    btnC2.SetBackColor("#ff66aa66");
    btnC2.SetTextSize(30, 'ps');
    btnC2.SetOnTouch( sendReaction );
    layHorizC.AddChild( btnC2 );
    btnC3 = app.CreateButton( _("recap"), 0.33, 0.1);
    btnC3.SetBackColor("#ff66aa66");
    btnC3.SetTextSize(30, 'ps');
    btnC3.SetOnTouch( sendReaction );
    layHorizC.AddChild( btnC3 );

    return lay_2;
}
