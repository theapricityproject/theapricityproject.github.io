function initSms() {
    console.log('initCall:: started');
    console.log('initCall:: finished');
}

function cancelSms() {

    closeOption('sms_wrapper');

    $('#txtSmsContent').val('');
    $('#smsForm').unblock();

    return false;
}

function submitSms() {
    var form = $('#frmSendSms'),
        telInput = $("#tel_input_sms"),
        errorMsg = $("#sms-error-msg");

    //clean errors
    if (errorMsg.hasClass('hidden') === false) {
        errorMsg.addClass('hidden');
    }

    form.parsley().validate();
    telInput.attr('placeholder', '');

    console.log('submitSms: ' + form.parsley().isValid());

     if (form.parsley().isValid() && telInput.intlTelInput("isValidNumber")) {
        console.log('btnSendSms::click start');
        try {
            var areaCode = telInput.intlTelInput("getSelectedCountryData").dialCode,
                target = telInput.intlTelInput("getNumber").replace('+', '').slice(areaCode.length),
                content = $("#txtSmsContent").val(),
                urlRes;
            console.log('areaCode: ' + areaCode);
            console.log('phone number(target): ' + target);
            console.log('sms message: ' + content);

            $('#smsForm').block({
                message: '<p id="smsTextMsg" class="blockUiMsg">' + getSystemMessageText('sms', 'requestLabel') + '</p>' +
                '<a id="btnCancelSms" onclick="return cancelSms()" class="userMsg cancel" href="#">' + getSystemMessageText('sms', 'closeButton') + '</a>',
                overlayCSS: {
                    backgroundColor: 'rgba(0,0,0,0.8)'
                }
            });

            $('#btnCancelSms').removeClass('hidden');
            //3. url parameters.
            urlRes = String.format(globalWidgetSettings.serverBaseApiUrl + 'action/sms/{0}/{1}/{2}?idSurfer={3}&page={4}&content={5}', SurferObjGUI.id_Customer, areaCode, target, SurferObjGUI.id_Surfer, ((typeof (SurferObjGUI.page) == "string") ? SurferObjGUI.page : SurferObjGUI.page[SurferObjGUI.page.length - 1]), encodeURIComponent(content));
            if (globalWidgetSettings.pageTitle !== undefined) {
                urlRes = String.format(urlRes + '&title={0}', globalWidgetSettings.pageTitle);
            }
            console.log('sms urlRes: ' + urlRes);
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
                    console.log('btnSendSms:exception: ' + e);
                }
                if (data.status) {
                    gaEvent('sms-widgetsuccess');
                    sentConversionBon('sms-widgetsuccess');
                    //show_msgCallSucceed();
                    showMsgSmsStatus("success", "sms send success");
                    if (data.allow_event)
                        try {
                            parent.pushEvent("sms", areaCode + target);
                        } catch (e) {
                            /*DO NOTHING*/
                        }
                    if (data.allow_conversion)
                        sentConversionBon('sms');
                    try{
                        parent.hiveContact({phone: areaCode + target});
                        //parent.hiveContact("phone="+areaCode + target);
                    }
                    catch (e){}
                }
                else {
                    gaEvent('sms-widgeterror');
                    sentConversionBon('sms-widgeterror');
                    showMsgSmsStatus("error", data.message);
                }
                return false;//prevent form submission
            }, function (data, textStatus, jqXHR) {
                gaEvent('sms-widgeterror');
                showMsgSmsStatus("error",getSystemMessageText('sms','errorSendSms'));// Sorry, we couldn't send your message. Please try again.//textStatus);
                return false;//prevent form submission
            });
        }
        catch (e) {
            console.log('btnSendSms:exception: ' + e);
        }
        finally {
            console.log('btnSendSms:: click finished');
            setTimeout(function () {
                $('#smsTextMsg').text(getSystemMessageText('sms','sentLabel'));//'Message delivered. Thank you for contacting us!');
            }, 8000);
            return false;//prevent form submission
        }
    }
    else {
         if(!telInput.intlTelInput("isValidNumber"))
             errorMsg.removeClass('hidden');
    }
    return false;//prevent form submission
}

function showMsgSmsStatus(status, msg) {//NEW
    switch (status) {
        case "proccess":
            $("#messagesms").removeClass('error');
            break;
        case "success":
            $("#messagesms").removeClass('error');
            break;
        case "error":
            $("#messagesms").addClass('error');
            break;

    }
    $("#messagesms").text(msg);
    $("#messagesms").slideDown();
    //setTimeout(function () {
    //    $("#messagesms").slideUp();
    //}, 10000);
}
