



var session;
var user;




$(document).ready(async function() {

  initNavbar();

});




async function initNavbar() {
  


  
  var navbarContainer = $("#navbarContainer");
  navbarContainer.empty();
  var navbarTemplate = Handlebars.compile($('#navbarTemplate').html());
  var navbarHtml = navbarTemplate({user: user});
  navbarContainer.append(navbarHtml);




  $('#signInBtn').on('click', function() {
    blockstack.redirectToSignIn();
    updateUserProfile();
  });
 
  $('#signOutBtn').on('click', function() {
    blockstack.signUserOut(window.location.origin);
    updateUserProfile();
  })
 
  function showProfile(profile) {
    user = new blockstack.Person(profile);
    $('#currUserName').html(user.name());
    session = new blockstack.UserSession(new blockstack.AppConfig(['store_write', 'publish_data']));
  }
 
  function updateUserProfile() {
    if (blockstack.isUserSignedIn()) {
      const userData = blockstack.loadUserData();
      showProfile(userData.profile);
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn()
      .then(userData => {
        showProfile(userData.profile);
      })
    } else {
      console.log('Refresh...');
    }
  }

 

  updateUserProfile();
  



};