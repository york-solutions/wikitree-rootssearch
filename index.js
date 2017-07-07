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
  'Spouses',
  'Privacy'
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
  loadProfile(profileId);
}

function login(){
  $loading.show();
  $login.hide();
  wikitree.login({
    email: $('#email').val(),
    password: $('#password').val()
  }).done(function() {
		loadProfile(profileId);
	})
  .fail(function(){
    $login.show();
    $loading.hide();
  });
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
 * Load a person from the WikiTree API. If the profile is restricted and the
 * user isn't logged in then ask the user to login and load the profile again.
 * We do this in case the user is on the profile's Trusted List and therefore
 * has access to more info than the public does.
 *
 * @param  {String} id
 */
function loadProfile(id){
  wikitree
    .getPerson(id, profileFields)
    .done(function(person){

      // If the profile is public then continue to RootsSearch
      if(person.getPrivacy() === '50' || person.getPrivacy() === '60'){
        convertToRootsSearch(person);
      }

      // If the profile isn't public then check the login status.
      else {
        wikitree.checkLogin()

        // If the user is logged in then continue; we have all the data the user has rights to access
        .done(function(){
          convertToRootsSearch(person);
        })

        // If the user isn't logged in then log them in and try again
        .fail(function(){
          $login.show();
          $loading.hide();
        });
      }
    })
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
        birthDate: fixDate(person.getBirthDate()),
        deathPlace: person.getDeathLocation(),
        deathDate: fixDate(person.getDeathDate()),
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

/**
 * WikiTree supports partial dates which are denoted with 00 for the month or day.
 * But those don't work well with RootsSearch or any other system so we remove the 00.
 * 
 * @param {String} date 
 */
function fixDate(date){
  if(date){
    return date.replace(/-00/g, '');
  }
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
