app.LoadScript( "locale.js" );
app.LoadScript( "menu.js" );
app.LoadScript( "persistence.js" );
app.LoadScript( "session.js" );
app.LoadScript( "keypad.js" );

//Called when application is started.
function OnStart()
{
  // clearPersisted();

  //Create a root layout with objects vertically centered.
  lay_root = app.CreateLayout( "linear", "VTop,FillXY" );
  
  //Create a header and add it to the root.
  layHeader = app.CreateLayout( "Absolute", "Vertical");
  lay_root.AddChild(layHeader);

  //Create a text and add it to the header
  txt1 = app.CreateText("WE-COLLAB Feedback",1,0.1,"VCenter,Center");
  txt1.SetPosition(0.18,0,0.82,0.10);
  txt1.SetPadding(0,0.01,0,0);
  txt1.SetTextSize(20);
  txt1.SetBackground("/Sys/Img/BlueBack.jpg");
  layHeader.AddChild(txt1);

  list = app.menu_list;
  title = 'M';
  width = 0.5;
  height = 0.05;
  options = "VCenter,Center";
  menu = new Menu(list, title, width, height, options);
  app.menu = menu;
  menu.onTouch = function()
  {
    app.ShowPopup(this.GetText());
  }
  menu.SetPosition(0,0,0.18,0.10);
  layHeader.AddChild(menu);

  //Create a layout with objects vertically centered.
  lay_cover = app.CreateLayout( "linear", "VTop,FillXY" );
  app.lay_cover = lay_cover;
  lay_root.AddChild(lay_cover);

  //Create an image and add it to the layout.
  img = app.CreateImage( "Img/attention.jpg", 1 );
  lay_cover.AddChild( img );

  web = app.CreateWebView( 1.0, 0.5 );
  web.LoadUrl( "https://www.commonspaces.eu?embed=true" );
  lay_cover.AddChild(web);

  // Create a session layout
  lay_session = new sessionScreen();
  app.lay_session = lay_session;
  lay_root.AddChild(lay_session);

  // Create a keypad layout
  lay_keypad = addKeypad();
  app.lay_keypad = lay_keypad;
  lay_root.AddChild(lay_keypad);
  
  // Add layout to app 
  app.AddLayout( lay_root );
}
