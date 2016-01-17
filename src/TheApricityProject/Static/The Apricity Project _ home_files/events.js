// IDLE

$(document).on("idle.idleTimer", function (event, elem, obj) {
    var msgRow = {
        //"id_Row": SurferObj.id_Call,
        //"id_Call": SurferObj.id_Call,
        "rep_Sur": "True",
        "systemMsg": true,
        //"id_Representive": SurferObj.id_Representive,
        //"name": SurferObj.name_Representive,
        "txt": '',
        "read_Rep": "False",
        "read_Sur": "False"
    };
    // function you want to fire when the user goes idle
    console.log('idle.idleTimer');

    //if(elem.id=='widget-body'){
    if (typeof window.idleTimerNum === 'undefined') {
        msgRow.txt = getSystemMessageText('chat', 'afkFiveLabel');// 'it seems that you stepped away from your computer. please type something to avoid disconnection.'

        window.idleTimerNum = 1;
        console.log('elem');
        console.log(elem.id);

        addChatFeedMessage('', true, msgRow.txt, msgRow);
        $('#widget-body').idleTimer('reset');
        //$('#widget-body').idleTimer('push');

        //$('#chat_wrapper').idleTimer(4000);
        //$('#chat_wrapper').idleTimer('reset');
        //setTimeout(function () {
        //    if (typeof window.idleTimerNum !== 'undefined') {
        //        $('#widget-body').idleTimer('reset');
        //    }
        //}, 2800);

    } else {
        msgRow.txt = getSystemMessageText('chat', 'afkTenLabel');//'thanks for chatting with us';

        addChatFeedMessage('', true, msgRow.txt, msgRow);

        window.idleTimerNum = undefined;

        $("#btnEndChat").click();
        $('#widget-body').idleTimer('pause');
    }

});

$(document).on("active.idleTimer", function (event, elem, obj, triggerevent) {
    // function you want to fire when the user becomes active again
    //console.log('active.idleTimer');
    //window.idleTimerNum = undefined;

    //$('#widget-body').idleTimer('reset');
    //$('#widget-body').idleTimer('resume');


});

