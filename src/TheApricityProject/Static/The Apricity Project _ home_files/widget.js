var isMobileDevice = $.ua.device.type == "mobile";//!!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);
if(!isMobileDevice){
    isMobileDevice = $.ua.device.type == "tablet" && (window.screen.width<400|| window.screen.height<400);
}
//alert(isMobileDevice);
var globalWidgetSettings = {
        //baseUrl: 'https://widget-dev.bontact.com/',
        baseUrl: 'https://widget-prd.bontact.com/',
        //baseUrl: "http://localhost:8091",

        //dashboardUrl: "https://dashboard-dev.bontact.com/",
        dashboardUrl: "https://dashboard.bontact.com/",

        //serverBaseApiUrl: "https://api1-dev.bontact.com/widget/",
        serverBaseApiUrl: "https://prd-api01-eus.azurewebsites.net/widget/",
        //serverBaseApiUrl: "http://localhost:4000/widget/",

        serverWebSocket: "https://prd-socket01-eus.azurewebsites.net",
        //serverWebSocket: "http://localhost:443/",

        bontactId: undefined,
        pageUrl: '',
        countriesArray: undefined,
        data: '',
        isDesktop: 'true',
        isMobileResponsive: '',
        isMobile: '',
        fromWix: false,
        openBanner: true,
        pageTitle: undefined,
        isNoRepEmailSend: false,
        packSettingsData: undefined,
        enableLog: true,
        chatActive: false,
        SurferObjGUI: {},
        cookie: null,
        domain: '',
        isWixEditor: false,
        numberOfActiveChannels: undefined,
        mobilepopup:false
    },
    _currentChannel,
    _lastChannel,
    _w,
//_h,
    isDoingSomething = false,
    WIDGET_MAX_WIDTH = 390,
    WIDGET_MIN_WIDTH = 190,
    WIDGET_MINIMIZED_WIDTH = 72,
    WIDGET_MAX_CHANNELS = 5,
    WIDGET_MAX_HEIGHT = 476,
//WIDGET_MIN_HEIGHT = 310,
    WIDGET_MOBILE_MAX_WIDTH_DYN,
    oldHostCss,
//widgetHeightByChannel,
    SurferObjGUI,
    notAvail,
//numberOfActiveChannels = 5,
    lastSelectedSkin = 'skin-default';

function getSystemMessageText(channel, label) {
    var section = channel + 'SystemLables';
    var angElement = angular.element('#customTextCtrl');
    var _ = angElement.scope()._;
    //chatSystemLables  | callSystemLables | smsSystemLables | emailSystemLables | whatsAppSystemLables
    var text = angElement.scope()[section][label];

    if (angular.isUndefined(text) || _.isEmpty(text)) {
        console.warn('text not found for ', label, ' in channel ', channel);
        text = '';
    }

    return text;

}


function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

function ajaxRequest(url, successCallback, failCallback, method, dataType) {
    if (method === undefined || method === null) {
        method = "GET";
    }
    if (dataType === undefined || dataType === null) {
        dataType = "json";
    }

    jQuery.support.cors = true;
    $.ajax({
        url: url,
        cache: false,
        crossDomain: true,
        dataType: dataType,
        method: method,
        success: function (data, textStatus, jqXhr) {
            successCallback(data, textStatus, jqXhr);
        },
        error: function (jqXhr, textStatus, errorThrown) {
            failCallback(jqXhr, jqXhr.statusText, errorThrown);
        }
    });
}

function fixMobileKeyboard(isKeyboardopen) {
    //console.debug("fixMobileKeyboard start");
    var elem = parent.window.document.getElementsByTagName("body"),
        elem2 = parent.window.document.getElementById("bontact_main_widg"),
        newStyle = "";

    if (oldHostCss === undefined) {
        if ($(elem).attr("style") !== undefined)
            oldHostCss = $(elem).attr("style");
        else
            oldHostCss = "";
    }
    //console.debug("oldHostCss: " + oldHostCss);
    if (isKeyboardopen) {
        newStyle += "overflow:hidden;";//z-index: 9999;direction:ltr;position:relative;overflow-y: visible;
    } else {
        if (oldHostCss !== undefined) {
            newStyle = oldHostCss;
            oldHostCss = undefined;
        }
    }

    //console.debug("fixMobileKeyboard: " + newStyle);
    $(elem).attr("style", newStyle);
    $(elem2).attr("style", $(elem2).attr("style") + "top: 0;");
    //console.debug("fixMobileKeyboard finished");
}

function initWidgetAnimation() {
    gaEvent("custom image click");
    $("#widgetImg").remove();
    $("#bon-wrapper").removeClass("hidden");
    //$("#bon-rep").addClass("animated zoomIn");

    $("#bon-rep").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
        //console.debug("animation end");
    });
}

function changeSkin(skinNumber) {
    //console.debug('lastSelectedSkin', lastSelectedSkin);
    //console.debug('skinNumber', skinNumber);
    var cssSkinName;

    switch (skinNumber) {
        case 1:
            cssSkinName = "skin-black";
            break;
        case 5:
            cssSkinName = "skin-white";
            break;
        case 7:
            cssSkinName = "skin-blue";
            break;
        case 9:
            cssSkinName = "skin-green";
            break;
        case 10:
            cssSkinName = "skin-orange";
            break;
        case 12:
            cssSkinName = "skin-yellow";
            break;
        case 13:
            cssSkinName = "skin-red";
            break;
        case 14:
            cssSkinName = "skin-whatsapp";
            break;
        default:
            cssSkinName = 'skin-default';
            break;
    }
    //console.debug('cssSkinName', cssSkinName);
    $("#widget-body").removeClass(lastSelectedSkin);
    $("#widget-body").addClass(cssSkinName);
    lastSelectedSkin = cssSkinName;
    //console.debug('widget-body class', $("#widget-body").attr('class'));
    //console.debug('lastSelectedSkin', lastSelectedSkin);

    setTimeout(function () {
        $('#widget-body').show();
    }, 200);
}

