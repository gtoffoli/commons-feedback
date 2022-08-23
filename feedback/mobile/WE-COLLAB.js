app.LoadScript( "persistence.js" );
app.LoadScript( "locale.js" );
app.LoadScript( "session.js" );
app.LoadScript( "spinner.js" );

app.menu = [
    {text: 'toggle', fun: toggleScreen},
    {text: 'exit', fun: exitApp},
];

//Called when application is started.
function OnStart()
{
  clearPersisted();

  //Create a root layout with objects vertically centered.
  lay_0 = app.CreateLayout( "linear", "VTop,FillXY" );


  //Create a header and add it to the root.
  layHeader = app.CreateLayout( "Absolute", "Vertical");
  lay_0.AddChild(layHeader);

    //Create a text and add it to the header
    txt1 = app.CreateText("WE-COLLAB Feedback",1,0.1,"VCenter,Center");
    // txt1.SetPosition(0,0,1,0.10);
    txt1.SetPosition(0.18,0,0.82,0.10);
    txt1.SetPadding(0,0.01,0,0);
    txt1.SetTextSize(20);
    txt1.SetBackground("/Sys/Img/BlueBack.jpg");
    layHeader.AddChild(txt1);
/*
    btn1 = app.CreateButton("[fa-power-off]",-1,-1,"FontAwesome");
    btn1.SetPosition(0,0,0.18,0.10);
    btn1.SetOnTouch( exitApp );
    layHeader.AddChild(btn1);
    btn2 = app.CreateButton("[fa-bars]",-1,-1,"FontAwesome");
    btn2.SetPosition(0,0,0.18,0.10);
    layHeader.AddChild(btn2);
*/

    list = app.menu;
    title = 'M';
    width = 0.5;
    height = 0.05;
    options = "VCenter,Center";
    spinner = new Spinner(list, title, width, height, options);
    spinner.onTouch = function()
    {
      app.ShowPopup(this.GetText());

    }
    spinner.SetPosition(0,0,0.18,0.10);
    layHeader.AddChild(spinner);

  //Create a layout with objects vertically centered.
  lay_1 = app.CreateLayout( "linear", "VTop,FillXY" );
  app.lay_1 = lay_1;
  lay_0.AddChild(lay_1);

    //Create an image and add it to the layout.
    img = app.CreateImage( "Img/attention.jpg", 1 );
    lay_1.AddChild( img );

    web = app.CreateWebView( 1.0, 0.5 );
    web.LoadUrl( "https://www.commonspaces.eu?embed=true" );
    lay_1.AddChild(web);

  //Create a session layout
  lay_session = new SessionScreen();
  app.lay_session = lay_session;
  lay_0.AddChild(lay_session);

  //Create a layout with objects vertically centered.
  lay_2 = app.CreateLayout( "linear", "VTop,FillXY" );
  app.lay_2 = lay_2;
  lay_0.AddChild(lay_2);

  //Add a 3x3 button matrix 

    layHorizA = app.CreateLayout( "Linear", "Horizontal" );
    lay_2.AddChild( layHorizA );

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
    lay_2.AddChild( layHorizB );

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
    lay_2.AddChild( layHorizC );

    btnC1 = app.CreateButton( "context", 0.33, 0.1 );
    btnC1.SetOnTouch( touchButton );
    layHorizC.AddChild( btnC1 );
    btnC2 = app.CreateButton( "example", 0.33, 0.1 );
    btnC2.SetOnTouch( touchButton );
    layHorizC.AddChild( btnC2 );
    btnC3 = app.CreateButton( "recap", 0.33, 0.1 );
    btnC3.SetOnTouch( touchButton );
    layHorizC.AddChild( btnC3 );

  //Add layout to app.  
  app.AddLayout( lay_0 );
}

function toggleScreen() {
    if (app.lay_1.IsVisible()) {
      app.lay_1.Gone();
      app.lay_session.Show();
    }
    else if (app.lay_session.IsVisible()) {
      app.lay_session.Gone();
      app.lay_2.Show();
    }
    else {
      app.lay_2.Gone();
      app.lay_1.Show();
    }
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
