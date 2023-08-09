/*
 * This example lists and plays YouTube videos with
 * optional full screen mode. The videos are taken
 * from the DroidScript YouTube channel.
*/
//sql = "CREATE TABLE IF NOT EXISTS Bookmarks (Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Vid VARCHAR(36) NOT NULL, Start TEXT NOT NULL, Description TEXT NOT NULL);";
  
//Initialise variables.
var isFullscreen = false
var list1Cnt = 0;
var recIds = new Array();
var tiempos = new Array();
var videoIds = [
    "G1-Zfr9-3zs", "9V2En3Cnq6c",
    "cKzK4oqiDd8", "ZlojAcd9lGc" ]

var videoTitles = [ "How to install Visual Studio", "Intro to Visual Studio", "Part 3", "Part 4" ]

app.LoadPlugin( "Utils" );

//Called when application is started.
function OnStart()
{
	utils = app.CreateUtils();
	LoadData();
	//app.Wait(5, true);
	app.SetOrientation( "Portrait" )

	lay = app.CreateLayout( "Linear", "FillXY" )
	//lay.SetChildMargins( 0.02, 0.02, 0.02, 0.02 )
	lay.SetBackColor( "#ffffff" )
	
CreateActionBar();
	web = app.AddWebView( lay, 1, 0.4, "UseBrowser" )
	web.SetOnProgress( web_OnProgress )
	web.SetOnConsole( web_OnConsole )
	web.SetOnError( web_OnError )
	web.SetBackColor( "#ffffff" )

	title = app.AddText( lay, "Tim Corey - Practical C#", 1, -1, "Bold" )
	title.SetTextColor( "#F48542" );
	title.SetTextShadow( 3, 2, 2,  utils.GetGradientColors(utils.GetGradientColors("#F48542")[0])[0]);
	title.SetTextSize( 22, "sp" )
	title.SetEllipsize( "End" )

	list = app.AddList( lay, videoTitles, 1, 0.152, "Bold" )
	list.SetHiTextColor1( "#FF0000" )
	list.SetOnTouch( list_OnTouch )
	list.SelectItemByIndex( 1 )
	list.SetEnabled( false )
	list.SetTextColor( "#000000" )
	
	list1= app.AddList( lay, "", 1, 0.12, "Bold,Italic" )
	list1.SetHiTextColor1( "#FF0000" )
	list1.SetOnTouch( list1_OnTouch )
	list1.SelectItemByIndex( 0 )
	list1.SetEnabled( true )
	list1.SetTextColor( "#000000" )
	
	btn = app.CreateButton( "Save Bookmark", 0.64, 0.1 );
	btn.SetOnTouch( GetCurrentTime );
	lay.AddChild( btn );
	//Add layout to app.
	app.AddLayout( lay )

	//rel = If the parameter's value is set to 0, then the player does not show related videos.
	web.LoadUrl( "https://www.youtube.com/embed/" + videoIds[0] + "?&rel=0&autoplay=1&start=0"  );
	//InitializeData();
	// https://youtu.be/jY0Wi-AKZrU?t=63
}

//Create an action bar at the top.
function CreateActionBar()
{
    //Create horizontal layout for top bar.
    layHoriz = app.CreateLayout( "Linear", "Horizontal,FillX,Left" );
    layHoriz.SetBackGradient( utils.GetGradientColors("#F48542")[0], "#F48542", utils.GetGradientColors("#F48542")[1]);
    //SetBackColor( "#4285F4" );
    lay.AddChild( layHoriz );
    
    //Create menu (hamburger) icon .
    txtMenu = app.CreateText( "[fa-bars]", -1,-1, "FontAwesome" );
    txtMenu.SetPadding( 12,10,12,10, "dip" );
    txtMenu.SetTextSize( 28 );
    txtMenu.SetTextColor( "#ffffff" );
    txtMenu.SetTextShadow( 5, 0, 0, "#000000" );
    txtMenu.SetOnTouchUp( function(){/*app.OpenDrawer()*/} );
    layHoriz.AddChild( txtMenu );
    
    //Create layout for title box.
    layBarTitle = app.CreateLayout( "Linear", "Horizontal" );
    layBarTitle.SetSize( 0.73 );
    layHoriz.AddChild( layBarTitle );
    
    //Create title.
    txtBarTitle = app.CreateText( "Tim Corey", -1,-1, "Left" );
    txtBarTitle.SetMargins(0,10,0,0,"dip");
    txtBarTitle.SetTextSize( 23 );
    txtBarTitle.SetTextColor( "#ffffff" );
    txtBarTitle.SetTextShadow( 5, 0, 0, "#000000" );
    layBarTitle.AddChild( txtBarTitle );
    
    /*    
    //Create search icon.
    txtSearch = app.CreateText( "[fa-search]", -1,-1, "FontAwesome" );
    txtSearch.SetPadding( 12,2,12,10, "dip" );
    txtSearch.SetTextSize( 24 );
    txtSearch.SetTextColor( "#eeeeee" );
    txtSearch.SetOnTouchUp( function(){app.ShowPopup("Todo!")} );
    layHoriz.AddChild( txtSearch );
    */
}

function list_OnTouch( title, body, icon, index )
{
list1Cnt = 0;
current = index;
    list.SelectItemByIndex( index )
    list1.SetList( "" );
		web.Execute( app.ReadFile( "Web.js" ), RunAfterWeb );
    //We can change the index of the video played by entering the YouTube player api on the page.
    //https://developers.google.com/youtube/iframe_api_reference
    //alert(recIds[index]);
    web.Execute( "document.querySelector('#movie_player').loadVideoById('" + videoIds[index] + "')" )
}

