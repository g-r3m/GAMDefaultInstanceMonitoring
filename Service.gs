
/**
 * Configures the service.
 */
function getService() {

  return OAuth2.createService('GAM_PMGMT')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId(params.CLIENT_ID)
    .setClientSecret(params.CLIENT_SECRET)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('https://www.googleapis.com/auth/sqlservice.admin')
    .setScope('https://www.googleapis.com/auth/cloud-platform')
    .setParam('access_type', 'offline')
    .setParam('approval_prompt', 'force')
    .setParam('login_hint', Session.getActiveUser().getEmail());

}


function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Connected to Google Cloud');
  } else {
    return HtmlService.createHtmlOutput('Access Denied');
  }
}

function logRedirectUri() {

  var service = getService();

  console.log(service.getRedirectUri());

}
