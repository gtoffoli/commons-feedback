var persistedPath = '/sdcard/cs_feedback/user_event.json';

function readPersisted() {
  if (app.FileExists( persistedPath )) {
      var fileContents = app.ReadFile( persistedPath );
      var dataObject = JSON.parse( fileContents );
      return dataObject;
  } else return null;
}

function writePersisted( dataObject ) {
  var jsonString = JSON.stringify( dataObject );
  app.WriteFile( persistedPath, jsonString); 
}

function clearPersisted() {
  if (app.FileExists( persistedPath ))
    app.DeleteFile( persistedPath );
}
