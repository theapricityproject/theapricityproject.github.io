var layoutLablesLang={};
'use strict';

angular.module('bontactWidget')
    .controller('CustomTextCtrl', function ($scope, $http, $log, _, ChatBontact) {
        $log = $log.getInstance("CustomTextCtrl");
        $scope._ = _;

        function convertArrayToJson(textLabels) {
            var tmpArray = [];
            //handling the layout labels
            var layoutLables = _.select(textLabels, function (c) {
                    return c.groupName === 'layout' && c.isSystemMessage === 0;
                }),
                chatLables = _.select(textLabels, function (c) {
                    return c.groupName === 'chat' && c.isSystemMessage === 0;
                }),
                chatSystemLables = _.select(textLabels, function (c) {
                    return c.groupName === 'chat' && c.isSystemMessage === 1;
                }),
                callLables = _.select(textLabels, function (c) {
                    return c.groupName === 'call' && c.isSystemMessage === 0;
                }),
                callSystemLables = _.select(textLabels, function (c) {
                    return c.groupName === 'call' && c.isSystemMessage === 1;
                }),
                smsLables = _.select(textLabels, function (c) {
                    return c.groupName === 'sms' && c.isSystemMessage === 0;
                }),
                smsSystemLables = _.select(textLabels, function (c) {
                    return c.groupName === 'sms' && c.isSystemMessage === 1;
                }),
                emailLables = _.select(textLabels, function (c) {
                    return c.groupName === 'email' && c.isSystemMessage === 0;
                }),
                emailSystemLables = _.select(textLabels, function (c) {
                    return c.groupName === 'email' && c.isSystemMessage === 1;
                }),
                whatsAppLables = _.select(textLabels, function (c) {
                    return c.groupName === 'whatsApp' && c.isSystemMessage === 0;
                }),
                whatsAppSystemLables = _.select(textLabels, function (c) {
                    return c.groupName === 'whatsApp' && c.isSystemMessage === 1;
                }),
                generalSystemLables = _.select(textLabels, function (c) {
                    return c.groupName === 'general' && c.isSystemMessage === 1;
                });


            _.forEach(layoutLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.layoutLabels = tmpArray;
            tmpArray = [];

            _.forEach(chatLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.chatLables = tmpArray;
            tmpArray = [];

            _.forEach(chatSystemLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });

            $scope.chatSystemLables = tmpArray;
            tmpArray = [];

            _.forEach(callLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.callLables = tmpArray;
            tmpArray = [];

            _.forEach(callSystemLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.callSystemLables = tmpArray;
            tmpArray = [];

            _.forEach(smsLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.smsLables = tmpArray;
            tmpArray = [];

            _.forEach(smsSystemLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.smsSystemLables = tmpArray;
            tmpArray = [];

            _.forEach(emailLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.emailLables = tmpArray;
            tmpArray = [];

            _.forEach(emailSystemLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.emailSystemLables = tmpArray;
            tmpArray = [];

            _.forEach(whatsAppLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.whatsAppLables = tmpArray;
            tmpArray = [];

            _.forEach(whatsAppSystemLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.whatsAppSystemLables = tmpArray;
            tmpArray = [];

            _.forEach(generalSystemLables, function (n) {
                tmpArray[n.labelName] = n.text;
            });
            $scope.generalSystemLables = tmpArray;
            tmpArray = [];

            $scope.$apply();
        }

        /*
         this init function is invoked from the widget.js through the mainInit
         */
        $scope.init = function (data) {
            convertArrayToJson(data.settings.textsLanguage);

            console.log('data.settings.textsLanguage');
            console.log(data.settings.textsLanguage);


            $scope.Chat = new ChatBontact();
            $scope.Chat.connect(data.SurferObjGUI);
        };

        $scope.layoutLabels = {};
        $scope.chatLables = {};
        $scope.chatSystemLables = {};
        $scope.callLables = {};
        $scope.callSystemLables = {};
        $scope.smsLables = {};
        $scope.smsSystemLables = {};
        $scope.emailLables = {};
        $scope.emailSystemLables = {};
        $scope.whatsAppLables = {};
        $scope.whatsAppSystemLables = {};
        $scope.generalSystemLables = {};


        $scope.changeStatus=function(status){
            console.log(status);
            $scope.Chat.UpdateStatus(status);
        }
        $scope.UpdateVisitorDetails=function(){
            $scope.Chat.UpdateVisitorDetails();
        }
        $scope.statusBranding=function(status){
            if(status==1)
            {
               $scope.layoutLabels.maximizedBontact='';
                $scope.layoutLabels.minimizedBontact='';
            }
            else if(status==2)
            {
                $scope.layoutLabels.maximizedBontact= 'powered by bontact';
            }
        }







    })
    .factory('ChatBontact', function ($rootScope, $http, $filter) {
        var Chat = function () {
            this.preChat={Msg:'',email:'',name:''};
            this.inputChat='';
            this.ChatData=[];
            this.SurferObj={};
            this.StartTimerRepAnswerd=false;
            this.repAnswerd=undefined;
            this.agenttyping=false;
            this.waitingNewMsg=false;
            this.isMobileDevice = $.ua.device.type == "mobile";//!!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);
            if(!this.isMobileDevice)
                this.isMobileDevice = $.ua.device.type == "tablet" && (window.screen.width<400|| window.screen.height<400);
            //this.repAnswerd=false;
        };
        Chat.prototype.UpdateVisitorDetails=function(){
            if(this.preChat.name!='')
                writeCookie('preChatname',this.preChat.name);
            if(this.preChat.email!='')
                writeCookie('preChatemail',this.preChat.email);
        }
        Chat.prototype.connect = function (SurferObjGUI) {
            if(readCookie('preChatname')!==undefined)
                this.preChat.name=readCookie('preChatname');
            if(readCookie('preChatemail')!==undefined)
                this.preChat.email=readCookie('preChatemail');

            var thisObj=this;
            this.SurferObj = SurferObjGUI;
            var url = globalWidgetSettings.serverWebSocket;
            try {
                if (socketio===undefined||!socketio.connected)
                    socketio = io.connect(url);
            } catch (e) {
                console.log('lost socket connection', e);
            }
            socketio.on("connect", function () {
                thisObj.SurferObj.name_Representive = "";
                repGender = true;
                privatePicture = false;

                var onload = true;

                if (thisObj.SurferObj.statusType === null || thisObj.SurferObj.statusType === "")
                    thisObj.SurferObj.statusType = STATUS_SURFER.Waiting.value;

                console.log("startAndConnect::SurferObj.id_Customer: " + thisObj.SurferObj.id_Customer);

                if (globalWidgetSettings.pageTitle !== undefined) {
                    thisObj.SurferObj.title = globalWidgetSettings.pageTitle;
                }
                if (globalWidgetSettings.pageUrl !== undefined) {
                    addPageSurfer(thisObj.SurferObj,globalWidgetSettings.pageUrl);
                }

                console.log(thisObj.SurferObj);
                socketio.emit("visitorConnected", {
                    idCustomer: thisObj.SurferObj.id_Customer,
                    surfer: thisObj.SurferObj
                }, function (callback) {
                    console.log('visitorConnected-callback:');
                    console.log(callback);
                });
            });
            socketio.on("pushMessageChat", function (data) {
                thisObj.repAnswerd = true;
                console.log("pushMessageChat...");
                //data.messageObj.txt=replaceURLWithHTMLLinks(data.messageObj.txt);
                thisObj.ChatData.push(data.messageObj);
                thisObj.waitingNewMsg=true;
                $rootScope.$apply();
                setTimeout(function(){
                    $("#chatFeedWrapper").animate({scrollTop: $("#widgetInner").height()}, 200);
                },300);
            });
            socketio.on("disconnect", function () {
                console.log('socket disconnect');
            });
            socketio.on("reconnect", function () {
                console.log('socket reconnect');
            });
            socketio.on("repwriting", function (mode) {
                thisObj.agenttyping=mode;
                $rootScope.$apply();
            });
            socketio.on("invite", function (data) {
               console.log(data);
               /* var msgRow = {
                    "rep_Sur": dataMes.agentReply,
                    "systemMsg": dataMes.systemMsg,
                    "name": dataMes.name,
                    "txt": sanitizeHtml(dataMes.message),
                    agentReply:dataMes.agentReply,
                    id_Surfer:dataMes.idSurfer,
                    id_Call:0,
                    id_Customer:dataMes.idCustomer
                };*/
                thisObj.ChatData.push(data.txt);
                thisObj.waitingNewMsg=true;
                $rootScope.$apply();
                $("#prechat").addClass("hidden");
                $("#chatOnline").removeClass("hidden");
                $("#chatOnlineinner").removeClass("hidden");
                $("#msg-box").removeClass("hidden");

                $("#chatFeedWrapper").animate({scrollTop: $("#widgetInner").height()}, 200);
               // debugger;
            });
            loadOldConversationVisitor(thisObj.SurferObj.idSurfer,function(result){
                for(var i=0;i<result.length;i++){
                    var dataMes=result[i];
                    var msgRow = {
                        "rep_Sur": dataMes.agentReply,
                        "systemMsg": dataMes.systemMsg,
                        "name": dataMes.name,
                        "txt": sanitizeHtml(dataMes.message),
                        agentReply:dataMes.agentReply,
                        id_Surfer:dataMes.idSurfer,
                        id_Call:0,
                        id_Customer:dataMes.idCustomer
                    };
                    thisObj.ChatData.push(msgRow);
                }
                $rootScope.$apply();
                if(result.length>0){
                    $("#prechat").addClass("hidden");
                    $("#chatOnline").removeClass("hidden");
                    $("#chatOnlineinner").removeClass("hidden");
                    $("#msg-box").removeClass("hidden");

                    $("#chatFeedWrapper").animate({scrollTop: $("#widgetInner").height()}, 200);
                }

            });
        }
         Chat.prototype.classMsg=function(data){
            if(data.rep_Sur)
                return "chatbox-messages-item-left";
            return "chatbox-messages-item-right";

        }
        Chat.prototype.IconMsg=function(data){
            if(data.rep_Sur)
                return "agent-thumb";
            return "visitor-thumb";

        }
        Chat.prototype.startChat = function(){
            if(this.preChat.Msg===undefined||this.preChat.Msg.trim()=='')
                return;
            if(!this.StartTimerRepAnswerd){
                this.StartTimerRepAnswerd=true;
                this.SetNoOnline();
            }


            if(this.preChat.name!='')
                writeCookie('preChatname',this.preChat.name);
            if(this.preChat.email!='')
                writeCookie('preChatemail',this.preChat.email);
            var thisObj=this;
            var msgRow = {
                "rep_Sur": false,
                "systemMsg": false,
                "id_Representive": this.SurferObj.id_Representive,
                "name": this.preChat.name,
                "txt": sanitizeHtml(this.preChat.Msg),
                agentReply:false,
                id_Surfer:this.SurferObj.id_Surfer,
                id_Call:0,
                id_Customer:this.SurferObj.id_Customer
            };
            socketio.emit("startChat", {
                surfer: thisObj.SurferObj,
                preChat:this.preChat,
                messageObj:msgRow
            }, function (callback) {
                console.log('callback start-chat:');
                console.log(callback);
                if(callback.status){
                    $("#prechat").addClass("hidden");
                    $("#chatOnline").removeClass("hidden");
                    $("#chatOnlineinner").removeClass("hidden");
                    $("#msg-box").removeClass("hidden");

                    thisObj.ChatData.push(msgRow);
                    $rootScope.$apply();
                }
            });
        }


        Chat.prototype.sendChatTxt=function(){
            if(this.inputChat===undefined||this.inputChat.trim()=='')
                return;
            if(!this.StartTimerRepAnswerd){
                this.StartTimerRepAnswerd=true;
                this.SetNoOnline();
            }

            var thisObj=this;
            var msgRow = {
                "rep_Sur": false,
                "systemMsg": false,
                "id_Representive": this.SurferObj.id_Representive,
                "name": this.preChat.name,//this.SurferObj.name_Surfer,
                "txt": sanitizeHtml(this.inputChat),
                agentReply:false,
                id_Surfer:this.SurferObj.id_Surfer,
                id_Call:0,
                id_Customer:this.SurferObj.id_Customer
            };
            socketio.emit("sendChatTxt", {
                surfer: thisObj.SurferObj,
                messageObj:msgRow
            }, function (callback) {
                console.log('callback start-chat:');
                console.log(callback);
                if(callback.status){

                    thisObj.inputChat='';
                    thisObj.ChatData.push(msgRow);
                    $rootScope.$apply();
                    $("#chatFeedWrapper").animate({scrollTop: $("#widgetInner").height()}, 200);
                }
            });
        }
        Chat.prototype.SetNoOnline=function(){
            var thisObj=this;
            setInterval(function(){
                if(thisObj.repAnswerd===undefined) {
                    thisObj.repAnswerd = false;
                    $rootScope.$apply();
                    $("#chatFeedWrapper").animate({scrollTop: $("#widgetInner").height()}, 200);
                }
            },60000);
        }
        Chat.prototype.UpdateStatus=function(status){
            this.SurferObj.statusType = status.value;
            if(typeof socketio==='undefined')
                return;
            socketio.emit("changeStatus", {
                surfer: this.SurferObj
            });

            if(status==STATUS_SURFER.CHAT) {
                this.waitingNewMsg = false;
                $rootScope.$apply();
            }
        }
        Chat.prototype.ShowTxt=function(txt){
            txt=stripScripts(txt);
            return replaceURLWithHTMLLinks(txt);

        }
        function loadOldConversationVisitor(surferID,callback){
            if(surferID=='')
                surferID=getCookie('sur');
            if(surferID=='')
                return;

            var urlRes = String.format(globalWidgetSettings.serverBaseApiUrl + 'getconversationDataSurfer/{0}/{1}', globalWidgetSettings.bontactId, surferID);
            console.log('loadOldConversationVisitor: ' + urlRes);

            ajaxRequest(urlRes, function (data) {
                console.log('loadOldConversationVisitor result:');
                callback(data);
            });
        }

        return Chat;
    })
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keyup ", function (event) {
                //  1. show the send message button if there is at least 1 char
                //$log('scope.msgBoxVal.length: ' + scope.msgBoxVal.length);
                var isOK = this.value != undefined && this.value.trim() != "";//scope.msgBoxVal && scope.msgBoxVal.length > 0;
                //scope.isDisabled = !isOK;
                //$log('scope.isDisabled: ' + scope.isDisabled);
                //  2.make sure to send the message only if there is at least 1 char
                if (isOK) {
                    if (event.keyCode == 13 || event.keyCode == 9) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });
                        event.preventDefault();
                    }
                }
                scope.$apply();
            });
        };
    });


function sanitizeHtml(strCode) {

    if (typeof strCode !== 'undefined' && strCode !== null && strCode.length > 0) {
        var html = strCode.replace(/<\/?[^>]+(>|$)/g, "");

        if (html.length !== strCode.length) {
            //html = '<span style="color:red"></span><br/>' + html;
        }
        if (strCode.indexOf('<a href') == 0)
            return strCode;
        return html;
    } else {
        return strCode;
    }
}

function replaceURLWithHTMLLinks(text) {
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    return text.replace(exp,"<a href='$1' target='_blank'>$1</a>");
}
function stripScripts(s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerHTML;
}