
//Called when application is started.
function OnStart()
{
  //Create a layout with objects vertically centered.
  layVert = app.CreateLayout( "linear", "VTop,FillXY" );  
  layVert.SetBackGradient("#ff00ff00","#ff000088");

    //Create a header and add it to the layout.
    layHeader = app.CreateLayout( "Absolute", "Vertical");
    layVert.AddChild(layHeader);

    //Create a text and add it to the header
    txt1 = app.CreateText("WE-COLLAB Feedback",1,0.1,"VCenter,Center");
    txt1.SetPosition(0,0,1,0.10);
    txt1.SetPadding(0,0.01,0,0);
    txt1.SetTextSize(20);
    txt1.SetBackground("/Sys/Img/BlueBack.jpg");
    layHeader.AddChild(txt1);

    btn1 = app.CreateButton("[fa-power-off]",-1,-1,"FontAwesome");
    btn1.SetPosition(0,0,0.18,0.10);
    btn1.SetOnTouch( exitApp );
    layHeader.AddChild(btn1);

    btn2 = app.CreateButton("[fa-bars]",-1,-1,"FontAwesome");
    btn2.SetPosition(0.82,0,0.18,0.10);
    layHeader.AddChild(btn2);

    //Create an image and add it to the layout.
    img = app.CreateImage( "Img/attention.jpg", 1 );
    layVert.AddChild( img );

  //Add a 3x3 button matrix 

    layHorizA = app.CreateLayout( "Linear", "Horizontal" );
    layVert.AddChild( layHorizA );

    btnA1 = app.CreateButton( "go on!", 0.33, 0.1 );
    btnA1.SetOnTouch( touchButton );
    layHorizA.AddChild( btnA1 );
    btnA2 = app.CreateButton( "slower", 0.33, 0.1 );
    btnA2.SetOnTouch( touchButton );
    layHorizA.AddChild( btnA2 );
    btnA3 = app.CreateButton( "louder", 0.33, 0.1 );
    btnA3.SetOnTouch( touchButton );
    layHorizA.AddChild( btnA3 );

    layHorizB = app.CreateLayout( "Linear", "Horizontal" );
    layVert.AddChild( layHorizB );

    btnB1 = app.CreateButton( "pause", 0.33, 0.1 );
    btnB1.SetOnTouch( touchButton );
    layHorizB.AddChild( btnB1 );
    btnB2 = app.CreateButton( "repeat", 0.33, 0.1 );
    btnB2.SetOnTouch( touchButton );
    layHorizB.AddChild( btnB2 );
    btnB3 = app.CreateButton( "explain", 0.33, 0.1 );
    btnB3.SetOnTouch( touchButton );
    layHorizB.AddChild( btnB3 );

    layHorizC = app.CreateLayout( "Linear", "Horizontal" );
    layVert.AddChild( layHorizC );

    btnC1 = app.CreateButton( "context", 0.33, 0.1 );
    btnC1.SetOnTouch( touchButton );
    layHorizC.AddChild( btnC1 );
    btnC2 = app.CreateButton( "example", 0.33, 0.1 );
    btnC2.SetOnTouch( touchButton );
    layHorizC.AddChild( btnC2 );
    btnC3 = app.CreateButton( "recap", 0.33, 0.1 );
    btnC3.SetOnTouch( touchButton );
    layHorizC.AddChild( btnC3 );

    web = app.CreateWebView( 1.0, 0.3 );
    web.LoadUrl( "https://www.commonspaces.eu?embed=true" );
    layVert.AddChild(web);

  //Add layout to app.  
  app.AddLayout( layVert );
}

function exitApp()
{
    // app.ShowPopup( "Welcome to WE-COLLAB!" );
    var c = confirm("Exit app?");
    if(c)
    {
        app.Exit();
    }
}

function touchButton()
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
