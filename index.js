var profileFields = [
  'FirstName',
  'RealName',
  'LastNameAtBirth',
  'BirthDate',
  'BirthLocation',
  'DeathDate',
  'DeathLocation',
  'Father',
  'Mother',
  'Parents',
  'Spouses'
];

var $error = $('.group.error'),
    $input = $('.group.input'),
    $loading = $('.group.loading'),
    $login = $('.group.login');

// Check for query param
var profileId = getQueryParam('profile');

// Setup event listeners
$('#login-btn').click(login);
$('#input-btn').click(inputLoad);
$('#profile-id ').keydown(function (e){
  if(e.keyCode == 13){
    inputLoad();
  }
});
$('#email, #password').keydown(function (e){
  if(e.keyCode == 13){
    login();
  }
});

if(!profileId){
  $input.show();
  $loading.hide();
} else {
  start();
}

function start(){
  $loading.show();
  setupLoginResponse(wikitree.checkLogin());
}

function login(){
  $loading.show();
  $login.hide();
  setupLoginResponse(wikitree.login({
    email: $('#email').val(),
    password: $('#password').val()
  }));
}

function inputLoad(){
  profileId = $('#profile-id').val();
  if(profileId){
    $input.hide();
    $error.hide();
    start();
  }
}

/**
 * Common response handler for checkLogin and login
 */
function setupLoginResponse(promise){
  promise.done(function() {
		loadProfile(profileId);
	})
  .fail(function(){
    $login.show();
    $loading.hide();
  });
}

function loadProfile(id){
  wikitree
    .getPerson(id, profileFields)
    .done(convertToRootsSearch)
    .fail(function(error){
      $error.show();
      $input.show();
      $loading.hide();
      $('#profile-id').focus();
    });
}

function convertToRootsSearch(person){
  var father = person.getFather(),
      mother = person.getMother(),
      spouse = person.getSpouse(),
      data = {
        givenName: person.getFirstName() || person.getRealName(),
        familyName: person.getLastNameAtBirth(),
        birthPlace: person.getBirthLocation(),
        birthDate: person.getBirthDate(),
        deathPlace: person.getDeathLocation(),
        deathDate: person.getDeathDate(),
      };

  if(father){
    data.fatherGivenName = father.getFirstName();
    data.fatherFamilyName = father.getLastNameAtBirth();
  }

  if(mother){
    data.motherGivenName = mother.getFirstName();
    data.motherFamilyName = mother.getLastNameAtBirth();
  }

  if(spouse){
    data.spouseGivenName = spouse.getFirstName();
    data.spouseFamilyName = spouse.getLastNameAtBirth();
  }

  postData(data);
}

function postData(data){
  var $form = $('#form');
  for(var a in data){
    // Ignore empty fields
    if(data[a]){
      $form.append('<input name="data['+a+']" value="'+data[a]+'">');
    }
  }
  $form.submit();
}

// http://stackoverflow.com/a/12254019
function getQueryParam(n) {
  var half = location.search.split(n + '=')[1];
  return half !== undefined ? decodeURIComponent(half.split('&')[0]) : null;
}
