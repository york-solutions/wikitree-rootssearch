// Setup button listeners
document.getElementById('login-btn').addEventListener('click', login);

// Check for query param
var profileId = getQueryParam('profile');

if(!profileId){
  // TODO: allow the ID to be input?
}

// Check WikiTree auth status
setupLoginResponse(wikitree.checkLogin());

function login(){
  document.body.classList.add('loading');
  document.body.classList.remove('login');
  setupLoginResponse(wikitree.login({
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  }));
}

/**
 * Common response handler for checkLogin and login
 */
function setupLoginResponse(promise){
  promise.done(function() {
		loadProfile(profileId);
	})
  .fail(function(){
    document.body.classList.add('login');
    document.body.classList.remove('loading');
  });
}

function loadProfile(id){
  wikitree.getPerson(id, ['Id','Name','FirstName','MiddleName','LastNameAtBirth','LastNameCurrent','BirthDate','DeathDate','Father','Mother','Spouse'])
    .then(convertToRootsSearch);
}

function convertToRootsSearch(person){
  var data = {};
  postData(data);
}

function postData(data){
  // TODO
  console.log('POST');
}

// http://stackoverflow.com/a/12254019
function getQueryParam(n) {
  var half = location.search.split(n + '=')[1];
  return half !== undefined ? decodeURIComponent(half.split('&')[0]) : null;
}