$(document).ready(function () {


//WIDGET EVENTS START -->
    $("#tel_input_callback").focus(function () {
        gaEvent("focus callback number");
    });

    $("#tel_input_callback").keypress(function () {
        gaEvent("write callback number");
    });

//SMS
    $("#txtSmsContent").focus(function () {
        gaEvent("focus sms content");
    });
    $("#txtSmsContent").keypress(function () {
        gaEvent("write sms content");
    });
    $("#tel_input_sms").focus(function () {
        gaEvent("focus sms number");
    });
    $("#tel_input_whatsapp").focus(function () {
        gaEvent("focus whatsapp number");
    });
    $("#tel_input_sms").keypress(function () {
        gaEvent("write sms number");
    });

    $("#tel_input_whatsapp").keypress(function () {
        gaEvent("write whatapp number");
    });

    $("#txtEmailName").focus(function () {
        gaEvent("focus email username");
    });
    $("#txtEmailAddress").focus(function () {
        gaEvent("focus email emailuser");
    });
    $("#inputmessage").focus(function () {
        gaEvent("focus email content");
    });
    $("#txtEmailName").keypress(function () {
        gaEvent("write email emailuser");
    });
    $("#txtEmailAddress").keypress(function () {
        gaEvent("write email address");
    });
    $("#inputmessage").keypress(function () {
        gaEvent("write email content");
    });

//MOBILE KEYBOARD FIX
    $(".mobile-keyboard-fix").focus(function () {
        if (!globalWidgetSettings.isDesktop) {
            //fixMobileKeyboard(true);
        }
    });

    $(".mobile-keyboard-fix").blur(function () {
        if (!globalWidgetSettings.isDesktop) {
            fixMobileKeyboard(false);
        }
    });

    $("#txtChatMsg").focus(function () {
        gaEvent("focus chat content");

        if (!globalWidgetSettings.isDesktop) {
            $("#mobileChatBtn").removeClass("hidden");
            fixMobileKeyboard(true);
        }
    });

    $(".chatbox-messages-input textarea").keypress(function (e) {
        return;
        gaEvent("write chat content");
        //$('#widget-body').idleTimer('resume');
        //$('#chat_wrapper').idleTimer('destroy');
        window.idleTimerNum = undefined;

        writeCookie('bontact-widget-last-typed-chat-message', globalWidgetSettings.domain, $(this).val());

        if (e.which === 13) {
            console.log("key 'enter' was pressed on msg-box");
            console.log("SurferObj.statusType: " + SurferObj.statusType);

            if (globalWidgetSettings.chatActive) {
                console.log("chat status is active");
                if ($(this).val().trim() !== "") {
                    try {
                        sendText(linkify($(this).val()), false);
                    } catch (ignore) {
                        //DO NOTHING
                    }
                    $(this).val("");
                    return false;
                }
                else {
                    $(this).val("");
                    return false;
                }
            }
            //else if (SurferObj.statusType === STATUS_SURFER.CHAT.value) {
            //    console.log("(SurferObj)chat status is: " + SurferObj.statusType);
            //    surferName = $("#txtChatName").val();
            //    message = $("#txtChatMessage").val();
            //
            //    console.log("surferName: " + surferName);
            //    console.log("message: " + message);
            //    //dep?
            //    startChat(false, false);
            //} else if (!onlineCompanyStatus) {
            //    return false;
            //}
        } else if (SurferObj.statusType === STATUS_SURFER.Chat_Active.value)
            try {
                writingNow();
            } catch (e) {
                console.log("chat::exception: " + e);
            }
    });

    $("#mobileChatBtn").click(function (e) {
        var that = $(".chatbox-messages-input textarea");
        var msg = that.val();

        if (msg !== "") {
            try {
                sendText(linkify(msg), false);
            } catch (e) {
                console.log(e);
            }
            that.val("");

            return false;
        }
    });

    $("#btnEndChat").click(function () {
        gaEvent("end chat");

        console.log("btnEndChat:: click started");
        console.log("btnEndChat::clicked:STATUS_SURFER.Chat_Active: + " + STATUS_SURFER.Chat_Active.value);

        endCall();

        $("#btnEndChat").addClass("hidden");
        $("#msg-box").addClass("hidden");

        console.log("btnEndChat:: click finished");
    });


    $(".channelbtn").hover(
        function () {
            /*MOUSE OVER*/
            if(!isMobileDevice)
            expandWidget();

        }, function () {
            /*MOUSE OUT*/
        }
    );

    $("#bon-x").click(function () {
        bon_X();
    });
});
function expandWidget() {
    if (!isDoingSomething) {
        if (_currentChannel === undefined || _currentChannel === null) {
            isDoingSomething = true;

            $(".dock-container").removeClass("collapsed");

            resizeWidget(WIDGET_MIN_WIDTH, calcHeight(countChannels())).then(function () {
                $("#widget-body").removeClass("trans");
                $("#widget-body").addClass("notTrans");
            });

            setTimeout(function () {
                //$("#widget-body").addClass("notTrans");
                $("#bonPowerExpd").removeClass("hidden");
                $("#bonPowerCol").addClass("hidden");
                writeCookie('bontact-widget-state-is-minimized', false);
                isDoingSomething = false;

            }, 300);
        }
    }
}
function bon_X() {
    isDoingSomething = true;
    gaEvent("X click");

    $("#bonPowerExpd").addClass("hidden");
    $("#bonPowerCol").removeClass("hidden");

    $(".dock-container").addClass("collapsed");

    var height = calcHeight(countChannels()) - 53;
    $("#widget-body").removeClass("notTrans");
    $("#widget-body").addClass("trans");

    setTimeout(function () {
        writeCookie('bontact-widget-width', WIDGET_MINIMIZED_WIDTH);
        writeCookie('bontact-widget-height', height);
        writeCookie('bontact-widget-state-is-minimized', true);

        resizeWidget(WIDGET_MINIMIZED_WIDTH, height).then(function () {
            isDoingSomething = false;
            $('#widget-body').show();
        });

    }, 300);
}