function applyPosition() {
    var elem = parent.window.document.getElementById("bontact_main_ifrm");
    if (elem !== undefined && elem != null) {


        var elemStyleAttr = elem.getAttribute("style");

        //console.debug("applyPosition function");

        if (globalWidgetSettings.data.settings.widget.leftPosition) {
            //LEFT
            $("#widget-body").addClass("pos-left");
            elemStyleAttr += ";left:0";
            elem.setAttribute("style", elemStyleAttr);
        } else {
            //RIGHT
            $("#widget-body").addClass("pos-right");
            elemStyleAttr += ";right:0";
            elem.setAttribute("style", elemStyleAttr);
        }
        if (globalWidgetSettings.data.settings.widget.topPosition) {
            //TOP
            //$("#widget-body").addClass("pos-top");
            //elemStyleAttr += ";top:0";
            $("#widget-body").addClass("pos-bottom");
            elemStyleAttr += ";bottom:0";
            elem.setAttribute("style", elemStyleAttr);
        }
        else {
            //BOTTOM
            $("#widget-body").addClass("pos-bottom");
            elemStyleAttr += ";bottom:0";
            elem.setAttribute("style", elemStyleAttr);
        }
    }
}
function applyPackSettings() {
    var url = String.format("{0}channelstatus/{1}", globalWidgetSettings.serverBaseApiUrl, globalWidgetSettings.bontactId);

    //console.debug("applyPackSettings:: url:", url);

    ajaxRequest(url, function (data) {
        console.log("channelstatus:");
        console.log(data);

        globalWidgetSettings.packSettingsData = data;
        //if (!globalWidgetSettings.packSettingsData.whatsapp) {
        //    $("#whatsAppForm").addClass("hidden");
        //    $("#noWhatsApp").removeClass("hidden");
        //}

       if (!globalWidgetSettings.packSettingsData.callback) {
            console.log("hidden callback...");
            $("#callbackForm").addClass("hidden");
            $("#noCallback").removeClass("hidden");
        }
        else{
           $("#callbackForm").removeClass("hidden");
           $("#noCallback").addClass("hidden");
       }
        if (!globalWidgetSettings.packSettingsData.sms) {
            $("#smsForm").addClass("hidden");
            $("#noSms").removeClass("hidden");
        }
        else{
            $("#smsForm").removeClass("hidden");
            $("#noSms").addClass("hidden");
        }
        angular.element('#customTextCtrl').scope().statusBranding(globalWidgetSettings.packSettingsData.branding);


    }, function () {
        //console.debug("failure");
    });
}

function countChannels() {

    if (typeof globalWidgetSettings.numberOfActiveChannels === 'undefined') {
        globalWidgetSettings.numberOfActiveChannels = WIDGET_MAX_CHANNELS;

        try {
            if (!globalWidgetSettings.data.settings.widget.whatsapp_active) {
                $("#whatsapp").hide();
                globalWidgetSettings.numberOfActiveChannels -= 1;
            }

            if (!globalWidgetSettings.data.settings.widget.mail_active) {
                $("#email").hide();
                globalWidgetSettings.numberOfActiveChannels -= 1;
            }

            if (!globalWidgetSettings.data.settings.widget.sms_active) {
                $("#sms").hide();
                globalWidgetSettings.numberOfActiveChannels -= 1;
            }

            if (!globalWidgetSettings.data.settings.widget.callback_active) {
                $("#callback").hide();
                globalWidgetSettings.numberOfActiveChannels -= 1;
            }

            if (!globalWidgetSettings.data.settings.widget.chat_active) {
                $("#chat").hide();
                globalWidgetSettings.numberOfActiveChannels -= 1;
            }
        } catch (e) {
            console.warn('countChannels:: exception:', e);
        }
    }

    return globalWidgetSettings.numberOfActiveChannels;
}

function calcHeight(numberOfChannel) {
    return numberOfChannel * 56 + 86;
}

