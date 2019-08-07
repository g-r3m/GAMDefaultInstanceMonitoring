/*
 * Params used by the script in order to access Big Query and
 * Cloud SQL API
*/ 
var params = {
  // Client ID 
  CLIENT_ID: 'XXX',
  // Client Secret
  CLIENT_SECRET: 'XXX',
  // Project Name
  PROJECT: 'XXX',
  // Instance Name
  INSTANCE: 'XXX',
  // BigQuery Project id
  PROJECTBQ: 'XXX',
  // Dataset id
  DATASET: '',
  // Table id
  TABLE: 'XXX'
};




function PManagement() {
  
  var service = getService();
  if (!service.hasAccess()) {
    Logger.log("Please authorize %s", service.getAuthorizationUrl());
    return;
  }

  Logger.log('accesstoken: '+service.getAccessToken());
  
  var url = 'https://www.googleapis.com/sql/v1beta4/projects/PROJECT/instances/INSTANCE/databases'
    .replace("PROJECT", params.PROJECT)
    .replace("INSTANCE", params.INSTANCE)

  var headers = {
    "Authorization": "Bearer " + service.getAccessToken(),
    "Accept": "application/json"
  };

  var options = {
    "headers": headers,
    "method": "GET",
    "muteHttpExceptions": true
  };

  var response = UrlFetchApp.fetch(url, options);
  
  // Parse response to store the list of instances 
  // Add the date in the row
  
  Logger.log(response.getContentText());
  data = [];
  var today = new Date();
  var dataAll = JSON.parse(response.getContentText())
  Logger.log(dataAll.items[1].name);
  for (j in dataAll.items) {
    Logger.log(dataAll.items[j].name);
    callPush = JSON.stringify({
      'date': today,
      'name': dataAll.items[j].name
    })

    data.push(callPush);
  }
  
  // Insert data into Big Query
  
  var data = data.join("\n");
  blobData = Utilities.newBlob(data, "application/octet-stream");
  job = {
    configuration: {
      load: {
        destinationTable: {
          projectId: params.PROJECTBQ,
          datasetId: params.DATASET,
          tableId: params.TABLE
        },
        sourceFormat: "NEWLINE_DELIMITED_JSON",
      }
    }
  }
  job = BigQuery.Jobs.insert(job, projectId, blobData);
}
