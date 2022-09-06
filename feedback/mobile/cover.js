function coverScreen()
{
  //Create a layout with objects vertically centered.
  this.lay = app.CreateLayout( "linear", "VTop,FillXY" );

  //Create an image and add it to the layout.
  img = app.CreateImage( "Img/technostress.jpg", 1 );
  this.lay.AddChild( img );

  //Create another image and add it to the layout.
  img = app.CreateImage( "Img/attention.jpg", 1 );
  this.lay.AddChild( img );

  return this.lay;
}