function initWidget() {
    //console.debug("is private banner: " + globalWidgetSettings.data.settings.widget.privateBanner);

    //if (globalWidgetSettings.data.settings.widget.privateBanner) {
    //    //show custom image
    //    $("#widgetImg").removeClass("hidden");
    //    $("#imgCustomPreloader").attr("src", globalWidgetSettings.data.settings.widget.imgSrc);
    //
    //    setTimeout(function () {
    //        //console.debug("imgCustomPreloader::" + $("#imgCustomPreloader").clientWidth);
    //        //todo:not all custom images has size defined prior to load, it might take few minutes to load
    //        resizeWidget($("#imgCustomPreloader").clientWidth, $("#imgCustomPreloader").clientHeight);
    //    }, 800);
    //}
    //else {
    //initWidgetAnimation();
    //}
    //apply color skin
    changeSkin(globalWidgetSettings.data.settings.widget.skin);
    ////apply custom texts

    //apply positing
    if (globalWidgetSettings.isDesktop) {
        //TASK: refactor later
        //console.debug("applyPermission::fromWix: " + globalWidgetSettings.fromWix);
        if (globalWidgetSettings.fromWix) {
            try {
                parent.Wix.Settings.getWindowPlacement(parent.Wix.Utils.getOrigCompId(), function (res) {
                    //console.debug("before applying positioning:" + res.placement);
                    switch (res.placement) {
                        case "BOTTOM_RIGHT":
                            globalWidgetSettings.data.settings.widget.leftPosition = false;
                            globalWidgetSettings.data.settings.widget.topPosition = false;
                            break;
                        case "BOTTOM_LEFT":
                            globalWidgetSettings.data.settings.widget.leftPosition = true;
                            globalWidgetSettings.data.settings.widget.topPosition = false;
                            break;
                        case "TOP_RIGHT":
                            globalWidgetSettings.data.settings.widget.leftPosition = false;
                            //globalWidgetSettings.data.settings.widget.topPosition = true;
                            globalWidgetSettings.data.settings.widget.topPosition = false;
                            break;
                        case "TOP_LEFT":
                            globalWidgetSettings.data.settings.widget.leftPosition = true;
                            //globalWidgetSettings.data.settings.widget.topPosition = true;
                            globalWidgetSettings.data.settings.widget.topPosition = false;
                            break;
                    }
                    applyPosition();
                });
            }
            catch (e) {
                //console.debug("applying positioning::exception:" + e);
            }
            finally {
                applyPosition();
            }
        }
        else {
            applyPosition();
        }
    }
    //start animation
    //var currentWidgetVerticalMenuState = $("#bon-rep").removeClass("animated zoomIn").attr("class").toLowerCase();

    //var url = String.format("{0}gettexts/{1}", globalWidgetSettings.serverBaseApiUrl, globalWidgetSettings.bontactId);
    ////console.debug(url);
    //
    //ajaxRequest(url, function (data, textStatus, jqXHR) {
    //    //console.debug("success", data);
    //    if (data.status.toString().toLowerCase() === "true") {
    //        //apply vertical menu labelsgit che
    //        $.each(data.texts, function (key, value) {
    //            //console.debug(value);
    //            switch (value.textId) {
    //                case 2:
    //                    //label2.setAttribute("data-hint", value.textValue);
    //                    break;
    //                case 3:
    //                    //label3.setAttribute("data-hint", value.textValue);
    //                    break;
    //                case 4:
    //                    //label4.setAttribute("data-hint", value.textValue);
    //                    break;
    //                case 5:
    //                //label5.setAttribute("data-hint", value.textValue);
    //                case 7:
    //                    label7.text(value.textValue);
    //                    break;
    //                case 8:
    //                    label7.text(label7.text() + " " + value.textValue);
    //                    break;
    //                case 10:
    //                    label10.val(value.textValue);
    //                    break;
    //                case 11:
    //                    label11.text(value.textValue);
    //                    break;
    //                case 13:
    //                    label13.val(value.textValue);
    //                    break;
    //                case 14:
    //                    label14.text(value.textValue);
    //                    break;
    //                case 16:
    //                    label16.val(value.textValue);
    //                    break;
    //                case 20:
    //                    label20.val(value.textValue);
    //                    break;
    //                case 23:
    //                    label23.text(value.textValue);
    //                    break;
    //            }
    //        });
    //    }
    //}, function (data, textStatus, jqXHR) {
    //        //console.debug("failure");
    //    });

    initChat();

    initCall(globalWidgetSettings.data.geo.country);

    initSms();

    try {
        initAnalytics();
    } catch (e) {
        console.warn(e)
    }

    try {
        //webhook to notify the parent that the widget is ready
        parent.widgetReady();
    }
    catch (e) {
        //DO NOTHING
    }

    var numberOfChannels = countChannels();
    //console.debug('countChannels', numberOfChannels);

    var isMinimized = readCookie('bontact-widget-state-is-minimized'),
        width = readCookie('bontact-widget-width'),
        height = readCookie('bontact-widget-height'),
        isOpened = readCookie('bontact-widget-channel-is-open'),
        lastChannel = readCookie('bontact-widget-channel-current'),
        lastChatTypedMessage = readCookie('bontact-widget-last-typed-chat-message'),
        resize = true;
    //alert('isMinimized: '+isMinimized);
    console.log("globalWidgetSettings.data.settings.widget");
    console.log(globalWidgetSettings.data.settings.widget.openBanner);
    if(!globalWidgetSettings.mobilepopup){
        $("#widget-body").addClass('widget-body-notpopup');
    }
    //if (typeof isMinimized === 'undefined' && $.ua.browser.name.toLowerCase()=='safari')
    //    isMinimized = false;
    //else
    if (typeof isMinimized === 'undefined')
        isMinimized = (!globalWidgetSettings.data.settings.widget.openBanner).toString();
    if ($.ua.browser.name.toLowerCase() == 'safari' && (isMinimized == true.toString())) {
        //if ( isMinimized==true){
        //debugger;
        isMinimized = false.toString();
        width = undefined;
        height = undefined;
        setTimeout(function () {
            bon_X();
        }, 500);
    }


    if (isMobileDevice) {
        isMinimized = true.toString();
        width = undefined;
        height = undefined;
        lastChannel = undefined;
    }
    //console.debug('cookie settings:');
    //console.debug('isMinimized', isMinimized);
    //console.debug('width', width);
    //console.debug('height', height);
    //console.debug('isOpened', isOpened);
    //console.debug('lastChannel', lastChannel);
    //console.debug('lastChatTypedMessage', lastChatTypedMessage);
    //console.debug('resize', resize);
    //console.debug('is wix editor mode', globalWidgetSettings.isWixEditor);

    //console.debug('active channels:');
    //console.debug("email_active:" + globalWidgetSettings.data.settings.widget.mail_active);
    //console.debug("sms_active:" + globalWidgetSettings.data.settings.widget.sms_active);
    //console.debug("callback_active:" + globalWidgetSettings.data.settings.widget.callback_active);
    //console.debug("chat_active:" + globalWidgetSettings.data.settings.widget.chat_active);

    if (typeof width === 'undefined') {
        width = WIDGET_MIN_WIDTH;
    }

    if (typeof height === 'undefined') {
        height = calcHeight(countChannels());
    }

    if(!globalWidgetSettings.mobilepopup) {

        if (!globalWidgetSettings.isDesktop && !globalWidgetSettings.isWixEditor) {
            $("#bon-x").click();
        } else {
            //desktop
            //console.debug('typeof', typeof isMinimized === 'undefined');
            if (typeof isMinimized === 'undefined') {
                if (!globalWidgetSettings.openBanner) {
                    isMinimized = 'true';
                } else {
                    isMinimized = 'false';
                }

                //console.debug('isMinimized from open banner', isMinimized);
                writeCookie('bontact-widget-state-is-minimized', isMinimized);
            }
            console.log('typeof isMinimized', typeof isMinimized);
            if (isMinimized === 'true') {
                bon_X();
                //$("#bon-x").click();
            } else {
                $("#widget-body").removeClass("trans");
                $("#widget-body").addClass("notTrans");
                if (typeof isOpened !== 'undefined' && isOpened === 'true') {
                    if (typeof lastChannel !== 'undefined') {
                        resize = false;
                        openChannel(lastChannel);
                        //$("#txtChatMsg").text(lastChatTypedMessage);
                        $("#chatFeedWrapper").animate({scrollTop: $("#widgetInner").height()}, 200);
                    }
                }
                if (resize === true) {
                    if (typeof width !== 'undefined' && isMinimized === 'false') {
                        width = WIDGET_MIN_WIDTH;
                        height = calcHeight(countChannels());
                    }

                    resizeWidget(width, height).then(function () {
                        $('#widget-body').show();
                    });
                }
            }

        }

        if (!globalWidgetSettings.isDesktop) {
            resizeWidget(WIDGET_MOBILE_MAX_WIDTH_DYN, calcHeight(countChannels())).then(function () {
                $('#widget-body').show();
            });
        }
    }
    else{
        $("#bon-wrapper").hide();
        $("#bon-wrapper2").css('position','static');
        $("#bon-wrapper2").css('max-width','100%');
        $("#chat_wrapper").css('position','static');
        $("#email_wrapper").css('position','static');
        $("#sms_wrapper").css('position','static');
        $("#callback_wrapper").css('position','static');
        $(".footer-section").css('position','static');

        selectedType(globalWidgetSettings.selectChannel);
    }
    if (numberOfChannels === 0) {
        resizeWidget(0, 0);
        $('html').remove();
    }
}

