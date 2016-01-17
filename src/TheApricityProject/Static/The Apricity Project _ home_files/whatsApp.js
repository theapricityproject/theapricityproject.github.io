function cancelWhatsApp() {

    closeOption('whatsapp_wrapper');

    $('#txtWhatsAppContent').val('');
    $('#whatsAppForm').unblock();

    return false;
}

function submitWhatsApp() {
    var form = $('#frmSendWhatsApp'),
        telInput = $("#tel_input_whatsapp"),
        errorMsg = $("#whatsapp-error-msg");

    //clean errors
    if (errorMsg.hasClass('hidden') === false) {
        errorMsg.addClass('hidden');
    }

    form.parsley().validate();
    telInput.attr('placeholder', '');

    console.log('submitWhatsApp: ' + form.parsley().isValid());


    if (form.parsley().isValid() && telInput.intlTelInput("isValidNumber")) {
        console.log('btnSendWhatsApp::click start');

        try {
            var areaCode = telInput.intlTelInput("getSelectedCountryData").dialCode,
                target = telInput.intlTelInput("getNumber").replace('+', '').slice(areaCode.length),
                content = $("#txtWhatsAppContent").val(),
                urlRes;
            console.log('areaCode: ' + areaCode);
            console.log('phone number(target): ' + target);
            console.log('whatsapp message: ' + content);

            $('#whatsAppForm').block({
                message: '<p id="whatsAppTextMsg" class="blockUiMsg">' +getSystemMessageText('email','requestLabel') + '</p><a id="btnCancelWhatsApp" onclick="return cancelWhatsApp()" class="userMsg cancel" href="#">Close</a>',
                overlayCSS: {
                    backgroundColor: 'rgba(0,0,0,0.8)'
                }
            });

            $('#btnCancelWhatsAPp').removeClass('hidden');
            //3. url parameters.
            urlRes = String.format(globalWidgetSettings.serverBaseApiUrl + 'action/whatsapp/{0}/{1}/{2}?idSurfer={3}&page={4}&content={5}', SurferObjGUI.id_Customer, 0, areaCode.toString() + target.toString(), SurferObjGUI.id_Surfer, ((typeof (SurferObjGUI.page) == "string") ? SurferObjGUI.page : SurferObjGUI.page[SurferObjGUI.page.length - 1]), encodeURIComponent(content));
            if (globalWidgetSettings.pageTitle !== undefined) {
                urlRes = String.format(urlRes + '&title={0}', globalWidgetSettings.pageTitle);
            }

            console.log('whats app urlRes: ' + urlRes);
            //google analytics parent injection
            try {
                urlRes += "&analyticsid=" + parent.AnalyticsClient.accountUA + "&analyticsvisitor=" + parent.AnalyticsClient.gaId;
                console.log(urlRes);
            } catch (e) {
                /*DO NOTHING*/
            }
            //5. send call.
            ajaxRequest(urlRes, function (data, textStatus, jqXHR) {
                try {
                    console.log(data);
                } catch (e) {
                    console.log('btnWhatsApp:exception: ' + e);
                }
                if (data.status) {
                    gaEvent('whatsapp-widgetsuccess');
                    sentConversionBon('whatsapp-widgetsuccess');
                    //show_msgCallSucceed();
                    showMsgWhatsAppStatus("success", "whatsApp send success");
                    if (data.allow_event)
                        try {
                            parent.pushEvent("whatsapp", areaCode.toString() + target.toString());
                        } catch (e) {
                            /*DO NOTHING*/
                            console.warn(e);
                        }
                    if (data.allow_conversion)
                        sentConversionBon('whatsapp');
                }
                else {
                    gaEvent('whatsapp-widgeterror');
                    sentConversionBon('whatsapp-widgeterror');
                    showMsgWhatsAppStatus("error", data.message);
                }
                return false;//prevent form submission
            }, function (data, textStatus, jqXHR) {
                gaEvent('whatsapp-widgeterror');
                showMsgWhatsAppStatus("error", textStatus);

                return false;//prevent form submission
            });
        }
        catch (e) {
            console.log('btnSendWhatsApp:exception: ' + e);
        }
        finally {
            console.log('btnSendWhatsApp:: click finished');
            setTimeout(function () {
                $('#whatsAppTextMsg').text(getSystemMessageText('email','sentLabel'));
            }, 8000);
            return false;//prevent form submission
        }
    }
    else {
        //errorMsg.removeClass('hidden');
    }
    return false;//prevent form submission
}

function showMsgWhatsAppStatus(status, msg) {//NEW
    switch (status) {
        case "proccess":
            $("#whatsAppTextMsg").removeClass('error');
            break;
        case "success":
            $("#whatsAppTextMsg").removeClass('error');
            break;
        case "error":
            $("#whatsAppTextMsg").addClass('error');
            break;

    }
    console.log('whatsApp response msg',msg);
    $("#whatsAppTextMsg").text(msg);
    $("#whatsAppTextMsg").slideDown();

    //setTimeout(function () {
    //    $("#whatsAppTextMsg").slideUp();
    //}, 10000);
}
