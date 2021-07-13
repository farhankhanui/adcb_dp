//Don't remove this variable. As tenant is using in some api calls.
//var tenant = window.location.hostname.split(".")[0];
var tenant = "uatmagtenant";

//For checking the external registration functionality is enable or not.
var checkSignUp = function(ele) {
    $.get("/admin/cmsSettings", function(data, status) {
        if (data.REGISTRATION_STATUS == "ENABLED") {
            ele.show();
            if ($(".auth-options")[0]){
                 $(".auth-options").show();
            }
        }
    });
};

//For fetching the theme settings like logo.
var fetchThemeSettings = function(logoEle, providerEle) {
    $.get("/api/" + tenant + "/branding/1.0/themes", function(data, status) {
        if (data.logo) {
            logoEle.attr("src", data.logo);
            if (providerEle) {
                providerEle.text(data.siteTitle);
            }
        }
    });
};

//If encryption is enable. Then for fetching the public key call this function.
var fetchPublicKey = function() {
    $.get("/api/" + tenant + "/authenticate/getPublicKey", function(data, status) {
        if (data.publicKey) {
            publicKey = data.publicKey;
        }
    });
}