function initChat() {
    SurferObjGUI.browseType = $.ua.browser.name;
    SurferObjGUI.browseVersion = $.ua.browser.version;
    SurferObjGUI.os = $.ua.os.name;
    SurferObjGUI.mobile = isMobileDevice;

    //console.debug(SurferObjGUI.browseType);
    //console.debug(SurferObjGUI.browseVersion);
    //console.debug(SurferObjGUI.os);
    var timer = (globalWidgetSettings.data.settings.widget.bumpingSecound);
    var chatActive = (globalWidgetSettings.data.settings.widget.chat_active);
    var bumpingStatus = (globalWidgetSettings.data.settings.widget.bumpingStatus);
    if(isMobileDevice)
        bumpingStatus=false;

    if (chatActive&&bumpingStatus && _currentChannel != "chat_wrapper") {

        setTimeout(function () {
            //alert();
            if (_currentChannel === undefined || _currentChannel == null)
                selectedType('chat');
        }, (timer * 1000));
    }

    //startAndConnect();
}

function selectedType(Identification) {
    if (isMobileDevice&&!globalWidgetSettings.mobilepopup) {
        //alert("select " + Identification);
        //if(window.location.hostname=='localhost')
        //window.open('http://'+window.location.hostname+':'+window.location.port+'/widget.html?bontactid='+globalWidgetSettings.bontactId+'&mobilepopup=true&selectChannel='+Identification,'_blank');

        window.open(globalWidgetSettings.baseUrl+'widget.html?bontactid='+globalWidgetSettings.bontactId+'&mobilepopup=true&selectChannel='+Identification+'&idSurfer='+SurferObjGUI.idSurfer,'_blank');
        angular.element('#customTextCtrl').scope().changeStatus(STATUS_SURFER.CHAT);

    }
    else {


        var openNow = Identification;
        //console.debug("openNow value:" + openNow);

        if (notAvail) {
            Identification = 'notavail';
        }

        //console.debug('isDoingSomething', isDoingSomething);
        if (!isDoingSomething) {
            $("#" + openNow).addClass("selected_color");
            //var currentWidgetVerticalMenuState = $("#bon-rep").attr("class").toLowerCase();
            ////console.debug("selectedType:: currentWidgetVerticalMenuState: " + currentWidgetVerticalMenuState);
            //switch (currentWidgetVerticalMenuState) {
            //    case "expanded":
            //        $("#bon-rep").removeClass().addClass("expanded");
            //        break;
            //    case "collapsed":
            //        $("#bon-rep").removeClass().addClass("collapsed");
            //        break;
            //}
            //console.debug("selectedType:: _currentChannel: " + _currentChannel);
            var iii = Identification + "_wrapper";
            if (iii === _currentChannel)
                return false;

            //console.debug("going to call openChannel with Identification: " + Identification);

            $("#" + _lastChannel).removeClass("selected_color");
            //hide the current open window
            //console.debug("openChannel::_currentChannel: " + _currentChannel);
            if (_currentChannel != undefined || _currentChannel != null) {

                closeOption(_currentChannel, false);
            }

            openChannel(Identification);

            _lastChannel = openNow;
        }
    }
    //console.debug("selectedType:: finished");
}

function openChannel(identification) {

    isDoingSomething = true;
    //console.debug("openChannel:: started");
    function cb(el) {
        $("#widget-body").css("overflow", "visible");//deals with the scroll bar that might be shown when animation starts

        _currentChannel = el.attr("id");
        isDoingSomething = false;

        writeCookie('bontact-widget-channel-current', identification.toLowerCase());

        switch (_currentChannel.toLowerCase()) {
            case "chat_wrapper":
                $("#txtChatMessage").focus();

                angular.element('#customTextCtrl').scope().changeStatus(STATUS_SURFER.CHAT);
                gaEvent("Click chat");
                break;
            case "callback_wrapper":
                angular.element('#customTextCtrl').scope().changeStatus(STATUS_SURFER.CALL);
                gaEvent("Click callback");
                $("#helper_tel_input_callback").focus();
                break;
            case "sms_wrapper":
                angular.element('#customTextCtrl').scope().changeStatus(STATUS_SURFER.SMS);
                gaEvent("Click sms");
                $("#helper_tel_input_sms").focus();
                break;
            case "email_wrapper":
                angular.element('#customTextCtrl').scope().changeStatus(STATUS_SURFER.MAIL);
                gaEvent("Click email");
                $("#txtEmailName").focus();
                break;
            case "whatsapp_wrapper":
                gaEvent("Click whatsapp");
                $("#txtWhatsAppContent").focus();
                break;
        }
    };

    writeCookie('bontact-widget-channel-is-open', true);
    writeCookie('bontact-widget-state-is-minimized', false);

    if (globalWidgetSettings.isDesktop) {

        resizeWidget(WIDGET_MAX_WIDTH, WIDGET_MAX_HEIGHT).then(function () {
            $("#bonPowerExpd").addClass("hidden");
            $("#bonPowerCol").removeClass("hidden");
            isDoingSomething = true;

        }, function (error) {
            console.warn(error);
        });

        $(".dock-container").addClass("collapsed");


    } else {
        $(".dock-container").addClass("hidden");

        var elemIfrm = parent.window.document.getElementById("bontact_main_ifrm"),
            elemMainWidg = parent.window.document.getElementById("bontact_main_widg");

        $(elemIfrm).attr("style", "overflow-y: scroll;bottom: 0;right: 0;");
        $(elemMainWidg).attr("style", "z-index: 9999;direction:ltr;height: 100vh;width: 100vw;overflow-y: auto;position: fixed;right:0;");

        resizeWidget(window.screen.outerWidth, window.screen.outerHeight).then(function () {
            isDoingSomething = true;
        });

        fixMobileKeyboard(true);
    }

    $("#widget-body").css('overflow','hidden');
    //console.debug("openChannel: " + identification);

    //$("#widget-body").css("overflow", "hidden");//deals with the scroll bar that might be shown when animation starts

    isDoingSomething = true;

    var elem = $("#" + identification + "_wrapper");

    elem.removeClass("hidden");

    if (isLegacyIE()) {
        cb(elem);
    }
    else {
        $("#widget-body").removeClass("notTrans").addClass("trans");
        elem.addClass("animated slideInUp").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
            var that = this;

            //console.debug("that.id: " + that.id);

            $("#" + that.id).removeClass("animated slideInUp");//cleans the current window animation flow

            cb($("#" + that.id));
        });
    }


    //console.debug("openChannel:: finished");
}

