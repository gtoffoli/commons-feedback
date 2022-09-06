function websiteScreen()
{
  //Create a layout with objects vertically centered.
  this.lay = app.CreateLayout( "linear", "VTop,FillXY" );

  web = app.CreateWebView( 1.0, 0.9 );
  web.LoadUrl( "https://www.we-collab.eu" );
  this.lay.AddChild(web);

  return this.lay;
}
