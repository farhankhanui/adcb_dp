var publicKey;

//For checking the signUp functionality is enable or not. IF enable than dispaly sign-up button.
checkSignUp($(".authscheme-signup"));

//For fetching the theme settings like logo.
fetchThemeSettings($(".generic-logo-size"), $("#provider-name"));

//Checking the user session
$.get("/admin/sessionCheck", function(data, status) {})
    .done(function(data) {
        if(data.status){
            window.location.href = "/admin/dashboardRedirect";
        }
    });

//Fetching the all enable Auth Schemes.
$.get("/admin/public/auth/schemes", function(data, status) {
    var authSchemes = data.authSchemes;
    if (data.publicKey) {
        publicKey = data.publicKey;
    }
    $.each(authSchemes, function(i, el) {
        if (el.authMethod != "DEFAULT") {
            var ele = $(".authscheme-card-sample").clone();
            ele.attr("data-login-id", el.url);
            ele.find(".title-info").text(el.name);
            ele.find(".desc-info").text(el.description);
            ele.removeClass("authscheme-card-sample").addClass("authscheme-card");
            $("#auth-schemes").append(ele);
            $(".auth-options").show();
        }
    })
    $(".authscheme-card-sample").hide();
});

//Click action on auth-schemes.
$("#auth-schemes").on("click", ".authscheme-card", function() {
    window.location = $(this).attr("data-login-id");
});

//Click action on sign-up button.
$(".authscheme-signup").click(function() {
    window.location.href = '/admin/app/registration';
});

//Validating the login information.
$("form#internal-authscheme-form").submit(function() {
    var formData = $("#internal-authscheme-form").serializeArray();
    var model = {};
    $.each(formData, function(i, el) {
        model[el.name] = el.value;
    });
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
        url: "/api/" + tenant + "/authenticate/login",
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        // below header(Public-Key) require if encryption of password is available.
        beforeSend: function(xhr) {
            if (publicKey) xhr.setRequestHeader('Public-Key', publicKey);
        },
        data: model,
        success: function(data) {
            if (data.referrer) {
                twindow.location.href = decodeURIComponent(data.referrer);
            } else {
                var dashboardPath = data.dashboardPath;
                if (dashboardPath) {
                    window.location.href = dashboardPath.pathname;
                } else {
                    window.location.href = "/admin/dashboardRedirect";
                }
            }
        },
        error: function(data) {
            // checking whether password expoired
            if (data.responseJSON.respCode === "13217") {
                // redirect if password is expired
                window.location.href = "/admin/app/change-password#token/" + data.responseJSON.token;
            }
            if (data.responseJSON.respMsg) {
                $(".validation").text(data.responseJSON.respMsg);
            }
            $(".validation").show();
        }
    });
    return false;
});