function closeOption(identity, shouldResize) {
    isDoingSomething = true;
    gaEvent("close widget (min)");

    writeCookie('bontact-widget-channel-is-open', false);
    writeCookie('bontact-widget-state-is-minimized', true);
    angular.element('#customTextCtrl').scope().changeStatus(STATUS_SURFER.Waiting);

    if(globalWidgetSettings.mobilepopup){
        window.close();
        return;
    }
    function cb(el) {
        $("#widget-body").css("overflow", "visible");//deals with the scroll bar that might be shown when animation starts
        //$(".dock-container").addClass("collapsed");
        if (globalWidgetSettings.isDesktop && shouldResize) {

            $(".dock-container").addClass("collapsed");

            setTimeout(function () {
                $("#bonPowerExpd").addClass("hidden");
                $("#bonPowerCol").removeClass("hidden");
                $(".dock-container").removeClass("hidden");
            }, 300);

            resizeWidget(WIDGET_MINIMIZED_WIDTH, calcHeight(countChannels())).then(function () {
                isDoingSomething = false;
            });
        }

        if (!globalWidgetSettings.isDesktop) {
            if (_currentChannel === undefined || _currentChannel === null) {
                $(".dock-container").removeClass("hidden");

                resizeWidget(WIDGET_MINIMIZED_WIDTH, calcHeight(countChannels())).then(function () {
                    isDoingSomething = false;
                });

                var elem = parent.window.document.getElementById("bontact_main_ifrm"),
                    elem2 = parent.window.document.getElementById("bontact_main_widg");

                $(elem).attr("style", "overflow-y: scroll;bottom: 0;right: 0;position: fixed;");
                $(elem2).attr("style", "position:fixed;z-index: 9999;direction:ltr;");

                fixMobileKeyboard(false);
            }
        }
    }

    //console.debug("closeOption:: shouldResize: " + shouldResize);

    if (typeof shouldResize === 'undefined' || shouldResize === null) {
        shouldResize = true;
    }
    //console.debug("closeOption:: identity:" + identity);
    //console.debug("_currentChannel:" + _currentChannel);
    $("#widget-body").css("overflow", "hidden");//deals with the scroll bar that might be shown when animation starts
    $("#" + _lastChannel).removeClass("selected_color");

    var elem = $("#" + identity);

    if (isLegacyIE()) {
        cb(elem);
    }
    else {
        $("#widget-body").removeClass("notTrans").addClass("trans");
        elem.addClass("animated slideOutDown").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
            $("#" + identity).removeClass("animated slideOutDown").addClass("hidden");
            var that = this;
            //console.debug("that.id: " + that.id);

            cb($("#" + that.id));
        });
    }
    _currentChannel = null;
}

function resizeWidget(w, h) {
    var promise = $.Deferred();
    //hack: fix 4px for height since wix has some croping on the iframe level
    h += 4;

    //console.debug('resize: width::', w);
    //console.debug('resize: height::', h);

    setTimeout(function () {
        //console.debug("globalWidgetSettings.fromWix: " + globalWidgetSettings.fromWix);
        if (globalWidgetSettings.fromWix) {
            try {
                //console.debug("calling wix to resize the parent iframe with height:" + h + " width: " + w);
                parent.Wix.resizeWindow(w, h, function () {
                    //console.debug("returned from Wix.resizeWindow");
                });
            }
            catch (e) {
                console.warn("resizeWidget::parent.resizeWindow:exception:", e);
            }
        }
        //NOT WIX
        //get parent window screen size
        try {
            var bonFrame = parent.window.document.getElementById("bontact_main_ifrm");

            bonFrame.width = w;
            bonFrame.height = h;
            bonFrame.style.width=w+"px";
            bonFrame.style.height=h+"px";
            promise.resolve("OK");
        }
        catch (e) {
            promise.reject(e);
        }

    }, 30);

    return promise;
}

function wrapUniqueKey(key) {
    //console.debug('wrapUniqueKey: globalWidgetSettings.domain', globalWidgetSettings.domain);
    //console.debug('wrapUniqueKey: key', key);
    var keyWrapper = key + '_' + globalWidgetSettings.domain;

    //console.debug('wrapUniqueKey: keyWrapper', keyWrapper);

    return keyWrapper;
}

function writeCookie(key, value) {
    //console.debug('writeCookie: key:', key);
    //console.debug('writeCookie: value(' + key + '):', value);
    //console.debug('writeCookie: globalWidgetSettings.isWixEditor:', globalWidgetSettings.isWixEditor);

    if (globalWidgetSettings.isWixEditor) {
        return;
    }

    try {
        globalWidgetSettings.cookie.set(wrapUniqueKey(key), value);
    } catch (e) {
        console.warn('writeCookie exception', e);
    }
}

function readCookie(key) {
    //console.debug('readCookie:: key:', key);
    //console.debug('readCookie:: globalWidgetSettings.isWixEditor', globalWidgetSettings.isWixEditor);

    if (globalWidgetSettings.isWixEditor) {
        return undefined;
    }

    try {
        var value = globalWidgetSettings.cookie.get(wrapUniqueKey(key));
        //console.debug('readCookie:: value(' + key + '):', value);

        return value;
    } catch (e) {
        console.warn('readCookie:: exception:', e);
    }
}

