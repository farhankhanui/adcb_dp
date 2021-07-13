var publicKey = fetchPublicKey();
var token = window.location.hash.split("/").length > 1 ? window.location.hash.split("/")[1] : null;

//For fetching the theme settings like logo (Optional call). 
fetchThemeSettings($(".generic-logo-size"));

//For vaidate the token (Required call). 
$.get("/admin/passwordResetTokenValidate?token=" + token, function(data, status) {
    if (data != true) {
        window.location.href = "/admin/app/invalidtoken";
    }
});

//Fetching the Passwword Policy (Required call).
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

//Submit the New Password form (Required call).
$("form#newpassword-form").submit(function() {
    var formData = $("#newpassword-form").serializeArray();
    var model = {};
    var data = {};

	
    $.each(formData, function(i, el) {
        model[el.name] = el.value;
        var paramName = el.name.toString();
        console.log("paramName = "+paramName);
        
        if (paramName == "token") {
			data.uuid = el.value.toString();
			
        }
        if (paramName == "password") {
			data.newPassword  = el.value;
        }
    });
    var json = JSON.stringify(data); 
    model["token"] = token;
    if (model.password !== model.cnfPassword) {
        $(".validation").text("Password and confirm password should be same.");
        $(".validation").show();
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
    // ----------- End ----------- //
    model = JSON.stringify(model);

    

    console.log ("start displaying model ");
    console.log(""+model);
    console.log ("end displaying model");

    console.log ("start displaying data v8");
    console.log(""+json);
    console.log ("end displaying data v8");
    $.ajax({
        url: "/admin/v2/users/password/reset/"+token,
        type: 'put',
        contentType: 'application/json; charset=utf-8',
        // below header(Public-Key) require if encryption of password is available.
        beforeSend: function(xhr) {
        	console.log("sending the request now");
            if (publicKey) xhr.setRequestHeader('Public-Key', publicKey);
        },
        data: json,
        success: function(data) {
        	console.log("update password is successful!");

        	// $(".center").html("Password changed successfully");

         
		   
		               
			
            $(".center").html('<div class="row-fluid">  <div class="span4 offset4 center public-form"> <p><img style="width:200px;height:100px;background-color: #273239;" src="common/images/adcb-white.svg" width="200px" height="100px" background-color="#273239" alt="AuthScheme Logo" class="defaultAuthSchemeLogo"></p>  <h1 class="leading">Your password is changed successfully</h1>    </div>  </div>   <div class="row-fluid"> <div class="span4 offset4 center checkmail">        <p>  <a href="/admin/homeRedirect">Return to homepage</a>      </div>    </div></div>');
            $("#adcb2").remove();
		    //$(".img").style("max-width: 144px; height: 44px; background-color: cyan");
			//$("img").style("max-width: 144px; height: 44px; background-color: blue");
			//$(":image").style("max-width: 144px; height: 44px; background-color: red");
			
			console.log("changing background-color");
            $("body").first().css("background-color","#273239");
            console.log("background color should be changed now!");
			
		   

            // Your delay in milliseconds
			var delay = 5000; 
			var redirectURL = "/admin/homeRedirect";
			setTimeout(function(){ window.location = redirectURL; }, delay);
        },
        error: function(data) {
        	console.log("update password is failed!");
            $(".validation").text("Request Failed.");
            $(".validation").show();
        }
    });
    return false;
});