// Check for query param
var profileId = getQueryParam('profile');

console.log(profileId);

// Check WikiTree auth status

// Get the WikiTree profile

// Convert profile to rootssearch v1 schema

// POST to rootssearch

// http://stackoverflow.com/a/12254019
function getQueryParam(n) {
  var half = location.search.split(n + '=')[1];
  return half !== undefined ? decodeURIComponent(half.split('&')[0]) : null;
}
