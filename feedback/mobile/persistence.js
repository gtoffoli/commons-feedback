function getPrivateFolder() {
  app.privateFolder = app.GetPrivateFolder( 'we_collab' );
  app.persistedPath = app.privateFolder + '/user_event.json'
}

function readPersisted() {
  if (app.FileExists( app.persistedPath )) {
      app.Debug('file exists');
      var fileContents = app.ReadFile( app.persistedPath );
      var dataObject = JSON.parse( fileContents );
      return dataObject;
  } else return null;
}

function writePersisted( dataObject ) {
  var jsonString = JSON.stringify( dataObject );
  app.WriteFile( app.persistedPath, jsonString); 
}

function clearPersisted() {
  if (app.FileExists( app.persistedPath ))
    app.DeleteFile( app.persistedPath );
}
