function addKeypad() {
    //Create a layout with objects vertically centered.
    lay_2 = app.CreateLayout( "linear", "VTop,FillXY" );

    addSessionInfo(lay_2);
    
    //Add a 3x3 button matrix 

    layHorizA = app.CreateLayout( "Linear", "Horizontal" );
    lay_2.AddChild( layHorizA );

    btnA1 = app.CreateButton( "go on!", 0.33, 0.1 );
    btnA1.SetOnTouch( sendFeedback );
    layHorizA.AddChild( btnA1 );
    btnA2 = app.CreateButton( "slower", 0.33, 0.1 );
    btnA2.SetOnTouch( sendFeedback );
    layHorizA.AddChild( btnA2 );
    btnA3 = app.CreateButton( "louder", 0.33, 0.1 );
    btnA3.SetOnTouch( sendFeedback );
    layHorizA.AddChild( btnA3 );

    layHorizB = app.CreateLayout( "Linear", "Horizontal" );
    lay_2.AddChild( layHorizB );

    btnB1 = app.CreateButton( "pause", 0.33, 0.1 );
    btnB1.SetOnTouch( sendFeedback );
    layHorizB.AddChild( btnB1 );
    btnB2 = app.CreateButton( "repeat", 0.33, 0.1 );
    btnB2.SetOnTouch( sendFeedback );
    layHorizB.AddChild( btnB2 );
    btnB3 = app.CreateButton( "explain", 0.33, 0.1 );
    btnB3.SetOnTouch( sendFeedback );
    layHorizB.AddChild( btnB3 );

    layHorizC = app.CreateLayout( "Linear", "Horizontal" );
    lay_2.AddChild( layHorizC );

    btnC1 = app.CreateButton( "context", 0.33, 0.1 );
    btnC1.SetOnTouch( sendFeedback );
    layHorizC.AddChild( btnC1 );
    btnC2 = app.CreateButton( "example", 0.33, 0.1 );
    btnC2.SetOnTouch( sendFeedback );
    layHorizC.AddChild( btnC2 );
    btnC3 = app.CreateButton( "recap", 0.33, 0.1 );
    btnC3.SetOnTouch( sendFeedback );
    layHorizC.AddChild( btnC3 );

    return lay_2;
}

function sendFeedback()
{
    var button = this;
    var feedback = this.GetText();
    app.Alert( feedback +"!" );
    var data = { feedback: feedback, event_code: '1210' };
    var body = JSON.stringify(data);
    fetch("https://www.we-collab.eu/feedback/process/", {
        method: "POST",
        body: body,
        headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    .then(response => response.json()) 
    .then(data => {
        for (var key in data) {
            console.log(key, data[key]);
        };
    })
    .catch(err => console.log(err));
}
