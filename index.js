var profileFields = [
  'FirstName',
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

var $body = $(document.body);

// Check for query param
var profileId = getQueryParam('profile');

// Setup button listeners
$('#login-btn').click(login);

if(!profileId){
  // TODO: allow the ID to be input?
}

// Check WikiTree auth status
setupLoginResponse(wikitree.checkLogin());

function login(){
  $body.addClass('loading');
  $body.removeClass('login');
  setupLoginResponse(wikitree.login({
    email: $('#email').val(),
    password: $('#password').val()
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
    $body.addClass('login');
    $body.removeClass('loading');
  });
}

function loadProfile(id){
  wikitree.getPerson(id, profileFields).then(convertToRootsSearch);
}

function convertToRootsSearch(person){
  var father = person.getFather(),
      mother = person.getMother(),
      spouse = person.getSpouse(),
      data = {
        givenName: person.getFirstName(),
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
    $form.append('<input name="data['+a+']" value="'+data[a]+'">');
  }
  $form.submit();
}

// http://stackoverflow.com/a/12254019
function getQueryParam(n) {
  var half = location.search.split(n + '=')[1];
  return half !== undefined ? decodeURIComponent(half.split('&')[0]) : null;
}
