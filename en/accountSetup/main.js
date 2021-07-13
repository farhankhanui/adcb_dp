var uuid;
var token;
var publicKey = fetchPublicKey();

$(document).ready(function() {
    token = window.location.hash.split("/").length > 1 ? window.location.hash.split("/")[1] : null;
    accountSetUp();
});

//Fetching the Passwword Policy.
$.get("/admin/public/auth/schemes/passwordpolicy", function(data, status) {
    if (data.respCode == 200) {
        var passwordPolicyRegex = data.authScheme.passwordPolicies.regexConfig;
        var ele = null;
        $.each(passwordPolicyRegex, function(key, value) {
            if (key !== "REGEX" && key !== 'SUPPORTED_SYMBOLS') {
                if (value.enabled) {
                    if (key === 'UPPERCASE') {
                        ele = "<li>At least " + value.value + " uppercase character(s)</li>";
                    } else if (key === 'LOWERCASE') {
                        ele = "<li>At least " + value.value + " lowercase character(s)</li>";
                    } else if (key === 'NUMBER') {
                        ele = "<li>At least " + value.value + " number(s)</li>";
                    } else if (key === 'SUPPORTED_SYMBOLS') {
                        ele = "<li>At least 1 special character(s), supports " + value.value + "</li>";
                    } else if (key === 'MINIMUM_LENGTH') {
                        ele = "<li>Minimum " + value.value + " character(s)</li>";
                    } else if (key === 'MAXIMUM_LENGTH') {
                        ele = "<li>Maximum " + value.value + " character(s)</li>";
                    }
                }
            }
            if (ele) {
                $("#passwordPolicies").append(ele);
            }
            ele = null;
        });
    }
});

//Fetching the email and uuid based on the token.
var accountSetUp = function() {
    $.get("/admin/accountSetup?token=" + token, function(data, status) {
            $("#emailField").attr('value', data.email);
            if(data.firstName){
                $("#firstName").attr('value', data.firstName);
            }
            if(data.lastName){
                $("#lastName").attr('value', data.lastName);
            }
            if(data.userName){
                $("#userName").attr('value', data.userName);
            }
            uuid = data.uuid;
        })
        .fail(function() {
            window.location.href = "/admin/app/invalidtoken";
        });
}
//For fetching the theme settings like logo.
fetchThemeSettings($(".generic-logo-size"), $("#provider-name"));


$("#userName").blur(function() {
    if ($(this).val()) {
        //Checking the UserName is unique or not.
        $.getJSON('/admin/Portal.svc/UserNameUnique()?Name=\'' + encodeURIComponent($(this).val().trim()) + '\'', function(data, status) {
            if(!data.d.result){
                $(".validation.username").show();
                $("#userName").css("margin-bottom", "0px");
            }
        })
        .fail(function() {
            $(".validation.username").show();
            $("#userName").css("margin-bottom", "0px");
        });
    }
});

$("#userName").focus(function() {
    $(".validation.username").hide();
    $("#userName").css("margin-bottom", "20px");
});

//Submit the activation form.
$("form#activation-Form").submit(function() {
    var formData = $("#activation-Form").serializeArray();
    var model = {};
   
    $.each(formData, function(i, el) {
        model[el.name] = el.value;
    });
    model["token"] = token;
    model["uuid"] = uuid;

    if (model.password !== model.cnfPassword) {
        $(".validation.global").text("Password and confirm password should be same.");
        $(".validation.global").show();
        return false;
    }

    delete model.cnfPassword;

    // If encryption enable, below code require to add in js file and jsencrypt.min.js library in html file.
    // ------------- Start ---------- //
    if (publicKey) {
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        model["password"] = encrypt.encrypt(model["password"]);
    }
    // ------------- End ---------- //
    model = JSON.stringify(model);
    $.ajax({
        url: "/admin/accountSetup?token=" + token,
        type: 'put',
        contentType: 'application/json',
        // below header(Public-Key) require if encryption of password is available.
        beforeSend: function(xhr) {
            if (publicKey) xhr.setRequestHeader('Public-Key', publicKey);
        },
        data: model,
        success: function(data) {
            window.location.href = "/admin/dashboardRedirect";
        },
        error: function(data) {
            $(".validation.global").text("Request Failed.");
            $(".validation.global").show();
        }
    });
    return false;
});