/** tries to remove any bontact iframe that was added by mistake */
function cleanIframes() {
    try {
        if (parent.window.isBonWidgetLoadedOnce === undefined) {
            parent.window.isBonWidgetLoadedOnce = false;
        } else if (parent.window.isBonWidgetLoadedOnce === true) {
            //"terminating this instance"
            appInsights.trackEvent("BON-WIDGET-2.2", {
                "id_Customer": globalWidgetSettings.bontactId
            }, {"widget_found_multiple_instances": 1});

            return false;
        }

        var parentBonScripts = parent.document.getElementsByTagName("head")[0].getElementsByTagName("script"),
            parentBonframes = parent.document.getElementsByTagName("iframe"),
            bonCount = 0,
            i;

        for (i = 0; i < parentBonScripts.length; i++) {
            var isFound = parentBonScripts[i].src.toLowerCase().search("bontact.script.js");
            if (isFound) {
                //console.debug("item.id: " + parentBonScripts[i]);
                bonCount++;
            }
            if (bonCount > 1) {
                //console.debug(parentBonScripts[i]);
                //console.debug("going to remove script");
                parentBonScripts[i].remove();
                bonCount--;
            }
        }
        bonCount = 0;
        for (i = 0; i < parentBonframes.length; i++) {
            if (parentBonframes[i].id === "bontact_main_ifrm") {
                bonCount++;
            }
            if (bonCount > 1) {
                $(parentBonframes[i]).remove();
                bonCount--;
            }
        }
        var element = parent.document.getElementsByClassName("bonMain_right");
        for (i = 0; i < element.length; i++) {
            var numberOfChildren = element[i].getElementsByTagName("*").length;
            if (numberOfChildren === 0) {
                parent.window.isBonWidgetLoadedOnce = true;
                try {
                    $(element[i]).remove();
                } catch (e) {
                    /*DO NTOHING*/
                }
            }
        }
    } catch (e) {
        //DO NOTHING
    }
}

function buildUrl(filePath) {
    return globalWidgetSettings.baseUrl + filePath;
}

