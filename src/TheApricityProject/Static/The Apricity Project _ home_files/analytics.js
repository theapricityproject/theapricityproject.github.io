function initAnalytics() {
    this.cookieName1 = "__utma";
    this.cookieName2 = "_ga";
    this.gaId = "";
    this.accountUA = "";
    this.surferId = "";

    try {
        var tracker = _gat._getTrackers()[0];
        this.gaId = tracker._visitCode();
        this.accountUA = _gaq._getAsyncTracker()._getAccount();
        this.surferId = this.GetSurferId;
        this.utma = this.getCookie(this.cookieName1);
    }
    catch (e) {
        //** DO NOTHING **//
    }
    //Get the GA client ID from _utma(1) cookie OR _ga(2) cookie
    this.getId = function () {
        
        var val = this.getCookie(this.cookieName1);
        
        if (val.length > 0) {
            this.gaId = val;//.split('.')[1];
            return this.gaId;
        } else {
            
            val = this.getCookie(this.cookieName2);
            
            if (val.length > 0) {
                this.gaId = val.split('.')[2];
                return this.gaId;
            }
        }
        return "";
    }
    this.GetAccountUA = function () {
        var txt = document.getElementsByTagName('head')[0].innerHTML;
        var matches = txt.match(/(UA-[\d-]+)/);
        
        if (matches[1]) {
            
            this.accountUA = (matches[1]);

        }
        var idd = this.GetSurferId();
        return this.accountUA;
        // this.accountUA = _gaq._getAsyncTracker()._getAccount();
    }
    this.GetSurferId = function () {
        this.surferId = this.getCookie('sur');
        return this.surferId;
        // this.accountUA = _gaq._getAsyncTracker()._getAccount();
    }
    
    //used to submit gaId to server using Ajax (without jquery)
    this.submitToHost = function (callback) {
        var hostUrl = '//dashboard.bontact.com/api/virtual_lineapi.aspx';
        var xmlhttp = new XMLHttpRequest();
        
        //simply display ths server result
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                callback(xmlhttp.responseText);
        }
        
        //open and send the ajax get
        xmlhttp.open("GET", hostUrl + "?cid=" + this.gaId + "&accountUA=" + this.accountUA + "&token=" + bontactCustomer + "&surfer_id=" + this.surferId + "&func=getline", true);
        xmlhttp.send();
    }
    
    //internal function to parse cookie
    this.getCookie = function (cookieName) {
        // return "164073130.1944875224.1391079942.1391369670.1391417410.6";
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(cookieName) === 0) {
                var ut = c.substring(name.length, c.length);
                return ut;
            }
        }
    };
}