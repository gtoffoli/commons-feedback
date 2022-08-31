function coverScreen()
{
  //Create a layout with objects vertically centered.
  this.lay = app.CreateLayout( "linear", "VTop,FillXY" );

  //Create an image and add it to the layout.
  // img = app.CreateImage( "Img/attention.jpg", 1 );
  // lay_cover.AddChild( img );

  web = app.CreateWebView( 1.0, 0.9 );
  web.LoadUrl( "https://www.we-collab.eu" );
  this.lay.AddChild(web);

  return this.lay;
}