//MAIN
function mainInit() {
    var promise = $.Deferred();

    try {
        var elem = parent.window.document.getElementById("bontact_main_ifrm");
        var qsParams;
        if (elem !== undefined&&elem != null)
            qsParams = elem.getAttribute("qsparams");
        else
            qsParams = getParams();
        try {
            globalWidgetSettings.pageTitle = parent.window.document.getElementsByTagName("title")[0].innerHTML;
        }
        catch (ex) {
            console.warn("page title was not defined in host");
        }

        //console.debug("main:settings::qsParams::: " + qsParams);

        if (qsParams !== undefined || qsParams !== null) {
            var res = qsParams.split("&");
            //console.debug("main::res: " + res.length);
            //
            if ($.ua.browser.name === 'IE') {
                globalWidgetSettings.isDesktop = window.screen.width > 767 ? true : false;
                globalWidgetSettings.isMobile = window.screen.width <= 767 ? true : false;
            }
            //console.debug("globalWidgetSettings.isDesktop: " + globalWidgetSettings.isDesktop);

            if (globalWidgetSettings.isDesktop) {
                _w = WIDGET_MIN_WIDTH;
            } else {
                var currentIfrmStyle = "overflow-y:scroll;" + elem.getAttribute("style");

                //console.debug("currentIfrmStyle:: " + currentIfrmStyle);
                elem.setAttribute("style", currentIfrmStyle);
                WIDGET_MOBILE_MAX_WIDTH_DYN = window.screen.outerWidth;

            }

            if (WIDGET_MOBILE_MAX_WIDTH_DYN <= 768 && !globalWidgetSettings.isDesktop) {
                //console.debug("below and equal to 768");

                //head.load(buildUrl("/css/media.min.css?ver=2.2"));

                $(".channelbtn").unbind("mouseenter mouseleave");
                writeCookie('bontact-widget-state-is-minimized', true);
            }

            res.forEach(function (entry) {
                //console.debug(entry);
                if (entry !== undefined || entry !== null) {
                    var item = entry.split("=");
                    //console.debug(item);
                    //console.debug("item[0]: " + item[0]);
                    //console.debug("item[1]: " + item[1]);

                    switch (item[0].toLowerCase()) {
                        case "bontactid":
                            //console.debug('bontactid');
                            //TASK: refactor into a setter method
                            if (item[1] !== undefined)
                                globalWidgetSettings.bontactId = item[1];
                            else {
                                //console.debug("NO CUSTOMER ID !!! ABORTING");
                                appInsights.trackEvent("BON-WIDGET-2.2", {
                                    "id_Customer": globalWidgetSettings.bontactId,
                                    "reason": "NO CUSTOMER ID"
                                }, {"widget_init_success": 0});
                                promise.reject("ERROR: NO CUSTOMER ID");

                                return false;
                            }
                            break;
                        case "lang":
                            //console.debug('lang');
                            break;
                        case "referrer":
                            //console.debug('referrer: item[1]::', item[1]);
                            if (item[1] !== undefined) {
                                globalWidgetSettings.domain = extractDomain(item[1]);
                            }
                            break;
                        case "fromwix":
                            //console.debug('fromwix');
                            //console.debug("globalWidgetSettings.fromWix: " + item[1]);
                            globalWidgetSettings.fromWix = item[1];
                            break;
                        case "mobilepopup":
                           globalWidgetSettings.mobilepopup =Boolean(item[1]);
                            break;
                        case "selectchannel":
                            globalWidgetSettings.selectChannel =(item[1]);
                            break;
                        case "idsurfer":
                            globalWidgetSettings.idSurfer=(item[1]);
                            break;

                    }
                }
            });

            if (globalWidgetSettings.fromWix) {
                try {
                    //console.debug("Wix.getSiteInfo:: started:");

                    parent.Wix.getSiteInfo(function (siteInfo) {
                        //console.debug('siteInfo', siteInfo);

                        globalWidgetSettings.pageUrl = siteInfo.url;
                        globalWidgetSettings.domain = extractDomain(globalWidgetSettings.pageUrl);

                        writeCookie('bontact-widget-domain', globalWidgetSettings.domain);

                        //console.debug('fromwix:: globalWidgetSettings.pageUrl: ', globalWidgetSettings.pageUrl);

                        var url = String.format("{0}updatewebsite/{1}?url={2}", globalWidgetSettings.serverBaseApiUrl, globalWidgetSettings.bontactId, globalWidgetSettings.pageUrl);

                        ajaxRequest(url, function (data, textStatus, jqXHR) {
                            //console.debug("Success");
                        }, function (data, textStatus, jqXHR) {
                            //console.debug("failure");
                        });

                        //console.debug("Wix.getSiteInfo:: finished:");
                        globalWidgetSettings.isWixEditor = globalWidgetSettings.pageUrl.indexOf('editor.wix') !== -1 ? true : false;
                    });
                }
                catch (ex) {
                    console.warn(ex);
                }
            }
            else {
                globalWidgetSettings.pageUrl = document.referrer.toString();
                globalWidgetSettings.isWixEditor = globalWidgetSettings.pageUrl.indexOf('editor.wix') !== -1 ? true : false;
                //(window.location != window.parent.location) ? document.referrer : document.location;
            }

            //console.debug('globalWidgetSettings.pageUrl: ', globalWidgetSettings.pageUrl);

            if (typeof globalWidgetSettings.domain === 'undefined' || globalWidgetSettings.domain === null || globalWidgetSettings.domain === '') {
                globalWidgetSettings.domain = extractDomain(globalWidgetSettings.pageUrl);
                writeCookie('bontact-widget-domain', globalWidgetSettings.domain);
            }

            //console.debug("globalWidgetSettings.pageUrl: " + globalWidgetSettings.pageUrl);
            //console.debug("globalWidgetSettings.bontactId: " + globalWidgetSettings.bontactId);

            var url = String.format("{0}getsettings/{1}?page={2}", globalWidgetSettings.serverBaseApiUrl, globalWidgetSettings.bontactId, globalWidgetSettings.pageUrl);

            //console.debug("parent document url: " + parent.window.document.location);
            //console.debug("url: " + url);

            ajaxRequest(url, function (data) {

                //console.debug("main:settings::status:::" + data.status);
                //console.debug(data);

                if (data.status === false) {
                    promise.reject("ERROR: WIDGET IS DISABLED FROM DASH");
                    if (globalWidgetSettings.data.SurferObjGUI) {
                        appInsights.trackEvent("BON-WIDGET-2.2", {
                            "id_Customer": globalWidgetSettings.data.SurferObjGUI.id_Customer,
                            "idSurfer": globalWidgetSettings.data.SurferObjGUI.id_Surfer
                        }, {"widget_init_success": 0});
                    } else {
                        appInsights.trackEvent("BON-WIDGET-2.2", {
                            "id_Customer": 0,
                            "idSurfer": 0
                        }, {"widget_init_success": 0});
                    }

                    return false;
                }

                globalWidgetSettings.data = data;
                globalWidgetSettings.countriesArray = data.countriesSupport;
                window.localStorage['globalWidgetSettings'] = JSON.stringify(globalWidgetSettings);

                SurferObjGUI = globalWidgetSettings.data.SurferObjGUI;

                console.dir(SurferObjGUI);
                if(isMobileDevice&&globalWidgetSettings.idSurfer)
                    SurferObjGUI.id_Surfer=globalWidgetSettings.idSurfer;
                else
                    SurferObjGUI.id_Surfer = getIdSurfer();

                SurferObjGUI.idSurfer = SurferObjGUI.id_Surfer;

                try {
                    angular.element('#customTextCtrl').scope().init(data);
                }
                catch (e) {
                    console.log('customTextCtrl init error..');

                    setTimeout(function () {
                        console.log('try again');
                        try {
                            angular.element('#customTextCtrl').scope().init(data);
                        }
                        catch (e) {
                            console.log('customTextCtrl init error again..');
                        }
                    }, 1000);
                }
                if (typeof data.settings.widget === 'undefined') {

                    appInsights.trackEvent("BON-WIDGET-2.2", {
                        "id_Customer": globalWidgetSettings.bontactId,
                        "reason": "ERROR: NO WIDGET SETTINGS FOUND"
                    }, {"widget_init_success": 0});

                    notAvail = true;
                    promise.reject("ERROR: NO WIDGET SETTINGS FOUND");

                    return false;
                }

                globalWidgetSettings.idCustomer = data.settings.widget.id_Customer;

                //console.debug("globalWidgetSettings.idCustomer: " + globalWidgetSettings.idCustomer);
                //DEPLOY (should not be hidden)
                //globalWidgetSettings.serverWebSocket = data.config.servers.websocket;
                //console.debug("data.settings.widget.openBanner: " + data.settings.widget.openBanner);
                //console.debug("websocket: " + globalWidgetSettings.serverWebSocket);

                globalWidgetSettings.openBanner = data.settings.widget.openBanner;




				
                appInsights.trackEvent("BON-WIDGET-2.2", {
                    "id_Customer": globalWidgetSettings.data.SurferObjGUI.id_Customer,
                    "idSurfer": globalWidgetSettings.data.SurferObjGUI.id_Surfer
                }, {"widget_init_success": 1});

                if (data.status.toString().toLowerCase() === "true") {
                    //console.debug("parent.window.screen.availWidth: " + parent.window.screen.availWidth);
                    //console.debug("window.screen.availHeight: " + window.screen.availHeight);

                    initWidget();
                    promise.resolve("ok");
                }
                else {
                    //console.debug("WIDGET LOADING ABORTED !!! TRY TO RELOAD!");

                    appInsights.trackEvent("BON-WIDGET-2.2", {
                        "id_Customer": globalWidgetSettings.data.SurferObjGUI.id_Customer,
                        "idSurfer": globalWidgetSettings.data.SurferObjGUI.id_Surfer
                    }, {"widget_init_success": 0});

                }

            }, function (data, textStatus, jqXHR) {
                console.warn("FAILED TO LOAD SETTINGS" + textStatus);

                appInsights.trackEvent("BON-WIDGET-2.2", {
                    "id_Customer": globalWidgetSettings.bontactId
                }, {"widget_init_success": 0});
                notAvail = true;
                if (window.localStorage['globalWidgetSettings'] !== undefined) {
                    try {
                        globalWidgetSettings = JSON.parse(window.localStorage['globalWidgetSettings']);

                        try {
                            angular.element('#customTextCtrl').scope().init(globalWidgetSettings.data);
                        }
                        catch (e) {
                            console.log('customTextCtrl init error..');

                            setTimeout(function () {
                                console.log('try again');
                                try {
                                    angular.element('#customTextCtrl').scope().init(globalWidgetSettings.data);
                                }
                                catch (e) {
                                    console.log('customTextCtrl init error again..');
                                }
                            }, 1000);
                        }

                        SurferObjGUI = globalWidgetSettings.data.SurferObjGUI;
                        globalWidgetSettings.data.settings.widget.bumpingStatus = false;
                        console.dir(SurferObjGUI);

                        SurferObjGUI.id_Surfer = getIdSurfer();
                        initWidget();
                        promise.resolve("ok");
                    }
                    catch (e) {
                    }
                }

            });

            applyPackSettings();
            ga('set', 'userId', globalWidgetSettings.bontactId ); // Set the user ID using signed-in user_id.
        }

        //if (! globalWidgetSettings.isDesktop) {
        //    setTimeout(function () {
        //        $("#bon-x").click();
        //    }, 3000);
        //}

    }
    catch (ex) {
        /*DO NOTHING - IT MEANS NO IFRAME EXISTS*/
        promise.reject(ex);
    }

    return promise;
}

