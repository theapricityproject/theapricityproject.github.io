//function getCountries(selectedCountry) {
//    var url = String.format('{0}getcountries/{1}', globalWidgetSettings.serverBaseApiUrl, globalWidgetSettings.bontactId);
//
//    console.log('url: ' + url);
//
//    ajaxRequest(url, function (data, textStatus, jqXHR) {
//        globalWidgetSettings.countriesArray = data;
//
//        //handleResult(data, selectedCountry);
//    }, function (data, textStatus, jqXHR) {
//        console.log('get countries error: ' + textStatus);
//    });
//}

function handleResult(data, selectedCountry) {
   if(selectedCountry=='N/A')
        selectedCountry='US';
    FillCountriesInput(data, selectedCountry, '#tel_input_callback');
    FillCountriesInput(data, selectedCountry, '#tel_input_sms');
    FillCountriesInput(data, selectedCountry, '#tel_input_whatsapp');
}

function FillCountriesInput(countries, selectedCountry, inputId) {
    var countryArray = new Array();

    $.each(countries, function (index, value) {
        countryArray.push(value.countrycode.substr(0, 2));
    });

    $(inputId).intlTelInput({
        onlyCountries: countryArray,
        autoHideDialCode: false,
        nationalMode: false,
        autoPlaceholder: true
    });
    window.selectedCountry = selectedCountry;
    $(inputId).intlTelInput("selectCountry", selectedCountry);

}

function initCall(selectedCountry) {
    console.log('initCall:: started');
    console.log('selectedCountry: ' + selectedCountry);
    handleResult(globalWidgetSettings.countriesArray, selectedCountry);
    //if (globalWidgetSettings.countriesArray !== undefined) {}
    //getCountries(selectedCountry);
    console.log('initCall:: finished');
}

function cancelCall() {
    //closeOption('callback_wrapper');

    $('#btnCancelCall').addClass('hidden');
    $('#callbackForm').unblock();

    return false;
}

//Click Send Call
function submitCall() {

    try {
        var form = $('#frmCallback'),
            telInput = $("#tel_input_callback"),
            errorMsg = $("#call-error-msg");

        //clean errors
        if (errorMsg.hasClass('hidden') === false) {
            errorMsg.addClass('hidden');
        }
        form.parsley().validate();

        telInput.attr('placeholder','');

        if (form.parsley().isValid() && telInput.intlTelInput("isValidNumber")) {
            console.log('btnCallMe::click start');

            var areaCode = telInput.intlTelInput("getSelectedCountryData").dialCode,
                target = telInput.intlTelInput("getNumber").replace('+', '').slice(areaCode.length);

            console.log('phone number(target): ' + target);

            $('#callbackForm').block({
                message: '<p id="callTextMsg" class="blockUiMsg">' + getSystemMessageText('call','requestLabel') + '</p><a id="btnCancelCall" onclick="return cancelCall()" class="userMsg cancel hidden" href="#">'+getSystemMessageText('call','closeButton')+'</a>',
                overlayCSS: {backgroundColor: 'rgba(0,0,0,0.8)'}
            });

            $('#btnCancelCall').removeClass('hidden');
            var urlRes = String.format(globalWidgetSettings.serverBaseApiUrl + 'action/callme/{0}/{1}/{2}?idSurfer={3}&page={4}', SurferObjGUI.id_Customer, areaCode, target, SurferObjGUI.id_Surfer, ((typeof (SurferObjGUI.page) == "string") ? SurferObjGUI.page : SurferObjGUI.page[SurferObjGUI.page.length - 1]));
            if (globalWidgetSettings.pageTitle !== undefined) {
                urlRes = String.format(urlRes + '&title={0}', globalWidgetSettings.pageTitle);
            }
            console.log('call back urlRes: ' + urlRes);
            //google analytics parent injection
            try {
                urlRes += "&analyticsid=" + parent.AnalyticsClient.accountUA + "&analyticsvisitor=" + parent.AnalyticsClient.gaId;
            } catch (e) {
                console.warn(e);
            }
            ////5. send call

            ajaxRequest(urlRes, function (data) {
                try {
                    console.log(data);
                } catch (e) {
                    console.log('btnCallMe:exception: ' + e);
                }

                if (data.status) {
                    sentConversionBon('call-widgetsuccess');
                    gaEvent('call-widgetsuccess');
                    if (data.allow_event) {
                        try {
                            parent.pushEvent("call", areaCode + target);
                        } catch (e) {
                            /*DO NOTHING*/
                        }
                    }
                    if (data.allow_conversion) {
                        sentConversionBon('call');
                    }
                    try{
                        parent.hiveContact({phone: areaCode + target});
                        //parent.hiveContact("phone="+areaCode + target);
                    }
                    catch (e){}
                } else {
                    sentConversionBon('call-widgeterror');
                    gaEvent('call-widgeterror');
                    var messageErr=getSystemMessageText('general','errorMsg'+data.code);
                    showMsgCallStatus("error", messageErr);//"Sorry, we couldn't place your call. Please try again.");
                    //showMsgCallStatus("error", getSystemMessageText('call','errorSendCall'));//"Sorry, we couldn't place your call. Please try again.");
                }
                //prevent form submission
                return false;

            }, function (data, textStatus) {
                gaEvent('call-widgeterror');

                //showMsgCallStatus("error", textStatus);

                //prevent form submission
                return false;
            });
            console.log('btnCallMe:: click finished');
        }
        else {
            errorMsg.removeClass('hidden');
        }
    } catch (e) {
        /*DO NOTHING*/
        return false;//prevent form submission
    }
    finally {
        setTimeout(function () {
            $('#callTextMsg').text(getSystemMessageText('call','nowLabel'))//('Now calling');
        }, 8000);

        //prevent form submission
        return false;
    }
}

function showMsgCallStatus(status, msg) {
    console.log('status:' + status + ' msg: ' + msg);
    cancelCall();
    switch (status.toLowerCase()) {
        case "proccess":
            $("#messagecalls").removeClass('error');
            break;
        case "success":
            $("#messagecalls").removeClass('error');
            break;
        case "error":
            $("#messagecalls").addClass('error');
            break;
        default:
            break;
    }
    $("#messagecalls").text(msg);
    $('#callMsg').removeClass('hidden').text(msg);
}
