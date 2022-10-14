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
  //clearPersisted();
  getPrivateFolder();

  //Create a root layout with 2 layout .
  var lay_root=app.CreateLayout("Absolute",);
  lay_root.SetBackColor("#ff224422");
  lay_root.SetPosition(0,0,1,1);
  app.AddLayout(lay_root);
  
  //Create a Body and add it to the root.
  var layBody=app.CreateLayout("Linear","Vertical,FillXY");
  lay_root.AddChild(layBody);
  
  //Create a header and add it to the body.
  var layHeader = app.CreateLayout( "linear", "Horizontal, FillX");
  layHeader.SetBackColor("black");
  layBody.AddChild(layHeader);
  
  //Create a text and add it to the header
  txt1 = app.CreateText("WE-COLLAB Feedback",0.69,0.08,"VCenter,Center, Bold");
  txt1.SetTextSize(34,"ps");
  layHeader.AddChild(txt1);

  //Create the menu button and add it to the header
  var btnMnu;
  btnMnu=app.CreateButton("[fa-bars]", -1, -1, "fontawesome, custom");
  btnMnu.SetStyle( "#77bb77", "#559955", 15, "#449944",2,0 );
  btnMnu.SetTextSize(34,"ps");
  btnMnu.SetOnTouch(mnuAnimate);
  layHeader.AddChild(btnMnu);
    
  //Create menu layout
  layMenu = getSlideMenu(menu_OnTouch);    
  layMenu.SetPosition(0.4,0.08);
  
  //Populate layMenu
  for (i = 0; i < menu_list.length; i++) {
    layMenu.AddItem(menu_list[i].title);
  }
  lay_root.AddChild( layMenu );

  // Create a cover layout
  lay_cover = new coverScreen();
  app.lay_cover = lay_cover;
  layBody.AddChild(lay_cover);

  // Create a session layout
  lay_session = new sessionScreen();
  app.lay_session = lay_session;
  layBody.AddChild(lay_session);

  // Create a keypad layout
  lay_keypad = addKeypad();
  app.lay_keypad = lay_keypad;
  layBody.AddChild(lay_keypad);

  // Create a website layout
  lay_website = new websiteScreen();
  app.lay_website = lay_website;
  layBody.AddChild(lay_website);

}