function list1_OnTouch( title, body, icon, index )
{
    list1.SelectItemByIndex( index );
    alert(tiempos[index]);
//alert("Desc: " + title + ", " + recIds[index]);
    //We can change the index of the video played by entering the YouTube player api on the page.
    //https://developers.google.com/youtube/iframe_api_reference
    
    //web.Execute( "document.querySelector('#movie_player').loadVideoById('" + videoIds[index] + "')" )
web.Execute( "document.querySelector('#movie_player').playVideoAt(" + tiempos[index] + ")" )
}

function RunAfterWeb (results)
{
	app.SetClipboardText( results );
	app.ShowPopup( results );
}

function GetCurrentTime()
{
web.Execute( "document.querySelector('#movie_player').getCurrentTime();", SaveBookmark);
/*a = recIds[current];
b = "0";
c = prompt("Description");
sql = "INSERT INTO Bookmarks (Vid, Start, Description) VALUES ('" + a + "', '" + b + "', '" + c + "');";
    alert(sql);
    app.Exit();
    */
    //db.ExecuteSql(sql, null, ()=>{});//QueryData, QueryError);
 
	//web.Execute( "alert(document.querySelector('#movie_player').getCurrentTime());");
}

function SaveBookmark(results)
{
	a = recIds[current];
b = parseInt(results);
alert(b);
c = prompt("Description");
sql = "INSERT INTO Bookmarks (Vid, Start, Description) VALUES ('" + a + "', '" + b + "', '" + c + "');";

if(list1.GetList(",") == ""){
list1.SetList( c );
 tiempos[list1Cnt] = b;

}
else
{
ss = Array2String(list1.GetList(","));
//alert(ss);
list1.SetList( ss + "," + c );
//alert("List1: "+list1.GetList(",").split(",").length-1);
 tiempos[list1Cnt] = b;

}
db.ExecuteSql(sql, null, ()=>{app.ShowPopup( "The bookmark was saved", "Top, Long" );});//QueryData, QueryError);
 list1Cnt++;
    //alert(sql);
    //app.Exit();
}


function Array2String(arra)
{
array = arra.split(",");
	var returns = "";
	for(cnt = 0; cnt < array.length; cnt++){
		if(returns != "") returns += ",";
		returns += array[cnt];
	}
	return returns;
}

function web_OnProgress( progress )
{
    //We cannot run our code until the page is fully loaded.
    //Wait until it is fully loaded.
    if( progress !== 100 ) return

    //Detect full screen click. In this way,
    //we can turn the screen sideways and enlarge it.
    var inject = 'document.querySelector("button.ytp-fullscreen-button.ytp-button").addEventListener("click", () => console.log("fullscreen"))'
    web.Execute( inject )

    list.SetEnabled( true )
    web.Show()
}

//We printed a message when the button was clicked to understand that the screen went into full screen mode.
//By detecting this, we can learn whether the button has been clicked or not.
function web_OnConsole( msg )
{
    if( msg === "fullscreen" ) goFullscreen()
}

function goFullscreen()
{
    isFullscreen = !isFullscreen

    app.SetOrientation( isFullscreen ? "Landscape" : "Portrait" )
    app.SetScreenMode( isFullscreen ? "Game" : "Normal" )
}

// If the screen is turned sideways,
//make the video full screen and hide the list.
function OnConfig()
{
    if( app.IsPortrait() ) web.SetSize( 1, 0.54 )
    else web.SetSize( 1, 1 )
}

function web_OnError( message, code )
{
	if( code === -2 )
	{
		app.Quit( "No network connection!" )
  }
}

function InitializeData()
{
//alert(videoIds.length);
	p = app.GetInternalFolder() + "/Download/TimCorey";
    app.MakeFolder( p );
    path = p + "/data.sqlite"
    db = app.OpenDatabase( path );
    //app.ShowPopup( path );
    for(d=0;d<videoIds.length;d++){
    a = Guid();
    b = videoIds[d];
    c = videoTitles[d];
    sql = "INSERT INTO Videos (Id, Video, Title) VALUES ('" + a + "', '" + b + "', '" + c + "');";
    
    db.ExecuteSql(sql, null, ()=>{});//QueryData, QueryError);
 		}
}

function LoadData()
{
	p = app.GetInternalFolder() + "/Download/TimCorey";
    app.MakeFolder( p );
    path = p + "/data.sqlite"
    db = app.OpenDatabase( path );
    sql = "SELECT * FROM Videos;";
    
    db.ExecuteSql(sql, null, OnResult);//QueryData, QueryError);
}

//Callback to show query results in debug.  
function OnResult( results )   
{  
    var s = "";  
    var len = results.rows.length;  
    for(var i = 0; i < len; i++ )   
    {  
        var item = results.rows.item(i);
        recIds[i] = item.Id;
        videoIds[i] = item.Video;
        videoTitles[i] = item.Title;
        //s += item.id + ", " + item.data + ", " + item.data_num + "\n";   
    }  
    //txt.SetText( s )  
    list.SetList(videoTitles );
}  

Guid = function () {
  let guid = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      guid += '-';
    } else if (i === 14) {
      guid += '4';
    } else {
      guid += Math.floor(Math.random() * 15).toString(16);
    }
  }
  return guid;
}