//Populate menu list
var  menu_list = [
    {title: _('home'), fun: Home},
    {title: _('validate'), fun: validateSession},
    {title: _('attend'), fun:attendEvent},
    {title: _('website'), fun:Website},
    {title: _('exit'), fun:exitApp}
]
  
function mnuAnimate()
{
    if(layMenu.GetVisibility()==="Hide")
       layMenu.Show();
    else
       layMenu.Hide();
}

function getSlideMenu(onTouch)
{
//Create menu layout
    var lst 

    var layMenu = app.CreateLayout( "Linear", "VTop, TouchThrough" );    
    layMenu.SetBackColor("#ff66aa66");
    //Create menu list
    lst = app.CreateList( "" ,0.8,0.8,"Bold");
    lst.SetTextSize(30, "ps");
    if(onTouch) lst.SetOnTouch(onTouch);
    lst.SetList(null);
    layMenu.AddChild( lst );
    
    //public methods
    {
         layMenu.Hide();
    }
    layMenu.Show=function()
    {
         this.Animate("SlideFromRight");
    }
    layMenu.Hide=function()
    {
         this.Animate("SlidetoRight");
    }
    layMenu.AddItem=function( title)
    {
        lst.AddItem( title);
    }
    layMenu.Setlist=function( list,delim )
    {
        lst.SetList( list,delim )
    }
    return layMenu
}

// callback function for menu selection
function menu_OnTouch(title, body, image, index) {
  layMenu.Animate("SlidetoRight");
  app.Execute(menu_list[index].fun());
}
 
function Home() {
  app.lay_cover.Show();
  app.lay_session.Gone();
  app.lay_keypad.Gone();
  app.lay_website.Gone();
}

function validateSession() {
  app.lay_cover.Gone();
  sessionRefresh(app.lay_session);
  app.lay_session.Show();
  app.lay_keypad.Gone();
  app.lay_website.Gone();
}

function attendEvent() {
  app.lay_cover.Gone();
  app.lay_session.Gone();
  sessionRefresh(app.lay_keypad);
  app.lay_keypad.Show();
  app.lay_website.Gone();
}

function Website() {
  app.lay_cover.Gone();
  app.lay_session.Gone();
  app.lay_keypad.Gone();
  app.lay_website.Show();
}

function exitApp()
{
    var c = confirm("Exit app?");
    if(c)
    {
        app.Exit();
    }
}
