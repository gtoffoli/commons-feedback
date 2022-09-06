app.LoadScript( "locale.js" );
app.LoadScript( "menu.js" );
app.LoadScript( "persistence.js" );
app.LoadScript( "cover.js" );
app.LoadScript( "session.js" );
app.LoadScript( "keypad.js" );
app.LoadScript( "website.js" );

//Called when application is started.
function OnStart()
{
  // clearPersisted();

  //Create a root layout with objects vertically centered.
  lay_root = app.CreateLayout( "linear", "VTop,FillXY" );
  
  //Create a header and add it to the root.
  layHeader = app.CreateLayout( "Absolute", "Vertical");
  lay_root.AddChild(layHeader);

  // Create an image and add it to the header.
  icon = app.CreateImage( "Img/icon.png", 0.15, 0.08 );
  icon.SetPosition(0.85,0,0.15,0.08);
  layHeader.AddChild( icon );

  //Create a text and add it to the header
  txt1 = app.CreateText("WE-COLLAB Feedback",1,0.08,"VCenter,Center");
  txt1.SetPosition(0.15,0,0.70,0.08);
  txt1.SetPadding(0,0.01,0,0);
  txt1.SetTextSize(20);
  txt1.SetBackground("/Sys/Img/BlueBack.jpg");
  layHeader.AddChild(txt1);

  list = app.menu_list;
  title = '[fa-list]';
  width = 0.5;
  height = 0.05;
  options = "VCenter,Center,FontAwesome";
  menu = new Menu(list, title, width, height, options);
  app.menu = menu;
  menu.onTouch = function()
  {
    app.ShowPopup(this.GetText());
  }
  menu.SetPosition(0,0,0.15,0.08);
  layHeader.AddChild(menu);

  // Create a cover layout
  lay_cover = new coverScreen();
  app.lay_cover = lay_cover;
  lay_root.AddChild(lay_cover);

  // Create a session layout
  lay_session = new sessionScreen();
  app.lay_session = lay_session;
  lay_root.AddChild(lay_session);

  // Create a keypad layout
  lay_keypad = addKeypad();
  app.lay_keypad = lay_keypad;
  lay_root.AddChild(lay_keypad);

  // Create a website layout
  lay_website = new websiteScreen();;
  app.lay_website = lay_website;
  lay_root.AddChild(lay_website);
  
  // Add layout to app 
  app.AddLayout( lay_root );
}
