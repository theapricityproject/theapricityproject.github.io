function cancelEmail() {
    closeOption('email_wrapper');
    $('#email_inner').unblock();

    return false;
}

function submitEmail() {
    console.log('btnSendEmail::click start');

    var form = $('#frmSendEmail');

    form.parsley().validate();

    if (form.parsley().isValid()) {
        try {
            angular.element('#customTextCtrl').scope().UpdateVisitorDetails();
            var email = $("#txtEmailAddress").val(),
                name = $("#txtEmailName").val(),
                telephone = $("#txtEmailPhone").val(),
                content = $("#inputmessage").val(),
                urlRes;
            //
            if(content===undefined||content.trim()=='')
                return false;

            console.log('email: ' + email);
            console.log('name: ' + name);
            console.log('telephone: ' + telephone);
            console.log('content: ' + content);
            $('#email_inner').block({
                message: '<p class=blockUiMsg>' + getSystemMessageText('email', 'requestLabel') + '</p><a id="btnCancelEmail" onclick="return cancelEmail()" class="userMsg cancel" href="#">'+ getSystemMessageText('email', 'closeButton') +'</a>',
                overlayCSS: {
                    backgroundColor: 'rgba(0,0,0,0.8)'
                }
            });
            
            var lastPage=((typeof (SurferObjGUI.page) == "string") ? SurferObjGUI.page : SurferObjGUI.page[SurferObjGUI.page.length - 1]);
            urlRes = String.format(globalWidgetSettings.serverBaseApiUrl + 'action/email/{0}/{1}/{2}?idSurfer={3}&page={4}&telephone={5}&content={6}', SurferObjGUI.id_Customer, name, email, SurferObjGUI.id_Surfer, encodeURIComponent(lastPage), telephone, encodeURIComponent(content));
            
            if (globalWidgetSettings.pageTitle !== undefined) {
                urlRes = String.format(urlRes + '&title={0}', globalWidgetSettings.pageTitle);
            }
            console.log(urlRes);
            try {
                console.log(parent.AnalyticsClient);
                urlRes += "&analyticsid=" + parent.AnalyticsClient.accountUA + "&analyticsvisitor=" + parent.AnalyticsClient.gaId;
            } catch (e) {
                console.log('btnCallMe:exception: ' + e);
            }
            //5. send call.
            ajaxRequest(urlRes, function (data, textStatus, jqXHR) {
                try {
                    console.log(data);
                } catch (e) {
                    console.log('btnCallMe:exception: ' + e);
                }
                if (data.status) {
                    gaEvent('email-widgetsuccess');
                    sentConversionBon('email-widgetsuccess');
                    if (data.allow_event) {
                        try {
                            parent.pushEvent("email", areaCode + target);
                        } catch (e) {
                            console.log('btnCallMe:exception: ' + e);
                        }
                    }
                    if (data.allow_conversion) {
                        sentConversionBon('email');
                    }
                    try {
                        parent.hiveContact({email: email, name: name});
                    }
                    catch (e){}
                } else {
                    gaEvent('email-widgeterror');
                    sentConversionBon('email-widgeterror');
                     if(data.errcode && data.errcode==504){
                        var urlRes2 = 'https://dev-api01-eus.azurewebsites.net/log/1?p='+encodeURIComponent(urlRes);
                        ajaxRequest(urlRes2, function (data, textStatus, jqXHR) {});
                    }
                }
                return false;
            }, function (data, textStatus, jqXHR) {

                gaEvent('email-widgeterror');

                showMsgEmailStatus("error", getSystemMessageText('general', 'errorMsg105'));

                $('#email_inner').unblock();

                return false;
            });

        } catch (e) {
            console.log('btnSendEmail:exception: ' + e);
        } finally {
            console.log('btnSendEmail:: click finished');
            return false;
        }
    }
}

function showMsgEmailStatus(status, msg) {//NEW
    switch (status) {
        case "proccess":
            $("#messageemail").removeClass('error');
            break;
        case "success":
            $("#messageemail").removeClass('error');
            break;
        case "error":
            $("#messageemail").addClass('error');
            break;

    }
    $("#messageemail").text(msg);
    $("#messageemail").slideDown();

    //setTimeout(function () {
    //    $("#messageemail").slideUp();
    //}, 10000);
}
