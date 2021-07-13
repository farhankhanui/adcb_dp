function cookiePolicyBannerHTML() {
  var cookiePolicyBannerHTML = "<span id=\"cookie-policy-banner\"><img src=\"common/images/Info_Icon_Dark.svg\" alt=\"info icon\" id=\"info-icon\" class=\"cookie-policy-info-icon\" /><button id=\"cookie-policy-close-btn\" class=\"cookie-policy-close-btn\" onClick=\"hideCookiePolicyBanner()\"><img src=\"common/images/Close_Icon_Dark.svg\" class=\"cookie-policy-close-icon\" alt=\"close icon\" id=\"close-icon\" /></button><div id=\"cookie-policy-message-text\" class=\"cookie-policy-message-text\"></div></span>";
  return cookiePolicyBannerHTML;
} 

$(document).ready(function() {
  var cookiePolicyBanner = cookiePolicyBannerHTML();
  var html = $.parseHTML(cookiePolicyBanner);
  $("#cookie-policy-message").append(html);
  var headers = {};
  $.get('/api/' + tenant + '/userContexts', function(data, status) {
    if(data && data.userContexts.length && data.userContexts[0].activeOrgUuid) {
      var orgUUID = data.userContexts[0].activeOrgUuid;
      headers = {'APIM-OrgUuid': orgUUID}
    }
    getCookieConsentMessage(headers, tenant);
  }).fail(function(){
    getCookieConsentMessage(headers, tenant);
  });;
});

function getCookieConsentMessage(headers, tenant) {
  var cookie = readCookie('cpb');
  var cookieMessage = document.getElementById('cookie-policy-message');
  $.ajax({
    url: "/api/" + tenant + "/branding/1.0/themes",
    type: 'GET',
    dataType: 'json',
    headers: headers,
    contentType: 'application/json; charset=utf-8',
    success: function (result) {
      if (cookieMessage && result.display && result.display.cookieConsent && result.display.cookieConsent.enabled) {
        if (cookie === null || cookie.toLowerCase() === 'true') {
          if(result.display.cookieConsent.theme === 'light'){
            $("#cookie-policy-message").removeClass('dark').addClass('light');
            $("#close-icon").removeClass('dark').addClass('light').attr("src","common/images/Close_Icon_Light.svg");
            $("#info-icon").attr("src","common/images/Info_Icon_Light.svg");
          } else {
            $("#cookie-policy-message").removeClass('light').addClass('dark');
            $("#close-icon").removeClass('light').addClass('dark').attr("src","common/images/Close_Icon_Dark.svg");
            $("#info-icon").attr("src","common/images/Info_Icon_Dark.svg");
          }
          if(result.display.cookieConsent.position === 'top'){
            $("#cookie-policy-message").removeClass('bottom').addClass('top');
          } else { 
            $("#cookie-policy-message").removeClass('top').addClass('bottom');
          }
          var message = utf8.decode(base64.decode(result.display.cookieConsent.message));
          $("#cookie-policy-message-text").append(message);
          createCookie('cpb', 'true', 365, '/');
          cookieMessage.classList.remove('hide');
        }
      }
    },
    error: function (error) {
      console.log(error)
    }
  });
}
function createCookie(name, value, days, path) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = '; expires=' + date.toGMTString();
  } else var expires = '';
  document.cookie = name + '=' + value + expires + '; path=' + path;
}

function readCookie(name) {
  const cookieName = name + '=';
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
}

function hideCookiePolicyBanner() {
  var cookieMessage = document.getElementById('cookie-policy-message');
  createCookie('cpb', 'false', 365, '/');
  cookieMessage.classList.add('hide');
}
