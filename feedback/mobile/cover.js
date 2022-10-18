function coverScreen()
{
  //Create a layout with objects vertically centered.
  this.lay = app.CreateLayout( "linear", "VTop,FillXY" );

  //Create an image and add it to the layout.
  img = app.CreateImage( "Img/We-collab.png", 1, 0.46 );
  this.lay.AddChild( img );

  //Create another image and add it to the layout.
  img = app.CreateImage( "Img/lecture-feedback.png", 1, 0.46 );
  this.lay.AddChild( img );

  return this.lay;
}