function init() {
    //clean unneeded iframes
    cleanIframes();

    if (isLegacyIE()) {
        console.warn("Bontact: your browser doesn't support this widget. consider upgrading to a newer browser.");
        appInsights.trackEvent("BON-WIDGET-LEGACY-2.2", {'reason': 'browser is not supported'}, {"widget_init_success": 0});

        return false;
    }
    var timerMilsec=(5 * 60000);

     $('#widget-body').idleTimer(timerMilsec);
    //$('#widget-body').idleTimer(10000);
    $('#widget-body').idleTimer('pause');

    globalWidgetSettings.cookie = Cookies.noConflict();

    mainInit().then(function () {
        try {
            //DetectRTC.load(function () {
            //    var wcam = "Has web camera:" + DetectRTC.hasWebcam;
            //    //console.debug(wcam);
            //    gaEvent("WEB-RTC: " + wcam);
            //    //
            //    var mic = "Has microphone:" + DetectRTC.hasMicrophone;
            //    //console.debug(mic);
            //    gaEvent("WEB-RTC: " + mic);
            //    //
            //    var wrtc = "Is WebRTC supported:" + DetectRTC.isWebRTCSupported;
            //    //console.debug(wrtc);
            //    gaEvent("WEB-RTC: " + wrtc);
            //    //
            //    var mb = "Is mobile:" + DetectRTC.isMobileDevice;
            //    //console.debug(mb);
            //    gaEvent("WEB-RTC: " + mb);
            //});
        }
        catch (ex) {
            console.warn("error in DetectRTC: " + ex);
        }
    }, function (error) {
        console.warn("error in mainInit: " + error);
    });
}

//** main entry point for the widget, make sure this is the last to load through window.load event */
$(document).ready(function(){
    init();
});

//ACCESSED FROM WIX SITE
function setChannel(channelName, show) {
    //console.debug('setChannel:: channelName: ', channelName);
    //console.debug('setChannel:: show: ', show);

    //console.debug('setChannel:: globalWidgetSettings.numberOfActiveChannels (before): ', globalWidgetSettings.numberOfActiveChannels);
    if (show) {
        globalWidgetSettings.numberOfActiveChannels += 1;
    } else {
        globalWidgetSettings.numberOfActiveChannels -= 1;
    }
    //console.debug('setChannel:: numberOfActiveChannels (after): ', globalWidgetSettings.numberOfActiveChannels);
    //the width and height will be re-calculated in resize
    var height = calcHeight(globalWidgetSettings.numberOfActiveChannels);
    //console.debug('setChannel:: height', height);

    resizeWidget(WIDGET_MIN_WIDTH, height);

    if (show) {
        $("#" + channelName).removeClass("hidden");
        $("#" + channelName).show();
    }
    else {
        $("#" + channelName).addClass("hidden");
        $("#" + channelName).hide();
    }
    //console.debug('setChannel:: class: ', $("#" + channelName).attr('class'));
}

function expandCollapseWidget(expand) {
    if (expand) {
        expandWidget();
    } else {
        $("#bon-x").click();
    }
}


var idSur = 0;

function getIdSurfer() {
    if (idSur === 0) {
        setIdSurfer();
    }
    return idSur;
}

function setIdSurfer() {
    if (idSur === 0) {
        try {
            idSur = getCookie("sur");
        }
        catch (err) {
            console.error("setIdSurfer::" + err);
        }
    }
    if (idSur === 0 || idSur === "") {
        idSur = Math.floor(Math.random() * (999999999 - 1000000 + 1)) + 1000000;
        setCookie("sur", idSur, 10);
    }
}

function setCookie(cName, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = cName + "=" + escape(value) +
    ((expiredays == null) ? "" : ";expires=" + exdate.toUTCString());
}

function getCookie(cName) {
    if (document.cookie.length > 0) {
        var cStart = document.cookie.indexOf(cName + "=");
        if (cStart !== -1) {
            cStart = cStart + cName.length + 1;
            var cEnd = document.cookie.indexOf(";", cStart);
            if (cEnd === -1) cEnd = document.cookie.length;
            return unescape(document.cookie.substring(cStart, cEnd));
        }
    }
    return "";
}

function sentConversionBon(note) {
    try {
        //console.debug("sentConversionBon:note=" + note);
        if (globalWidgetSettings.idCustomer === 37 || globalWidgetSettings.idCustomer === 52525) {
            $("#pageAnalytics").attr("src", "//dashboard.bontact.com/widget/analytics.htm?" + note);
        }

    } catch (e) {
        //console.debug(e);
    }

}

function getParams()
{
    return window.location.href.slice(window.location.href.indexOf('?') + 1)
}



var STATUS_SURFER = {
    Waiting: {
        value: 0,
        name: "Surfing",
        code: "W"
    },
    CALL: {
        value: 1,
        name: "Call ME",
        code: "C"
    },
    SMS: {
        value: 2,
        name: "SMS ME",
        code: "S"
    },
    MAIL: {
        value: 3,
        name: "Mail ME",
        code: "M"
    },
    CHAT: {
        value: 4,
        name: "Chat",
        code: "CH"
    },
    INVATE: {
        value: 5,
        name: "Invited",
        code: "I"
    },
    Waiting_For_Answer: {
        value: 6,
        name: "Calling!",
        code: "WC"
    },
    Chat_Active: {
        value: 7,
        name: "Chatting",
        code: "CA"
    },
    chat_End: {
        value: 8,
        name: "Chat Ended",
        code: "CE"
    },
    No_Answer: {
        value: 9,
        name: "No Answer",
        code: "NA"
    },
    Transfering: {
        value: 10,
        name: "Transfer",
        code: "TR"
    },
    LEAVE: {
        value: -1,
        name: "User Left",
        code: "LE"
    }
};
var socketio;

function addPageSurfer(surfer, page){
    var oldPage='';
    var allPages = readCookie('bontact-pages');
    if(allPages===undefined)
    {
        allPages=[];
        allPages.push(page);

    }else{
        allPages=JSON.parse(allPages);
        var  oldPage=allPages[allPages.length-1];
        if(oldPage!=page)
        {
            allPages.push(page);
        }

    }

    surfer.page=allPages;
    writeCookie('bontact-pages',JSON.stringify(allPages));




}