// InstantSearch+ for Wix - Oct. 2015
// Copyright (c) Fast Simon Inc.


/*
// OPTIONS - Use the following configuration in your code to override the default values:
	<script>	
		var acp_options = {
				DISABLE_DROPDOWN: false,
				
				MIN_SUGGEST_WIDTH: 550,			
				MAX_SUGGEST_WIDTH: 800,
				
				PRODUCT_SUGGESTIONS_FIRST: true,
				MAX_INSTANT_SUGGESTIONS: 6,
				MAX_SEARCH_TERMS_SUGGESTIONS: 4,					
				THUMBNAIL_WIDTH: 50,
				THUMBNAIL_HEIGHT: 50,
				
				SHOW_DESC: false,
				SHOW_PRICE: true,
				SHOW_PRICE_ZERO: false,
								
				MAX_INSTANT_SUGGESTIONS_MOBILE:	3,				
				MAX_SEARCH_TERMS_SUGGESTIONS_MOBILE: 3,	
				THUMBNAIL_MOBILE_WIDTH: 30,
				THUMBNAIL_MOBILE_HEIGHT: 30,
				
				SALE_IMG: 'http://acp-magento.appspot.com/images/for_sale.png',
				PRICE_TAX: 1.21,
				PRICE_CURRENCY_CODE: 'USD',
				
				DISABLE_JQUERY_UI_CSS: false,
				
				HOSTNAME: 'www.doginpants.com'
		};
	</script>

// STYLE - Override the following CSS classes if needed as illustrated in the following hierarchy:
	<style>	
		.ui-autocomplete { }						//	Suggestions container
			.as_magento_suggest	{ }					// 	Magento product suggestion div
				.as_magento_img { }					//  Thumbnail image
				.as_magento_product_section	{ }		//  Product description text
					.as_magento_product_name { }	//  Product name
					.as_magento_price { }			//  Product price
			.as_popular_suggest { }					// 	Popular search terms
	</style>	
*/

if ( typeof acp_options === 'undefined' )	{
	acp_options = {};
}

if (true || typeof __acpParams === 'undefined') {
	function __acp_log(msg)	{
		try	{
			console.log('[isp] : ' + msg);
		}	catch(e)	{}
	}
	//////////////////////////////////////////////////////////////////////////////////////////
	// API Platform Specific  [START]
	
	function open_configuration() 				{	
		api_openURL('http://www.instantsearchplus.com', 'tab');
		return;
		
		var this_host = __acp.HOSTNAME;	//	'http://dev.trackaffads.com';	// window.location.hostname;
		var ht = '<div><div id="acp_config">';
		ht    += '<div style="text-align: left;"> <div style="font-family: arial, sans-serif; font-size: 11px;"> <div style="padding: 10px; margin: 0;">';
		ht	  += 'InstantSearch+ makes your search faster and easier.  Just start typing in the site search box, and get personalized, popular, and relevant suggestions in the dropdown box.<br><br>';
		ht    += 'You can choose to disable suggestions.';
		ht    += '</div></div></div></div></div>';

		$jquery('body').append(ht);	
		$jquery("#acp_config").dialog({
				   autoOpen: 	true,
				   modal: 		true,
				   resizable: 	false,
				   width:		450,
				   zIndex: 		9999999,
				   title:		"InstantSearch+",
				   buttons: [
						{
							text: "Close",
							click: function() { 
								$jquery(this).dialog("close"); 
							}
						},
						
						{
							text: "Disable",	// on " + window.location.hostname,
							click: function() { 
								api_db_set( __acp.ACP_DISABLED_KEY + this_host, '1', false); 
								alert('instantSearch+ suggestions are disabled on ' + this_host + ' :-(');	
								$jquery(this).dialog("close"); 
							}
						}
						]
		});
		$jquery('#acp_config').keyup(function(e) {
			if (e.keyCode == 13) {
				$jquery(this).dialog("close");
			}
		});	
		
		$jquery("#link_out").click(function() { api_openURL(this.href, 'tab');});		
	} 
	

	function api_json_parse(data)				{   return acpAPI.JSON.parse(data);		/*	return JSON.parse(data);	*/			/*	return appAPI.JSON.parse(data);		*/				}	// string 
	function api_json_stringify(data)			{	return acpAPI.JSON.stringify(data);	/*	return JSON.stringify(data);	*/		/*	return appAPI.JSON.stringify(data);	*/				}	// object 

	
	var message = {"reason": "button-clicked"};
 
	function api_get_search_redirect_url(query)	{
		var ret = __acp.SEARCH_URL;
		if (ret.indexOf('{partnerID}')>0)	{
			ret = ret.replace('{partnerID}', __acpParams.PARTNER_ID);
		}
		ret = ret.replace('{searchTerms}', encodeURIComponent(query));

		if ( __acpParams.APP_ID != null && __acpParams.APP_ID_PARAM != null )	{	
			ret = ret + '&' + __acpParams.APP_ID_PARAM + '=' + __acpParams.APP_ID;	
		}
		
		return ret;
	}
	
 	function api_openURL_modal(url, search_target, enter_key)	{
		// called from the Wix Modal window...
		setTimeout(function()	{
						var message = {"reason": "button-clicked"};
						// Wix.closeWindow(message);					
					}, 111);
		api_openURL(url, search_target, enter_key);
	}

	// Wix V.2 widget app with loopback!
	function api_openURL_modal_V2(search_term, selected_title, selected_position, url, search_target, enter_key, wix_page_id)	{
		// disabled the navigation of the hyperlink
		var resultOpenInTab = isp_obj['resultOpenInTab'];
		if (url.indexOf('#!')==-1)	{
			// Always open in a new tab if non Wix content
			 resultOpenInTab= true;
		}
		
		if (wix_page_id != '' && resultOpenInTab)	{
			// Navigate to the image gallery page so it appears in the background...
			try {	Wix.navigateToPage( wix_page_id );	} catch (e)	{}
		}
		
		try {
			event.preventDefault();		
		} catch (e)	{}
		try {
			event.preventDefault(event);		
		} catch (e)	{}
		try {
			event.returnValue = false;
		} catch (e)	{}		
		
		// Send loopback to server
		api_submit_loopback(selected_title, selected_position, acp_options.HOSTNAME, 'f2', null, null, null, null, search_term);
		
		// called from the Wix Modal window...
		url = url.replace('_escaped_fragment_=', '#!');		
		
		if ( resultOpenInTab == false )	{				
			var message = {
				"reason": "button-clicked", 
				"url": url				
			};			
			if (wix_page_id != '')	{
				// We navigated to the Wix Gallery in the background, let's close the modal and open the page only after a while.
				setTimeout(function()	{	
					Wix.closeWindow(message);	
				}, 2111);
			}
		}	else	{
			api_openURL(url, search_target, enter_key);		
		}
		
			
							
		return false;
	}

	// Navigation done using the hyperlink href and not using Wix navigation API	
	function api_openURL_modal_V3(search_term, selected_title, selected_position, url, search_target, enter_key, wix_page_id)	{
		// Send loopback to server
		api_submit_loopback(selected_title, selected_position, acp_options.HOSTNAME, 'f2', null, null, null, null, search_term);
		var resultOpenInTab = isp_obj['resultOpenInTab'];
		if (resultOpenInTab == false)	{
			var message = {
				"reason": "button-clicked", 
				"url": url				
			};			
			setTimeout(function()	{	
				Wix.closeWindow(message);	
			}, 1212);			
		}
		return true;
	}
	
	function js_trim(str)	{
		return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}
	

	function api_get_category_of_wix_page( url )	{	
		if (typeof url != 'undefined' && isp_obj && isp_obj['pages'])	{					
			var w_url = url;			
			var frag = w_url.indexOf('#!');					
			if (frag >= 0)	{					
				var frag = w_url.indexOf('/', frag);
				if (frag == -1)	{	
					var frag = w_url.indexOf('|', frag);
				}	
				if (frag >= 0)	{
					w_url = w_url.substr(frag+1);					
					for (var i=0;i<isp_obj['pages'].length;i++)	{	// Scan through the site Wix pages...
						var p_url = isp_obj['pages'][i].id;			
						if (p_url == w_url && isp_obj['pages'][i].title)	{	
							return js_trim( isp_obj['pages'][i].title );
						}
						if (isp_obj['pages'][i].subPages)	{
							for (var j=0;j<isp_obj['pages'][i].subPages.length;j++)	{
								if (isp_obj['pages'][i].subPages[j].id == w_url && isp_obj['pages'][i].subPages[j].title)	{											
									return js_trim( isp_obj['pages'][i].subPages[j].title );
								}								
							}
						}
					}
				}	
			}
		}	
		return '';
	}
	
	
	function api_is_current_wix_page( url )	{
		// ferret out the Wix code from the current url (for example: http://user.wix.com/site-name#!pageTitle/pageId, http://www.domain.com#!pageTitle/pageId)
		ret = false;
		if (isp_obj && isp_obj['url'] && isp_obj['url'] == url)	{
			ret = true;		
		}		
		return ret;	
	}
	
	function api_openURL(url, search_target, enter_key)	{
		// target URL, destination (current,tab,window)
		if (isp_obj)	{
			isp_obj['url']	= url;	//	 update the current url for subsequent searches...
		}

		if (url.indexOf('zoom;http')==0)	{
			url = url.replace('zoom;http', 'http');	//	 wrong indexing with a zoom prefix 
		}
		
		url = url.replace('_escaped_fragment_=', '#!');
		
		if ( (url.indexOf('?#!&') > 0 && isp_obj && isp_obj['pages'] && isp_obj['pages'].length > 0) ||
			 (isp_obj && isp_obj['base_url'] && url == isp_obj['base_url'])) {
            // We'll direct them to the homepage
            // url = url.replace('?#!&', '#!/' + isp_obj['pages'][0].id);                
			setTimeout(function()	{	Wix.closeWindow({"reason": "button-clicked"});	}, 111);
			Wix.navigateToPage( isp_obj['pages'][0].id );
			return;
        }
		
		switch ( search_target )	{
			case "wix":						
				// Understand the Wix guid for the target page...
				if (isp_obj && isp_obj['pages'])	{					
					var w_url = url;
					var frag = w_url.indexOf('#!');					// try { console.log(frag); }	catch (e)	{}
					if (frag >= 0)	{					
						var frag = w_url.indexOf('/', frag);
						if (frag == -1)	{	
							var frag = w_url.indexOf('|', frag);
						}	// try { console.log(frag); }	catch (e)	{}
						if (frag >= 0)	{
							w_url = w_url.substr(frag+1);					//try { console.log(w_url); }	catch (e)	{}							
							for (var i=0;i<isp_obj['pages'].length;i++)	{	// Scan through the site Wix pages...
								var p_url = isp_obj['pages'][i].id;			//try { console.log(p_url); }	catch (e)	{}								
								if (p_url == w_url)	{	
									Wix.scrollTo(0 , 0);
									setTimeout(function()	{	Wix.closeWindow({"reason": "button-clicked"});	}, 111);
									Wix.navigateToPage(w_url);	
									// setTimeout(function() {	Wix.scrollBy(0 ,100); }, 333);
									return;	
								}
								if (isp_obj['pages'][i].subPages)	{
									for (var j=0;j<isp_obj['pages'][i].subPages.length;j++)	{
										if (isp_obj['pages'][i].subPages[j].id == w_url)	{												
											Wix.scrollTo(0 , 0);
											setTimeout(function()	{	Wix.closeWindow({"reason": "button-clicked"});	}, 111);
											Wix.navigateToPage(w_url);							
											// setTimeout(function() {	Wix.scrollBy(0 ,100); }, 333);
											return;	
										}								
									}
								}
							}
						}	
					}
				}				
				// Wix.closeWindow();

			case "tab":		
				window.open(url,'_blank');		// Wix is a modal after all...
				break;
				
				if (enter_key || ($jquery.browser.msie && parseInt($jquery.browser.version, 10)<9) )	{
					// Replace the current tab
					setTimeout(function()	{	location.href=url;	}, 50);
				}	else	{
					// Open a new tab
					if ($jquery.browser.msie)	{
						window.open(url,'_blank');		
					}	else	{
						setTimeout(function()	{	window.open(url,'_blank');	}, 50);
					}
				}
				break;
			default:		
				location.href = url;	break;
			}									
	}	
	
	var api_db_global_store_wait_ms = 2222;
	function api_db_set(key,val, cross_domain)				{	
		try	{
			return $jquery.localStorage.setItem(key, val);  
		} catch (e)	{
			return $jquery.cookie(key, val, { expires: 365, path: '/' });
		}
		/*	return appAPI.db.set(key,val);		*/				
	}	
	function api_db_get(key, cross_domain)					{	
		try	{
			return $jquery.localStorage.getItem(key);
		} catch (e)	{
			return $jquery.cookie(key);
		}
		/*	return appAPI.db.get(key);	*/				
	}	
	function api_db_remove(key, cross_domain)				{	
		return $jquery.localStorage.removeItem(key);
		/*	return $jquery.cookie(key, null);	*/
		/*	return appAPI.db.remove(key);		*/				
	}	

	var acp_new2			= null;
	var ACP_JSONP_CALLBACK 	= 'acp_new2';
	
	var ACP_LOOPBACK_URL_COOKIE = "ACP_LOOPBACK_URL_COOKIE";
	var ACP_USAGE_STATS_COOKIE  = "ACP_USAGE_STATS_COOKIE";

	function getJSvars(script_name, var_name, if_empty) {
		var script_elements = document.getElementsByTagName('script');
		if(if_empty == null) {	var if_empty ='';	}

		for (a = 0; a < script_elements.length; a++) {
			var source_string = script_elements[a].src;
			if(source_string.indexOf(script_name)>=0) {		
			   var_name = var_name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			   var regex_string = new RegExp("[\\?&]"+var_name+"=([^&#]*)");
			   var parsed_vars = regex_string.exec(source_string);
			   if (parsed_vars == null) { return if_empty; }
			   else { return parsed_vars[1]; }
			  }
		   }
		return if_empty;
	}	
	
	function api_submit_loopback(my_term, sug_pos, this_host, exist, previous_search, previous_search_type, ab_test, ab_test_source, orig_term)	{	
		var prev_srch = '';
		if (previous_search != null && previous_search != '')	{
			prev_srch = "&p=" + encodeURIComponent(previous_search) + "&pt=" + previous_search_type;
		}		
		
		var ab_test_param = '';
		if (ab_test != null && ab_test != '')	{
			ab_test_param = "&ab=" + encodeURIComponent(ab_test) + "&abs=" + encodeURIComponent(ab_test_source);
		}	
		
		var orig_term_param = '';
		if (orig_term != null && orig_term != '')	{
			orig_term_param = "&o=" + encodeURIComponent(orig_term);
		}	
		
		// + "&h=" + encodeURIComponent(location.href)
		var url = __acp.UP_URL + "/up?q=" + encodeURIComponent(my_term) + "&instance=" + encodeURIComponent(instanceId) + "&p=" + encodeURIComponent(sug_pos) + "&l=" + encodeURIComponent(this_host) + "&t=" + exist + prev_srch + ab_test_param + orig_term_param + "&v=" + __acp.CLIENT_VER;
		api_db_set(ACP_LOOPBACK_URL_COOKIE, url, false);
		
		// In Wix we can fire the loopback thing immediately...
		do_loopback_reporting();
	}

	function do_reporting_image(url)	{
		var img = new Image();
		img.src = url;
	}

	var amzn_acp_new2				= null;
	var amzn_ACP_JSONP_CALLBACK 	= 'amzn_acp_new2';
	
	function api_get_amazon_suggest(amzn_url, onSuccess)	{
		try	{
			amzn_acp_new2 = function(data)	{					
				onSuccess(data[1][0]);	
			};
			$jquery.ajax({ cache: true,	jsonpCallback: amzn_ACP_JSONP_CALLBACK, url: amzn_url, dataType: "jsonp"	});
		}	catch (e)	{	}
	}
	
	var acp_magento_acp_new2			= null;
	var acp_magento_ACP_JSONP_CALLBACK 	= 'acp_magento_acp_new2';
	
	function api_get_instantsearch_suggest(magento_url, onSuccess)	{
		try	{
			acp_magento_acp_new2 = function(data)	{									
				onSuccess(data);	
			};
			$jquery.ajax({ cache: true,	jsonpCallback: acp_magento_ACP_JSONP_CALLBACK, url: magento_url, dataType: "jsonp"	});
		}	catch (e)	{	}
	}
	
	function api_ajax_request_get(ajax_type, url, onSuccess)	{ 	
	
		var url = (url + '&callback=' + ajax_type);
		$jquery.jsonp({
			url: url,
			cache: true,
			pageCache: true,
			callback: ajax_type,
			success: function(data) { onSuccess(data);	}
		});		
	}
	function api_add_css_style(uni_css_id, css_stuff)	{
		$jquery('#'+uni_css_id).remove();
		// make a new stylesheet
		var ns = document.createElement('style');
		document.getElementsByTagName('head')[0].appendChild(ns);
		// Safari does not see the new stylesheet unless you append something. 	// However!  IE will blow chunks, so ... filter it thusly:
		if (!window.createPopup) {
		   ns.appendChild(document.createTextNode(''));
		}
		var s = document.styleSheets[document.styleSheets.length - 1];		
		$jquery("<style id='"+uni_css_id+"' type='text/css'>"+css_stuff+"</style>").appendTo("head");																		
	}	

	function do_loopback_reporting()	{
		// check if any loopback stuff
		var loopback_url = api_db_get(ACP_LOOPBACK_URL_COOKIE, false);
		
		if (typeof loopback_url != 'undefined' && loopback_url != null && loopback_url != '' )	{
			do_reporting_image(loopback_url);
			api_db_set(ACP_LOOPBACK_URL_COOKIE, '', false);			
		}	
	}
	
	function api_update_stats(stats_type)		{		
		__acp_log(stats_type);	

		if ( stats_type.indexOf('STATS_SITE')==0 || stats_type.indexOf('STATS_CLIENT_DISABLED')==0 )	{
			setTimeout(function()	{
				do_stats( stats_type );
				do_loopback_reporting();
				// check if any usage stuff
				var usage_stats = api_db_get(ACP_USAGE_STATS_COOKIE, true);
				if (typeof usage_stats != 'undefined' && usage_stats != null && usage_stats != '' )	{
					api_db_set(ACP_USAGE_STATS_COOKIE, '', true);
					do_stats(usage_stats);
				}
			}, 3333);
		}	else	{
			api_db_set(ACP_USAGE_STATS_COOKIE, stats_type, true);
		}	
	}	
	
	function do_stats( key )	{
		var key = __acp.LOCAL_COOKIE_STATS_BASE + key;
		__acp_log(key);	
		var cur_val = api_db_get( key, true );
		var new_val = 0;
		if (typeof cur_val != "undefined" && cur_val != '' && cur_val != null && isNaN(cur_val)==false )	{	new_val = parseInt(cur_val, 10);	}
		new_val = new_val + 1;
		api_db_set( key, new_val, true);
		
		// Check if need to update server.. 
		// 1. Upon install or after 24hrs interval...
		var cur_seconds 	= parseInt( new Date().getTime() / 1000, 10);	// since 1970...		
		var db_last_update  = parseInt( api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.LAST_SUBMIT, true), 10);
		__acp_log(cur_seconds + ' vs. ' + db_last_update + ' = ' + (cur_seconds - db_last_update));

		// 0. first-time install					
		if (typeof db_last_update === 'undefined' || db_last_update == null || isNaN(db_last_update) || db_last_update == 0 ||  db_last_update == '' )	{
			__acp_log('initializing: ' + __acp.LOCAL_COOKIE_STATS_BASE + __acp.LAST_SUBMIT + ' = '+cur_seconds);
			api_send_stats_to_server_clients( key );	
			return;
		}	else	{
			// check if the time has come to submit...
			// 1. 24hrs interval
			if (cur_seconds - db_last_update > __acp.LOCAL_COOKIE_STATS_UPDATE_FREQUENCY_SEC)	{ 
				__acp_log('api_send_stats_to_server...');
				api_send_stats_to_server();
				api_send_stats_to_server_clients( key );					
				return;
			}		
			
			// 3. Related usage...
			if (key == (__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_POP) ||
				key == (__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_HISTORY) ||
				key == (__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_RELATED) ||
				key == (__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_TYPED))	{
					api_send_stats_to_server(); 		
					api_incr_search_box_cnt();					
					return;
			}																	
		}
	}
	

	
	function api_get_days_since_install()	{
		var cur_seconds 	= parseInt( new Date().getTime() / 1000, 10);	// since 1970...		
		var db_first_update = parseInt( api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.FIRST_SUBMIT, true), 10);		
		if (typeof db_first_update === 'undefined' || db_first_update == null || db_first_update == 0 || db_first_update == '' || isNaN(db_first_update))	{
			api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.FIRST_SUBMIT, cur_seconds.toString(), true);											
			return 0;
		}
		return parseInt( (cur_seconds - db_first_update)/(60*60*24), 10);	
	}	
	
	function api_send_stats_to_server_clients( key )	{
			return;	//	No need to hammer - Oct. 27 2015
			
			// do the timeout to verify that the __acp.profile_type is already calculated by the acp_core_source.js
			setTimeout(	function()	{	// do the timeout to verify that the __acp.profile_type is already calculated by the acp_core_source.js
				var day_diff = api_get_days_since_install();
				__acp_log('api_send_stats_to_server_clients: ' + day_diff);			
			
				var is_disabled = api_db_get( __acp.ACP_DISABLED_KEY_GENERAL, true);
				if (typeof is_disabled != 'undefined' && is_disabled != null && is_disabled != '' && is_disabled > 0)	{
					// disabled client
					day_diff = -1;
				}
				var url = encodeURI( __acp.STATS_URL 	+ "/stats2_clients?p=" + __acpParams.PARTNER_ID + "&d=" + day_diff + "&v=" + __acp.CLIENT_VER + "&t=" + __acp.profile_type);
				do_reporting_image( url );	
				
				var cur_seconds 	= parseInt( new Date().getTime() / 1000, 10);	// since 1970...		
				api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.LAST_SUBMIT, cur_seconds.toString(), true);
				
			}, 3333);
	}				
	
	function sanitize_db_value(stats_value)	{
		if (typeof stats_value === 'undefined' || stats_value==null || isNaN(stats_value) || stats_value=='' )	{	return 0;	}				
		return parseInt(stats_value, 10);				
	}
	
	function api_send_stats_to_server()	{
		return;	//	No need to hammer - Oct. 27 2015
		
		setTimeout(function()	{					
				var pop_use = sanitize_db_value(api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_POP, true));	
				var his_use = sanitize_db_value(api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_HISTORY, true));
				var rel_use = sanitize_db_value(api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_RELATED, true));		
				var typ_use	= sanitize_db_value(api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_TYPED, true));			
						
				var sup_site = sanitize_db_value(api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_SITE_SUPPORTED, true));	
				var nop_site = sanitize_db_value(api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_SITE_NOT_SUPPORTED, true));
				var new_site = sanitize_db_value(api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_SITE_NEW, true));			
				var irr_site = sanitize_db_value(api_db_get(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_SITE_IRRELEVANT, true));		

				if (pop_use!=0 || his_use!=0 || rel_use!=0 || typ_use!=0 || sup_site!=0 || nop_site!=0 || new_site!=0 || irr_site!==0)	{
					var url = __acp.STATS_URL 	+ "/stats2?p=" + __acpParams.PARTNER_ID + "&r=" + Math.random() + "&v=" + __acp.CLIENT_VER;
					if (pop_use !=0)	url += "&pop_use="  + (pop_use);
					if (his_use !=0)	url += "&his_use="  + (his_use);
					if (rel_use !=0)	url += "&rel_use="  + (rel_use);
					if (typ_use !=0)	url += "&typ_use="  + (typ_use);
					if (sup_site !=0)	url += "&sup_site=" + (sup_site);
					if (nop_site !=0)	url += "&nop_site=" + (nop_site);
					if (new_site !=0)	url += "&new_site=" + (new_site);
					if (irr_site !=0)	url += "&irr_site=" + (irr_site);
					url = encodeURI( url );
					do_reporting_image(url);
				}
			
				api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_POP,0, true);
				api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_HISTORY,0, true);
				api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_RELATED,0, true);
				api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_USE_TYPED,0, true);
						
				api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_SITE_SUPPORTED,0, true);
				api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_SITE_NOT_SUPPORTED,0, true);
				api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_SITE_NEW,0, true);
				api_db_set(__acp.LOCAL_COOKIE_STATS_BASE + __acp.STATS_SITE_IRRELEVANT,0, true);	 			
			}, 2222);										
	}	
				
	
	// API Platform Specific  [END]
	//////////////////////////////////////////////////////////////////////////////////////////
	function incr_counter_incr( key )	{	
		setTimeout(function()	{
			var cur_cnt = api_db_get( key, true );
			if (typeof cur_cnt == 'undefined' || cur_cnt == null || cur_cnt == '')	{	
				cur_cnt = 1;
			}	else	{	
				cur_cnt = parseInt(cur_cnt, 10) + 1;	
			}
			api_db_set( key, cur_cnt.toString(), true);	
		}, api_db_global_store_wait_ms);
	}
	function api_incr_search_clone_cnt()	{
		incr_counter_incr( __acp.SEARCH_CLONE_CNT );	
	}
	function api_incr_search_box_cnt()	{
		incr_counter_incr( __acp.SEARCH_BOX_CNT );	
	}
	function api_get_search_clone_cnt()	{
		var ret = parseInt( api_db_get(__acp.SEARCH_CLONE_CNT, true), 10);		
		if (typeof ret == 'undefined' || ret == null || ret == '' || isNaN(ret) )	{	ret = 0;	}
		return ret;
	}
	function api_get_search_box_cnt()	{
		var ret = parseInt( api_db_get(__acp.SEARCH_BOX_CNT, true), 10);		
		if (typeof ret == 'undefined' || ret == null || ret == '' || isNaN(ret) )	{	ret = 0;	}
		return ret;	
	}	


	var __acpParams =	{
		PARTNER_ID:					'wix_widget',
		footer_tooltip:				'Powered by InstantSearch&#43;',
		footer_html:				'InstantSearch&#43;',
		footer_html_mobile:			'[?]',		// '[?]';	// <img border=0  src='https://clients-ssl.autocompleteplus.com/Conduit/img/acp_help.png'/>
		footer_css:					'background-image:none;list-style:none;float:right;font:10px arial, helvetica, sans-serif; margin-right:5px; color: #777',	
		related_suggest_tooltip:	' - Web search',
		popular_suggest_tooltip:	' - Popular content',
		search_suggest_tooltip:		' - Site search',
		history_suggest_tooltip:	' - Personal history',
		amazon_suggest_tooltip:		' - Amazon related',		
		product_suggest_tooltip:	' - Popular product',	
				
		focus_on_searchbox:			true,
		open_suggestions_on_focus:	false,				
		MIN_SUGGEST_WIDTH:			acp_options.MIN_SUGGEST_WIDTH ? acp_options.MIN_SUGGEST_WIDTH:400,
		MIN_SUGGEST_FORM_WIDTH:		550,		
		MAX_SUGGEST_WIDTH:			acp_options.MAX_SUGGEST_WIDTH ? acp_options.MIN_SUGGEST_WIDTH:800,
		PORN_FILTER:				true,
		
		what_you_type_suggestion:		true,
		what_you_type_position_first:	true,		
							
		// Web Related Suggestions Separator
		suggest_diff_text_rel:	"Search the web",
		suggest_diff_text_site_search:	"Site search",
		suggest_diff_text_pop:	"Popular search",		
		suggest_diff_text_his:	"Site history",				
		
		global_search_portals_popular_ratio: 0.6
	};

}	

/*
	acp_core_jquery_and_jqueryui.js
	Used in all platform standalone solution that lack built-in support for jQuery and jQueryUI
	(c) 2012 Cloud Power LLC
*/


/*! jQuery v1.10.0 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
//@ sourceMappingURLx=jquery-1.10.0.min.map
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.0",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=lt(),k=lt(),E=lt(),S=!1,A=function(){return 0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=bt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+xt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return At(e.replace(z,"$1"),t,n,i)}function st(e){return K.test(e+"")}function lt(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function ut(e){return e[b]=!0,e}function ct(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function pt(e,t,n){e=e.split("|");var r,i=e.length,a=n?null:t;while(i--)(r=o.attrHandle[e[i]])&&r!==t||(o.attrHandle[e[i]]=a)}function ft(e,t){var n=e.getAttributeNode(t);return n&&n.specified?n.value:e[t]===!0?t.toLowerCase():null}function dt(e,t){return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}function ht(e){return"input"===e.nodeName.toLowerCase()?e.defaultValue:t}function gt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function mt(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function yt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function vt(e){return ut(function(t){return t=+t,ut(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),r.attributes=ct(function(e){return e.innerHTML="<a href='#'></a>",pt("type|href|height|width",dt,"#"===e.firstChild.getAttribute("href")),pt(B,ft,null==e.getAttribute("disabled")),e.className="i",!e.getAttribute("className")}),r.input=ct(function(e){return e.innerHTML="<input>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")}),pt("value",ht,r.attributes&&r.input),r.getElementsByTagName=ct(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ct(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ct(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=st(n.querySelectorAll))&&(ct(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ct(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=st(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ct(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=st(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},r.sortDetached=ct(function(e){return 1&e.compareDocumentPosition(n.createElement("div"))}),A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return gt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?gt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:ut,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=bt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?ut(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:ut(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?ut(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:ut(function(e){return function(t){return at(e,t).length>0}}),contains:ut(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:ut(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:vt(function(){return[0]}),last:vt(function(e,t){return[t-1]}),eq:vt(function(e,t,n){return[0>n?n+t:n]}),even:vt(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:vt(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:vt(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:vt(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}};for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=mt(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=yt(n);function bt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function xt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function wt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function Tt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function Ct(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function Nt(e,t,n,r,i,o){return r&&!r[b]&&(r=Nt(r)),i&&!i[b]&&(i=Nt(i,o)),ut(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||St(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:Ct(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=Ct(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=Ct(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function kt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=wt(function(e){return e===t},s,!0),p=wt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[wt(Tt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return Nt(l>1&&Tt(f),l>1&&xt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&kt(e.slice(l,r)),i>r&&kt(e=e.slice(r)),i>r&&xt(e))}f.push(n)}return Tt(f)}function Et(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=Ct(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?ut(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=bt(e)),n=t.length;while(n--)o=kt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Et(i,r))}return o};function St(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function At(e,t,n,i){var a,s,u,c,p,f=bt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&xt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}o.pseudos.nth=o.pseudos.eq;function jt(){}jt.prototype=o.filters=o.pseudos,o.setFilters=new jt,r.sortStable=b.split("").sort(A).join("")===b,p(),[0,0].sort(A),r.detectDuplicates=S,x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return t=t||[],t=[e,t.slice?t.slice():t],!l||i&&!u||(n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)}),n=s=l=u=r=o=null,t}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;
if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),o.cur=i,i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e,r="boolean"==typeof t;return x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var o,a=0,s=x(this),l=t,u=e.match(T)||[];while(o=u[a++])l=r?l:!s.hasClass(o),s[l?"addClass":"removeClass"](o)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})
}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){var t="boolean"==typeof e;return this.each(function(){(t?e:nn(this))?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(n.unit=o,n.start=+a||+r||0,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);a.finish=function(){t.stop(!0)},(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.cur&&i.cur.finish&&i.cur.finish.call(this),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);



try	{
	var $jquery = window.jQuery.noConflict(true);
} catch(e)	{
	var $jquery = jQuery;
}


//(function(jQuery) {
  // ... the jQuery UI lib code for jQuery 1.3.2
(function () {
	var document = window.document;
	

	/*! jQuery UI - v1.10.3 - 2013-05-27
	* http://jqueryui.com
	* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.position.js, jquery.ui.autocomplete.js, jquery.ui.menu.js
	* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

	(function(e,t){function i(t,i){var a,n,r,o=t.nodeName.toLowerCase();return"area"===o?(a=t.parentNode,n=a.name,t.href&&n&&"map"===a.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&s(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var a=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var s,a,n=e(this[0]);n.length&&n[0]!==document;){if(s=n.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(a=parseInt(n.css("zIndex"),10),!isNaN(a)&&0!==a))return a;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++a)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var s=e.attr(t,"tabindex"),a=isNaN(s);return(a||s>=0)&&i(t,!a)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,s){function a(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===s?["Left","Right"]:["Top","Bottom"],r=s.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+s]=function(i){return i===t?o["inner"+s].call(this):this.each(function(){e(this).css(r,a(this,i)+"px")})},e.fn["outer"+s]=function(t,i){return"number"!=typeof t?o["outer"+s].call(this,t):this.each(function(){e(this).css(r,a(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,s){var a,n=e.ui[t].prototype;for(a in s)n.plugins[a]=n.plugins[a]||[],n.plugins[a].push([i,s[a]])},call:function(e,t,i){var s,a=e.plugins[t];if(a&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(s=0;a.length>s;s++)e.options[a[s][0]]&&a[s][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",a=!1;return t[s]>0?!0:(t[s]=1,a=t[s]>0,t[s]=0,a)}})})($jquery);(function(e,t){var i=0,s=Array.prototype.slice,n=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(a){}n(t)},e.widget=function(i,s,n){var a,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],a=u+"-"+i,n||(n=s,s=e.Widget),e.expr[":"][a.toLowerCase()]=function(t){return!!e.data(t,a)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:n.version,_proto:e.extend({},n),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(n,function(i,n){return e.isFunction(n)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,a=this._superApply;return this._super=e,this._superApply=t,i=n.apply(this,arguments),this._super=s,this._superApply=a,i}}(),t):(l[i]=n,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:a}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var n,a,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(n in r[o])a=r[o][n],r[o].hasOwnProperty(n)&&a!==t&&(i[n]=e.isPlainObject(a)?e.isPlainObject(i[n])?e.widget.extend({},i[n],a):e.widget.extend({},a):a);return i},e.widget.bridge=function(i,n){var a=n.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,n=e.data(this,a);return n?e.isFunction(n[r])&&"_"!==r.charAt(0)?(s=n[r].apply(n,h),s!==n&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,a);t?t.option(r||{})._init():e.data(this,a,new n(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var n,a,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},n=i.split("."),i=n.shift(),n.length){for(a=o[i]=e.widget.extend({},this.options[i]),r=0;n.length-1>r;r++)a[n[r]]=a[n[r]]||{},a=a[n[r]];if(i=n.pop(),s===t)return a[i]===t?null:a[i];a[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var a,r=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=a=e(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,a=this.widget()),e.each(n,function(n,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=n.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?a.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var r,o=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),r=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),r&&e.effects&&e.effects.effect[o]?s[t](n):o!==t&&s[o]?s[o](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}})})($jquery);(function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var a,o=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(a!==e)return a;var i,s,n=t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=n.children()[0];return t("body").append(n),i=o.offsetWidth,n.css("overflow","scroll"),s=o.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),a=i-s},getScrollInfo:function(e){var i=e.isWindow?"":e.element.css("overflow-x"),s=e.isWindow?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,a="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:a?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var a,p,m,g,v,b,_=t(e.of),y=t.position.getWithinInfo(e.within),w=t.position.getScrollInfo(y),x=(e.collision||"flip").split(" "),k={};return b=n(_),_[0].preventDefault&&(e.at="left top"),p=b.width,m=b.height,g=b.offset,v=t.extend({},g),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=l.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=l.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),k[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===x.length&&(x[1]=x[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=m:"center"===e.at[1]&&(v.top+=m/2),a=i(k.at,p,m),v.left+=a[0],v.top+=a[1],this.each(function(){var n,l,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),b=s(this,"marginTop"),D=u+f+s(this,"marginRight")+w.width,T=d+b+s(this,"marginBottom")+w.height,C=t.extend({},v),M=i(k.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?C.left-=u:"center"===e.my[0]&&(C.left-=u/2),"bottom"===e.my[1]?C.top-=d:"center"===e.my[1]&&(C.top-=d/2),C.left+=M[0],C.top+=M[1],t.support.offsetFractions||(C.left=h(C.left),C.top=h(C.top)),n={marginLeft:f,marginTop:b},t.each(["left","top"],function(i,s){t.ui.position[x[i]]&&t.ui.position[x[i]][s](C,{targetWidth:p,targetHeight:m,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:D,collisionHeight:T,offset:[a[0]+M[0],a[1]+M[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(l=function(t){var i=g.left-C.left,s=i+p-u,n=g.top-C.top,a=n+m-d,h={target:{element:_,left:g.left,top:g.top,width:p,height:m},element:{element:c,left:C.left,top:C.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>a?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(h.horizontal="center"),d>m&&m>r(n+a)&&(h.vertical="middle"),h.important=o(r(i),r(s))>o(r(n),r(a))?"horizontal":"vertical",e.using.call(this,t,h)}),c.offset(t.extend(C,{using:l}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,h=n-r,l=r+e.collisionWidth-a-n;e.collisionWidth>a?h>0&&0>=l?(i=t.left+h+e.collisionWidth-a-n,t.left+=h-i):t.left=l>0&&0>=h?n:h>l?n+a-e.collisionWidth:n:h>0?t.left+=h:l>0?t.left-=l:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,h=n-r,l=r+e.collisionHeight-a-n;e.collisionHeight>a?h>0&&0>=l?(i=t.top+h+e.collisionHeight-a-n,t.top+=h-i):t.top=l>0&&0>=h?n:h>l?n+a-e.collisionHeight:n:h>0?t.top+=h:l>0?t.top-=l:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,a=n.offset.left+n.scrollLeft,o=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=t.left-e.collisionPosition.marginLeft,c=l-h,u=l+e.collisionWidth-o-h,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-o-a,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-h,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,a=n.offset.top+n.scrollTop,o=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=t.top-e.collisionPosition.marginTop,c=l-h,u=l+e.collisionHeight-o-h,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,m=-2*e.offset[1];0>c?(s=t.top+p+f+m+e.collisionHeight-o-a,t.top+p+f+m>c&&(0>s||r(c)>s)&&(t.top+=p+f+m)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+m-h,t.top+p+f+m>u&&(i>0||u>r(i))&&(t.top+=p+f+m))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,a,o=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(o?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(a in s)e.style[a]=s[a];e.appendChild(r),i=o||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()})($jquery);(function(t){var e=0;t.widget("ui.autocomplete",{version:"1.10.3",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var e,i,s,n=this.element[0].nodeName.toLowerCase(),a="textarea"===n,o="input"===n;this.isMultiLine=a?!0:o?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[a||o?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-autocomplete-input").attr("autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return e=!0,s=!0,i=!0,undefined;e=!1,s=!1,i=!1;var a=t.ui.keyCode;switch(n.keyCode){case a.PAGE_UP:e=!0,this._move("previousPage",n);break;case a.PAGE_DOWN:e=!0,this._move("nextPage",n);break;case a.UP:e=!0,this._keyEvent("previous",n);break;case a.DOWN:e=!0,this._keyEvent("next",n);break;case a.ENTER:case a.NUMPAD_ENTER:this.menu.active&&(e=!0,n.preventDefault(),this.menu.select(n));break;case a.TAB:this.menu.active&&this.menu.select(n);break;case a.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(e)return e=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),undefined;if(!i){var n=t.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(t){return s?(s=!1,t.preventDefault(),undefined):(this._searchTimeout(t),undefined)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,undefined):(clearTimeout(this.searching),this.close(t),this._change(t),undefined)}}),this._initSource(),this.menu=t("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(e){e.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];t(e.target).closest(".ui-menu-item").length||this._delay(function(){var e=this;this.document.one("mousedown",function(s){s.target===e.element[0]||s.target===i||t.contains(i,s.target)||e.close()})})},menufocus:function(e,i){if(this.isNewMenu&&(this.isNewMenu=!1,e.originalEvent&&/^mouse/.test(e.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){t(e.target).trigger(e.originalEvent)}),undefined;var s=i.item.data("ui-autocomplete-item");!1!==this._trigger("focus",e,{item:s})?e.originalEvent&&/^key/.test(e.originalEvent.type)&&this._value(s.value):this.liveRegion.text(s.value)},menuselect:function(t,e){var i=e.item.data("ui-autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",t,{item:i})&&this._value(i.value),this.term=this._value(),this.close(t),this.selectedItem=i}}),this.liveRegion=t("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e||(e=this.element.closest(".ui-front")),e.length||(e=this.document[0].body),e},_initSource:function(){var e,i,s=this;t.isArray(this.options.source)?(e=this.options.source,this.source=function(i,s){s(t.ui.autocomplete.filter(e,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(e,n){s.xhr&&s.xhr.abort(),s.xhr=t.ajax({url:i,data:e,dataType:"json",success:function(t){n(t)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(t){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,t))},this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):this._trigger("search",e)!==!1?this._search(t):undefined},_search:function(t){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var t=this,i=++e;return function(s){i===e&&t.__response(s),t.pending--,t.pending||t.element.removeClass("ui-autocomplete-loading")}},__response:function(t){t&&(t=this._normalize(t)),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(e){return e.length&&e[0].label&&e[0].value?e:t.map(e,function(e){return"string"==typeof e?{label:e,value:e}:t.extend({label:e.label||e.value,value:e.value||e.label},e)})},_suggest:function(e){var i=this.menu.element.empty();this._renderMenu(i,e),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(t.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(e,i){var s=this;t.each(i,function(t,i){s._renderItemData(e,i)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-autocomplete-item",e)},_renderItem:function(e,i){return t("<li>").append(t("<a>").text(i.label)).appendTo(e)},_move:function(t,e){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this._value(this.term),this.menu.blur(),undefined):(this.menu[t](e),undefined):(this.search(null,e),undefined)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(t,e),e.preventDefault())}}),t.extend(t.ui.autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(e,i){var s=RegExp(t.ui.autocomplete.escapeRegex(i),"i");return t.grep(e,function(t){return s.test(t.label||t.value||t)})}}),t.widget("ui.autocomplete",t.ui.autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(t>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var e;this._superApply(arguments),this.options.disabled||this.cancelSearch||(e=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.text(e))}})})($jquery);(function(t){t.widget("ui.menu",{version:"1.10.3",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,t.proxy(function(t){this.options.disabled&&t.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(t){t.preventDefault()},"click .ui-state-disabled > a":function(t){t.preventDefault()},"click .ui-menu-item:has(a)":function(e){var i=t(e.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(e),i.has(".ui-menu").length?this.expand(e):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){var i=t(e.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(e,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.children(".ui-menu-item").eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){t.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){t(e.target).closest(".ui-menu").length||this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var e=t(this);e.data("ui-menu-submenu-carat")&&e.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(e){function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,n,a,o,r,h=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:h=!1,n=this.previousFilter||"",a=String.fromCharCode(e.keyCode),o=!1,clearTimeout(this.filterTimer),a===n?o=!0:a=n+a,r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())}),s=o&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(a=String.fromCharCode(e.keyCode),r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())})),s.length?(this.focus(e,s),s.length>1?(this.previousFilter=a,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}h&&e.preventDefault()},_activate:function(t){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i=this.options.icons.submenu,s=this.element.find(this.options.menus);s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),s=e.prev("a"),n=t("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(n),e.attr("aria-labelledby",s.attr("id"))}),e=s.add(this.element),e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),e.children(":not(.ui-menu-item)").each(function(){var e=t(this);/[^\-\u2014\u2013\s]/.test(e.text())||e.addClass("ui-widget-content ui-menu-divider")}),e.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){"icons"===t&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu),this._super(t,e)},focus:function(t,e){var i,s;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,a,o,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,a=this.activeMenu.scrollTop(),o=this.activeMenu.height(),r=e.height(),0>n?this.activeMenu.scrollTop(a+n):n+r>o&&this.activeMenu.scrollTop(a+n-o+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",t,{item:this.active}))},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),undefined):(this.next(e),undefined)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item").first())),undefined):(this.next(e),undefined)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)}})})($jquery);













	/*! Html5 Storage jQuery Plugin - v1.0 - 2013-01-19
	* https://github.com/artberri/jquery-html5storage
	* Copyright (c) 2013 Alberto Varela; Licensed MIT */
	(function(e,t){"use strict";var n=["localStorage","sessionStorage"],r=[];t.each(n,function(n,i){try{r[i]=i in e&&e[i]!==null}catch(s){r[i]=!1}t[i]={settings:{cookiePrefix:"html5fallback:"+i+":",cookieOptions:{path:"/",domain:document.domain,expires:"localStorage"===i?{expires:365}:undefined}},getItem:function(n){var s;return r[i]?s=e[i].getItem(n):s=t.cookie(this.settings.cookiePrefix+n),s},setItem:function(n,s){return r[i]?e[i].setItem(n,s):t.cookie(this.settings.cookiePrefix+n,s,this.settings.cookieOptions)},removeItem:function(n){if(r[i])return e[i].removeItem(n);var s=t.extend(this.settings.cookieOptions,{expires:-1});return t.cookie(this.settings.cookiePrefix+n,null,s)},clear:function(){if(r[i])return e[i].clear();var n=new RegExp("^"+this.settings.cookiePrefix,""),s=t.extend(this.settings.cookieOptions,{expires:-1});document.cookie&&document.cookie!==""&&t.each(document.cookie.split(";"),function(e,r){n.test(r=t.trim(r))&&t.cookie(r.substr(0,r.indexOf("=")),null,s)})}}})})(window,$jquery);




	
	
	/*
	 * ******************************************************************************
	 *  file: jquery.mb.browser.min.js
	 *  *****************************************************************************
	 */

	(function(){if(!(8>$jquery.fn.jquery.split(".")[1])){$jquery.browser={};$jquery.browser.mozilla=!1;$jquery.browser.webkit=!1;$jquery.browser.opera=!1;$jquery.browser.msie=!1;var a=navigator.userAgent;$jquery.browser.name=navigator.appName;$jquery.browser.fullVersion=""+parseFloat(navigator.appVersion);$jquery.browser.majorVersion=parseInt(navigator.appVersion,10);var c,b;if(-1!=(b=a.indexOf("Opera"))){if($jquery.browser.opera=!0,$jquery.browser.name="Opera",$jquery.browser.fullVersion=a.substring(b+6),-1!=(b= a.indexOf("Version")))$jquery.browser.fullVersion=a.substring(b+8)}else if(-1!=(b=a.indexOf("MSIE")))$jquery.browser.msie=!0,$jquery.browser.name="Microsoft Internet Explorer",$jquery.browser.fullVersion=a.substring(b+5);else if(-1!=(b=a.indexOf("Chrome")))$jquery.browser.webkit=!0,$jquery.browser.name="Chrome",$jquery.browser.fullVersion=a.substring(b+7);else if(-1!=(b=a.indexOf("Safari"))){if($jquery.browser.webkit=!0,$jquery.browser.name="Safari",$jquery.browser.fullVersion=a.substring(b+7),-1!=(b=a.indexOf("Version")))$jquery.browser.fullVersion= a.substring(b+8)}else if(-1!=(b=a.indexOf("Firefox")))$jquery.browser.mozilla=!0,$jquery.browser.name="Firefox",$jquery.browser.fullVersion=a.substring(b+8);else if((c=a.lastIndexOf(" ")+1)<(b=a.lastIndexOf("/")))$jquery.browser.name=a.substring(c,b),$jquery.browser.fullVersion=a.substring(b+1),$jquery.browser.name.toLowerCase()==$jquery.browser.name.toUpperCase()&&($jquery.browser.name=navigator.appName);if(-1!=(a=$jquery.browser.fullVersion.indexOf(";")))$jquery.browser.fullVersion=$jquery.browser.fullVersion.substring(0, a);if(-1!=(a=$jquery.browser.fullVersion.indexOf(" ")))$jquery.browser.fullVersion=$jquery.browser.fullVersion.substring(0,a);$jquery.browser.majorVersion=parseInt(""+$jquery.browser.fullVersion,10);isNaN($jquery.browser.majorVersion)&&($jquery.browser.fullVersion=""+parseFloat(navigator.appVersion),$jquery.browser.majorVersion=parseInt(navigator.appVersion,10));$jquery.browser.version=$jquery.browser.majorVersion}})($jquery);


	
	// jquery.jsonp 2.4.0 (c)2012 Julian Aubourg | MIT License
	// https://github.com/jaubourg/jquery-jsonp
	(function(e){function t(){}function n(e){C=[e]}function r(e,t,n){return e&&e.apply&&e.apply(t.context||t,n)}function i(e){return/\?/.test(e)?"&":"?"}function O(c){function Y(e){z++||(W(),j&&(T[I]={s:[e]}),D&&(e=D.apply(c,[e])),r(O,c,[e,b,c]),r(_,c,[c,b]))}function Z(e){z++||(W(),j&&e!=w&&(T[I]=e),r(M,c,[c,e]),r(_,c,[c,e]))}c=e.extend({},k,c);var O=c.success,M=c.error,_=c.complete,D=c.dataFilter,P=c.callbackParameter,H=c.callback,B=c.cache,j=c.pageCache,F=c.charset,I=c.url,q=c.data,R=c.timeout,U,z=0,W=t,X,V,J,K,Q,G;return S&&S(function(e){e.done(O).fail(M),O=e.resolve,M=e.reject}).promise(c),c.abort=function(){!(z++)&&W()},r(c.beforeSend,c,[c])===!1||z?c:(I=I||u,q=q?typeof q=="string"?q:e.param(q,c.traditional):u,I+=q?i(I)+q:u,P&&(I+=i(I)+encodeURIComponent(P)+"=?"),!B&&!j&&(I+=i(I)+"_"+(new Date).getTime()+"="),I=I.replace(/=\?(&|$)/,"="+H+"$1"),j&&(U=T[I])?U.s?Y(U.s[0]):Z(U):(E[H]=n,K=e(y)[0],K.id=l+N++,F&&(K[o]=F),L&&(L.version != null)&&(typeof L.version === 'function')&&L.version()<11.6?(Q=e(y)[0]).text="document.getElementById('"+K.id+"')."+p+"()":K[s]=s,A&&(K.htmlFor=K.id,K.event=h),K[d]=K[p]=K[v]=function(e){if(!K[m]||!/i/.test(K[m])){try{K[h]&&K[h]()}catch(t){}e=C,C=0,e?Y(e[0]):Z(a)}},K.src=I,W=function(e){G&&clearTimeout(G),K[v]=K[d]=K[p]=null,x[g](K),Q&&x[g](Q)},x[f](K,J=x.firstChild),Q&&x[f](Q,J),G=R>0&&setTimeout(function(){Z(w)},R)),c)}var s="async",o="charset",u="",a="error",f="insertBefore",l="_jqjsp",c="on",h=c+"click",p=c+a,d=c+"load",v=c+"readystatechange",m="readyState",g="removeChild",y="<script>",b="success",w="timeout",E=window,S=e.Deferred,x=e("head")[0]||document.documentElement,T={},N=0,C,k={callback:l,url:location.href},L=E.opera,A=!!e("<div>").html("<!--[if IE]><i><![endif]-->").find("i").length;O.setup=function(t){e.extend(k,t)},e.jsonp=O})($jquery)


	// acpAPI.JSON
	if(typeof(acpAPI)==="undefined"){acpAPI={}}acpAPI.JSON={};(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.to_CR_JSON!=="function"){Date.prototype.to_CR_JSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.to_CR_JSON=Number.prototype.to_CR_JSON=Boolean.prototype.to_CR_JSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.to_CR_JSON==="function"){value=value.to_CR_JSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof acpAPI.JSON.stringify!=="function"){acpAPI.JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("acpAPI.JSON.stringify")}return str("",{"":value})}}if(typeof acpAPI.JSON.parse!=="function"){acpAPI.JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("acpAPI.JSON.parse")}}}());(function(b){b.debug=function(e,k){if(!b.isDebugMode()){return}var a=!b.debug.settings.console;if(k!=null){a=k}try{if(!a){var j=new Date();var d=(((b.debug.settings.timestamp)&&(typeof(e)=="string"))?(j.toLocaleTimeString()+"."+j.getMilliseconds()+": "+e):e);console.log(d)}else{alert(e)}}catch(l){alert(e)}};b.debug.settings={console:true,timestamp:true}})(acpAPI);(function(b){b.installer={};b.installer.getParams=function(){return(b.db.get("InstallerParams")||{})};b.installer.getUnixTime=function(){return(b.db.get("InstallationTime")||null)}})(acpAPI);(function(c){c.time={};c.time.secondsFromNow=function(a){return d(a*1000)};c.time.secondsAgo=function(a){return d(a*-1000)};c.time.minutesFromNow=function(a){return d(a*60*1000)};c.time.minutesAgo=function(a){return d(a*60*-1000)};c.time.hoursFromNow=function(a){return d(a*3600*1000)};c.time.hoursAgo=function(a){return d(a*3600*-1000)};c.time.daysFromNow=function(a){return d(a*3600*24*1000)};c.time.daysAgo=function(a){return d(a*3600*24*-1000)};c.time.yearsFromNow=function(a){return d(a*365*3600*24*1000)};c.time.yearsAgo=function(a){return d(a*365*3600*24*-1000)};function d(a){return new Date(new Date().getTime()+a)}})(acpAPI);(function(b){b.analytics={};b.analytics.trackUrl=function(a){function d(v,u,y){function i(f,e){return f+Math.floor(Math.random()*(e-f))}var s=1000000000,c=i(s,9999999999),x=i(10000000,99999999),w=i(s,2147483647),q=(new Date()).getTime(),r=window.location,t=new Image(),z=document.location.protocol+"//www.google-analytics.com/__utm.gif?utmwv=1.3&utmn="+c+"&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn="+u+"&utmr="+r+"&utmp="+y+"&utmac="+v+"&utmcc=__utma%3D"+x+"."+w+"."+q+"."+q+"."+q+".2%3B%2B__utmb%3D"+x+"%3B%2B__utmc%3D"+x+"%3B%2B__utmz%3D"+x+"."+q+".2.2.utmccn%3D(referral)%7Cutmcsr%3D"+r.host+"%7Cutmcct%3D"+r.pathname+"%7Cutmcmd%3Dreferral%3B%2B__utmv%3D"+x+".-%3B";t.src=z}if((this.settings.account=="")||(this.settings.domain=="")){b.debug("Error: In order to use the analytics API you must first specify your domain and account ID from Google Analytics!\nThis can easily done by setting acpAPI.setting.account and acpAPI.setting.domain");return}d(this.settings.account,this.settings.domain,a)};b.analytics.trackEvent=function(j,h,a,i){function g(y,f,C,A,x,G,F){function H(k,l){return k+Math.floor(Math.random()*(l-k))}var d=1000000000,E=H(d,9999999999),B=H(10000000,99999999),z=H(d,2147483647),I=(new Date()).getTime(),c=window.location,e=new Image(),D=document.location.protocol+"//www.google-analytics.com/__utm.gif?utmwv=4.8.9&utmn="+E+"&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn="+f+"&utmr=-&utmt=event&utme=5("+A+"*"+x+"*"+G+")("+F+")&utmp="+C+"&utmac="+y+"&utmcc=__utma%3D"+B+"."+z+"."+I+"."+I+"."+I+".2%3B%2B__utmb%3D"+B+"%3B%2B__utmc%3D"+B+"%3B%2B__utmz%3D"+B+"."+I+".2.2.utmccn%3D(referral)%7Cutmcsr%3D"+c.host+"%7Cutmcct%3D"+c.pathname+"%7Cutmcmd%3Dreferral%3B%2B__utmv%3D"+B+".-%3B";e.src=D}if(typeof(j)!="string"){j=""}if(typeof(h)!="string"){h=""}if(typeof(a)!="string"){a=""}if(typeof(i)!="number"){i=0}if((j=="")&&(h=="")&&(a=="")&&(i==0)){b.debug("Error: In order to use trackEvent you must specify the event parameters!");return}if((this.settings.account=="")||(this.settings.domain=="")){b.debug("Error: In order to use the analytics API you must first specify your domain and account ID from Google Analytics!\nThis can easily done by setting acpAPI.setting.account and acpAPI.setting.domain");return}g(this.settings.account,this.settings.domain,document.location.href,j,h,a,i)};b.analytics.settings={account:"",domain:""}})(acpAPI);
	
	// Cookies	
	(function(g){g.cookie=function(h,b,a){if(1<arguments.length&&(!/Object/.test(Object.prototype.toString.call(b))||null===b||void 0===b)){a=g.extend({},a);if(null===b||void 0===b)a.expires=-1;if("number"===typeof a.expires){var d=a.expires,c=a.expires=new Date;c.setDate(c.getDate()+d)}b=""+b;return document.cookie=[encodeURIComponent(h),"=",a.raw?b:encodeURIComponent(b),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure": ""].join("")}for(var a=b||{},d=a.raw?function(a){return a}:decodeURIComponent,c=document.cookie.split("; "),e=0,f;f=c[e]&&c[e].split("=");e++)if(d(f[0])===h)return d(f[1]||"");return null}})($jquery);	
	
})();
//})($jquery);
/*
	acp_core_source.js
	Used as base script for all versions
	(c) 2013 Cloud Power LLC
*/

var _isp_endpoint = 'http://wix.instantsearchplus.com';
if (location.protocol == 'https:')	{
	var _isp_endpoint = 'https://acp-mobile.appspot.com';
}


var __acp =	{
	CLIENT_VER:					getJSvars('wix_instantsearchplus_widget', 'v', '2.0.0'),
	
	HOSTNAME:					acp_options.HOSTNAME ? acp_options.HOSTNAME: this_host, 	//	'dev.trackaffads.com',	//	

	SEARCH_URL:					_isp_endpoint + '/websearch?q={searchTerms}',	// 'https://www.google.com/search?q={searchTerms}&ie=utf-8&oe=utf-8&client=isp_wix', 
	SERVER_URL:					'http://clients.autocompleteplus.com',	// 		"http://0-21.autosuggestr.appspot.com",	//var __acp.SERVER_URL = 'http://localhost:8085';		
	SERVER_URL_HTTPS:			'https://autosuggestr.appspot.com',

	STATS_URL:					'http://stats.autocompleteplus.com',
	STATS_URL_HTTPS:			'https://stats-ssl.autocompleteplus.com',

	UP_URL:						'https://acp-mobile.appspot.com',
	UP_URL_HTTPS:				'https://acp-mobile.appspot.com',

	AC_GLOBAL_URL:				'http://api.autocompleteplus.com',
	AC_GLOBAL_URL_HTTPS:		'https://completr-v2.appspot.com',	

	css_init_element_id: 		null,
	latest_data_obj:			{},
	latest_acp_personal_term:	null,
	latest_acp_personal_res_len: -1,
	current_site_user_history:	null,	// Array holding the following items in each entry: term, time, count
	current_site_user_history_product:	null,	// Array holding the PRODUCT items in each entry: item, time, count
	requests_cache:				{},
	focused_item_type:			null,
	focused_item_label:			null,
	search_target:				acp_options.search_target ? acp_options.search_target: null,
	search_dest:				null,
	input_id_0:					null,
	input_id_1:					null,

	site_status:				0,
	porn_site:					false,

	max_autocomplete_personal:	6,
	max_autocomplete_total:		acp_options.MAX_SEARCH_TERMS_SUGGESTIONS ? acp_options.MAX_SEARCH_TERMS_SUGGESTIONS: 10,
	max_autocomplete_global:	1,
	autocomplete_order:			null,
	max_followups:				2,
	
	missing_input_id_0:			'input_id_0_suggestor_007',
	missing_input_id_1:			'input_id_1_suggestor_007',
	
	ac_OfF:						'OfF',
	OFF_AC:						'OFF',
	AUTOCOMPLETE:				'autocomplete',
	
	RELATED_SUGGESTION:			'r',
	POP_SUGGESTION:				'p',
	HISTORY_SUGGESTION:			'h',
	AMAZON_SUGGESTION:			'a',
	MAGENTO_SUGGESTION:			'm',
	WIX_SUGGESTION:				'w',
	
	// Local personal history persistency
	LOCAL_COOKIE_PREFIX:			'as_sug_9_',
	LOCAL_COOKIE_PREFIX_WIX:		'as_wix_9_',
	MAX_POPULAR_SEARCHES_HISTORY:	10,
	MAX_POPULAR_PRODUCTS_HISTORY:	5,
	LOCAL_COOKIE_PREFIX_TEMP:		'as_pre_sug_5_',
	LOCAL_COOKIE_PREFIX_TEMP_WIX:	'as_pre_wix_5_',
	MAX_LOCAL_OLD_HISTORY_SEC:	7776000,				// maximum time we should keep local history (7776000 == 3 months)
	LOCAL_COOKIE_STATS_BASE:	'LOCAL_COOKIE_STATS_',

	// Target profile
	SEARCH_CLONE_CNT:			'SEARCH_CLONE_CNT',
	SEARCH_BOX_CNT:			    'SEARCH_BOX_CNT',	
	
	// Stats...
	STATS_USE_POP:				'STATS_USE_POP',
	STATS_USE_HISTORY:			'STATS_USE_HISTORY',
	STATS_USE_RELATED:			'STATS_USE_RELATED',
	STATS_USE_TYPED:			'STATS_USE_TYPED',	
	STATS_SITE_SUPPORTED:		'STATS_SITE_SUPPORTED',
	STATS_SITE_NOT_SUPPORTED:	'STATS_SITE_NOT_SUPPORTED',
	STATS_SITE_NEW:				'STATS_SITE_NEW',
	STATS_SITE_IRRELEVANT:		'STATS_SITE_IRRELEVANT',	

	STATS_CLIENT_DISABLED:		'STATS_CLIENT_DISABLED',		
	LOCAL_COOKIE_STATS_UPDATE_FREQUENCY_SEC:	60*60*24,
	LAST_SUBMIT:				'LAST_SUBMIT_1',
	FIRST_SUBMIT:				'FIRST_SUBMIT',	
	
	ACP_DISABLED_KEY:			'ACP_MAGENTO_DISABLED_KEY_',
	ACP_DISABLED_KEY_GENERAL:	'ACP_MAGENTO_DISABLED_KEY_GENERAL',
	
	ACP_SITE_SUPPORTED:			1,
	ACP_SITE_NOT_SUPPORTED:		0,
	ACP_SITE_GLOBAL_SEARCH:		2,
	ACP_SITE_GLOBAL_RELATED:	3,
	
	GLOBAL_MIN_CHARS:			acp_options.GLOBAL_MIN_CHARS ? acp_options.GLOBAL_MIN_CHARS: 4, 
	
	// Amazon stuff
	ACP_AMAZON_COMPLETE_URL:	'http://completion.amazon.com/search/complete?method=completion&q={searchTerms}&search-alias=aps&mkt=1',
	ACP_AMAZON_SEARCH_URL:		'http://www.amazon.com/gp/search?ie=UTF8&camp=1789&creative=9325&index=aps&keywords={searchTerms}&linkCode=ur2&tag=acpp-20',
	ACP_AMAZON_ENABLE:			0,
	ACP_AMAZON_SHOW_MIN_CHAR:	999,
	ACP_AMAZON_SHOW_MIN_WORD:	0,	
	ACP_AMAZON_LATEST_SUGGEST:	null,
	
	// Magento stuff
	ACP_INSTANT_COMPLETE_URL:		_isp_endpoint + '/?q={searchTerms}&s={searchSite}&instance={instanceId}&t=1&scroll=0',		// &h={href}	
	ACP_INSTANT_POP_SUGGESTS_URL:	_isp_endpoint + '/pop?s={searchSite}&instance={instanceId}',		
	ACP_INSTANT_SUGGEST_CACHE:	{},
	magento_deployment: 		true,
	MAX_INSTANT_ITEMS_TO_RENDER: (null != acp_options.MAX_INSTANT_SUGGESTIONS) ? acp_options.MAX_INSTANT_SUGGESTIONS: 6,
	
	// Previous search 
	previous_search:					null,
	previous_search_followups:			null,
	top_host_searches:					null,	
	previous_search_type:				null,	
	MAX_PREVIOUS_SEARCH_TIMEOUT_SEC:	60 * 30,
	
	// Ajax types
	AJAX_DETAILS:	"acp_details",
	AJAX_FOLLOWUP:	"acp_flw",
	AJAX_PREV:		"acp_pre",
	AJAX_LOAD:		"acp_load",
	AJAX_QUERY:		"acp_new2",
	AJAX_POP:		"acp_pop",
	AJAX_QUERY_GL:	"acp_new",
	AJAX_MSG:		"acp_msg",
	AJAX_LOOPBACK:	"acp_loop",
	AJAX_STATS:		"acp_stats",
	
	// Target profile
	profile_type:	1,
	
	// AB Testing
	ab_test:		null,
	ab_test_source:	null,
	AB_TEST_SOURCE_PERSONAL: 'p',
	AB_TEST_SOURCE_GLOBAL: 	 'g',
	
	NO_RESULTS_FOUND_ID:	66666666,
	MOCK_RESULTS_ID:		77777777,
	
	INSTALL_CATEGORY: 'Install_66666666',
	
	css_background: 	"#fff",
	css_text_color: 	'#333',
	css_text_color_hover: 	'#fff',
	css_background_gradient_1: '#648ffa',
	css_background_gradient_2: 	'#0d67f7',	
	css_background_old_browsers: '#367af8',

	
	
	POP_SUGGESTIONS: null,	// Popular preprocessed suggestions!
	POP_SUGGESTIONS_CACHE: {}
	
};



function __acp_log(msg)	{
	try	{
		// console.log('[acpp] : ' + msg);
	}	catch(e)	{}
}



$jquery(document).ready(function() {
	var is_mobile = false;
	
	/*
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {	
		is_mobile = true;	
		__acp.max_autocomplete_total 		= acp_options.MAX_SEARCH_TERMS_SUGGESTIONS_MOBILE ? acp_options.MAX_SEARCH_TERMS_SUGGESTIONS_MOBILE: 3;
		__acp.MAX_INSTANT_ITEMS_TO_RENDER	= acp_options.MAX_INSTANT_SUGGESTIONS_MOBILE ? acp_options.MAX_INSTANT_SUGGESTIONS_MOBILE: 3;
	}
	*/
	
	var pre_focus_position;
	var pre_focus_left;
	var pre_focus_border_radius;
	var pre_focus_line_height;
	
	var original_magento_search_id = 'search';
	var new_magento_search_id = 'acp_magento_search_id';
	
	var thebox = $jquery("#" + original_magento_search_id );
	thebox.attr('autocomplete', '');
	thebox.attr('id', new_magento_search_id);
	thebox = $jquery("#"+new_magento_search_id);
	
	$jquery("#search_autocomplete").remove();	// remove the built-in Magento autocomplete container
	
	$jquery("#"+new_magento_search_id).focus(function() {	
		if (thebox.val() == thebox.attr("value"))	{
			thebox.val("");
		}
		
		if ( is_mobile )	{
			/*thebox.addClass('as_searchbox_focus_mobile');*/
			__acpParams.footer_html = __acpParams.footer_html_mobile;
			
			pre_focus_position 		= thebox.css('position');
			pre_focus_left     		= thebox.css('left');
			pre_focus_border_radius = thebox.css('border-radius');
			pre_focus_line_height	= thebox.css('line-height');
			
			thebox.css('position', 'absolute');
			thebox.css('left', '0');
			thebox.css('border-radius', '0');
			thebox.css('line-height', '1.2em');
			
			
			var targetOffset = thebox.offset().top;							
			$jquery(document).scrollTop(targetOffset);
		}		
	});
	$jquery("#"+new_magento_search_id).blur(function() {			
		if ( is_mobile )	{
			setTimeout(function()	{
					/*thebox.removeClass('as_searchbox_focus_mobile');*/
					
					thebox.css('position', pre_focus_position);
					thebox.css('left', pre_focus_left);
					thebox.css('border-radius', pre_focus_border_radius);
					thebox.css('line-height', pre_focus_line_height);
				}, 222);
		}
	});
	
	function escapeHTML(str) {
		return str.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;");
	}
	
	
	var navLang = (navigator.language) ? navigator.language : navigator.userLanguage;
	/*if ( get_QS( document.referrer ) == 1)	{
		api_incr_search_clone_cnt();		
	}*/
	
	setTimeout(	function()	{ calc_target_profile(); },
				api_db_global_store_wait_ms );

				
	
	// CHECK FOR ANOTHER VERSION...
	var acp_id = 'acp_func_active';
	// if ($jquery("#"+acp_id)[0])	{	return;		}
	$jquery('body').append('<acp id="' + acp_id + '"></acp>');	
	
	//var $ = $jquery;
	// CHECKS TO SEE IF THE PAGE NEEDS AC [START]
	// 0. https sites...
	if (window.location.protocol == 'https:')	{	
		__acp.SERVER_URL 	= __acp.SERVER_URL_HTTPS;	
		__acp.AC_GLOBAL_URL = __acp.AC_GLOBAL_URL_HTTPS;	
		__acp.STATS_URL 	= __acp.STATS_URL_HTTPS;
		__acp.UP_URL 		= __acp.UP_URL_HTTPS;		
	}
	
	var this_host = __acp.HOSTNAME;	
	if (this_host == 'demo.instantsearchplus.com')	{	
		this_host = 'magento-autocomplete.com';	
	}	
	if ( api_db_get( __acp.ACP_DISABLED_KEY_GENERAL, true ) == '1' )	{
		api_update_stats( __acp.STATS_CLIENT_DISABLED );
		return;	
	}	
	if ( api_db_get( __acp.ACP_DISABLED_KEY + this_host, false ) == '1' )	{	
		return;
	}
	
	
	// 0. Porn/obituaries sites
	var __LTR = true;
	var tit = document.title.toLowerCase() + document_keywords();
	for (var i=0;i<tit.length;i++){
		if ((tit.charCodeAt(i) > 0x590) && (tit.charCodeAt(i) < 0x5FF))  {
			__LTR = false;
			break;
		}	
	}
	var forbidd = ['porn','fuck','anal ','suck','tits','orgy','pussy','strip','slut','boobs','obitua','sex video'];
	for (var i=0; i<forbidd.length; i++)	{	
		if (tit.indexOf(forbidd[i])>=0)	{ 	
			__acp.porn_site = true;	
			break;			
		}
	}	
	
	if ($jquery.browser.opera)	{
		__acp_log('Opera is not supported');			
		return;
	}
	
	// 1. Against Alexa 100 blacklist sites
	var pass_blacklist = false;
	var white_list = [  'picasaweb.google.com' ];
	for (var i=0;i<white_list.length;i++)	{	
		if (this_host.indexOf(white_list[i])>=0)	{ 	pass_blacklist = true;	break;	}			
	}
	if (!pass_blacklist)	{
		var white_list = [	'gmail.com', 'google.com', 'hotmail.com', 'facebook.com', 'en.wikipedia.org','yahoo.com', 'ebay.com', 'amazon.com', 'etzy.com', 'youtube.com', 'taobao.com', 'yandex.ru', '163.com','microsoft.com','mail.ru','imdb.com', 'ask.com', 'youku.com', 'ifeng.com', 'tmall.com', 'alibaba.com', 'espn.go.com', 'blogspot','hao123.com','cnet.com','livedoor.com','stackoverflow.com'];
		for (var i=0;i<white_list.length;i++)	{	
			if (this_host.indexOf(white_list[i])>=0)	{ 
				__acp_log('top alexa');			
				api_update_stats( __acp.STATS_SITE_IRRELEVANT );

				/*api_ajax_request_get ( 	'irr',
										__acp.STATS_URL + "/irr?t=1&l=" + encodeURIComponent(this_host) + "&p=" + __acp.porn_site,
										function(){} );*/

				return;		
			}	
		}
	}
	
	// 2. Against is it an IP based URL?
	var no_dot = this_host.replace('.','').replace('.','').replace('.','');
	if ( (no_dot - 0) == no_dot && no_dot.length > 0 )	{	
		__acp_log('ip host');
		api_update_stats( __acp.STATS_SITE_IRRELEVANT );
		
		/*api_ajax_request_get ( 	'irr',
								__acp.STATS_URL + "/irr?t=3&l=" + encodeURIComponent(this_host) + "&p=" + __acp.porn_site,
								function(){} );*/
		
		return;	
	}


	

	// 3. Any input box in the page
	var possible_inputs = getPossibeMatchingInputs(document);
	try	{
		if (possible_inputs[0].input.offsetWidth < 150)	{
			possible_inputs = new Array();	//	 avoid dropdown on small boxes
		}
	}	catch (e)	{}
	if (possible_inputs.length == 0 || acp_options.DISABLE_DROPDOWN)	{	
		__acp_log('no matching inputbox');
		api_update_stats( __acp.STATS_SITE_IRRELEVANT );	
		return;	
	}
	
	var the_client_form_0 = null, the_client_form_1 = null, the_client_input_0 = null, the_client_input_1 = null;
	the_client_input_0 = possible_inputs[0].input;
	the_client_form_0  = possible_inputs[0].form;
	if (possible_inputs.length>1)	{
		the_client_input_1 = possible_inputs[1].input;
		the_client_form_1  = possible_inputs[1].form;	
	}

	__acp.input_id_0 = the_client_input_0.getAttribute('id');	
	if (__acp.input_id_0 	== null)	__acp.input_id_0 	='';	     							
	if (the_client_input_1 != null)	{
		__acp.input_id_1 = the_client_input_1.getAttribute('id');	
		if (__acp.input_id_1 	== null)	__acp.input_id_1 	='';	    	
	}
	// PAGE SEARCH ANALYSIS [END]
	
	// DISABLE THE FORM/INPUT AUTOCOMPLETE EARLY ON TO FIGHT IE... [START]
	the_client_input_0.setAttribute('autocomplete', __acp.ac_OfF);	
	if (the_client_input_1!=null)	{	the_client_input_1.setAttribute('autocomplete', __acp.ac_OfF);	 }
	//if (the_client_form_0 != null)	{	the_client_form_0.setAttribute('autocomplete', __acp.ac_OfF);		}		// no need to do this for Google Chrome
	//if (the_client_form_1 != null)	{	the_client_form_1.setAttribute('autocomplete', __acp.ac_OfF);		}	
	// DISABLE THE FORM/INPUT AUTOCOMPLETE EARLY ON TO FIGHT IE... [END]
	
	var ac_obj;
	

function __is_valid_thumb(t_url)	{
	return (t_url.indexOf('http')==0 || t_url.indexOf('//')==0);
}	
	
api_ajax_request_get(__acp.AJAX_POP,
  					 __acp.ACP_INSTANT_POP_SUGGESTS_URL.replace('{instanceId}', encodeURIComponent(instanceId)).replace('{searchSite}', encodeURIComponent(this_host)) + "&v=" + __acp.CLIENT_VER,
					 function( pop_response ) {						
						__acp.POP_SUGGESTIONS = pop_response;						
						for (var i=0;i<pop_response.length;i++)	{
							if (__acp.POP_SUGGESTIONS[i].value == '')	{
								delete( __acp.POP_SUGGESTIONS[i] );
								continue;
							}
							__acp.POP_SUGGESTIONS[i].label       = $jquery.trim( __acp.POP_SUGGESTIONS[i].label );
							__acp.POP_SUGGESTIONS[i].label_lower = __acp.POP_SUGGESTIONS[i].label.toLowerCase();
							__acp.POP_SUGGESTIONS[i].product_url = __acp.POP_SUGGESTIONS[i].value;
							__acp.POP_SUGGESTIONS[i].value = __acp.POP_SUGGESTIONS[i].label;	
							__acp.POP_SUGGESTIONS[i].type = __acp.WIX_SUGGESTION;
							if ( __acp.POP_SUGGESTIONS[i].thumb && __is_valid_thumb(__acp.POP_SUGGESTIONS[i].thumb))	{
								__acp.POP_SUGGESTIONS[i].thumbs_url   = __acp.POP_SUGGESTIONS[i].thumb;
								__acp.POP_SUGGESTIONS[i].type   = __acp.MAGENTO_SUGGESTION;
                            }
						}						
					 }
					);
					
						
						
							
     						//__acp.SEARCH_URL 				= 'https://www.google.com/search?q={searchTerms}&ie=utf-8&oe=utf-8&client=isp_wix';
	 						__acp.search_dest 				= 0;
	     					__acp.autocomplete_order		= ["personal", "popular", "related"];
							__acp.site_status 				= 1;						
							__acp.top_host_searches 		= [];						
							
																
							switch (__acp.site_status)	{
								case __acp.ACP_SITE_NOT_SUPPORTED: // blacklisted 
									api_update_stats( __acp.STATS_SITE_NOT_SUPPORTED );		
									return;
								case __acp.ACP_SITE_SUPPORTED:		//	supported site
								case __acp.ACP_SITE_GLOBAL_SEARCH: 	//  global search site
								case __acp.ACP_SITE_GLOBAL_RELATED: // global related site
									var disable_jquery_ui_css = acp_options.DISABLE_JQUERY_UI_CSS ? acp_options.DISABLE_JQUERY_UI_CSS : false;
									if (disable_jquery_ui_css)	{
										api_add_css_style('acp_autocomplete_css', ".ui-helper-hidden{display:none}.ui-helper-hidden-accessible{position:absolute;left:-99999999px}.ui-helper-reset{margin:0;padding:0;border:0;outline:0;line-height:1.3;text-decoration:none;font-size:100%;list-style:none}.ui-helper-clearfix:after{content:'.';display:block;height:0;clear:both;visibility:hidden}.ui-helper-clearfix{display:inline-block}/*\*/* html .ui-helper-clearfix{height:1%}.ui-helper-clearfix{display:block}/**/.ui-helper-zfix{width:100%;height:100%;top:0;left:0;position:absolute;opacity:0;filter:Alpha(Opacity=0)}.ui-state-disabled{cursor:default!important}.ui-icon{display:block;text-indent:-99999px;overflow:hidden;background-repeat:no-repeat}.ui-widget-overlay{position:absolute;top:0;left:0;width:100%;height:100%}.ui-autocomplete{position:absolute;cursor:default}.ui-autocomplete-loading{background:white url('images/ui-anim_basic_16x16.gif') right center no-repeat}* html .ui-autocomplete{width:1px}.ui-menu{list-style:none;padding:2px;margin:0;display:block}.ui-menu .ui-menu{margin-top:-3px}.ui-menu .ui-menu-item{margin:0;padding:0;zoom:1;float:left;clear:left;width:100%}.ui-menu .ui-menu-item a{text-decoration:none;display:block;padding:.2em .4em;line-height:1.5;zoom:1}.ui-menu .ui-menu-item a.ui-state-hover,.ui-menu .ui-menu-item a.ui-state-active{font-weight:normal;margin:0px}/*.ui-widget{font-family:Verdana,Arial,sans-serif;font-size:1.1em}.ui-widget .ui-widget{font-size:1em}.ui-widget input,.ui-widget select,.ui-widget textarea,.ui-widget button{font-family:Verdana,Arial,sans-serif;font-size:1em}*/.ui-widget-content{border:1px solid #aaa;background:#eee url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/ui-lightness/images/ui-bg_highlight-soft_100_eeeeee_1x100.png) 50% 50% repeat-x;color:#222}.ui-widget-content a{color:#777}.ui-widget-header{border:1px solid #aaa;background:#f6a828 url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/base/images/ui-bg_gloss-wave_35_f6a828_500x100.png) 50% 50% repeat-x;color:#222;font-weight:bold}.ui-widget-header a{color:#222}/*.ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default{border:1px solid #d3d3d3;background:#f6f6f6 url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/ui-lightness/images/ui-bg_glass_100_f6f6f6_1x400.png) 50% 50% repeat-x;font-weight:normal;color:#555}*/.ui-state-default a,.ui-state-default a:link,.ui-state-default a:visited{color:#555;text-decoration:none}.ui-state-hover,.ui-widget-content .ui-state-hover,.ui-widget-header .ui-state-hover,.ui-state-focus,.ui-widget-content .ui-state-focus,.ui-widget-header .ui-state-focus{border:1px solid #999;background:#fdf5ce url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/ui-lightness/images/ui-bg_glass_100_fdf5ce_1x400.png) 50% 50% repeat-x;font-weight:normal;color:#212121}.ui-state-hover a,.ui-state-hover a:hover{color:#212121;text-decoration:none}.ui-state-active,.ui-widget-content .ui-state-active,.ui-widget-header .ui-state-active{border:1px solid #aaa;background:#fff url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/ui-lightness/images/ui-bg_glass_65_ffffff_1x400.png) 50% 50% repeat-x;font-weight:normal;color:#212121}.ui-state-active a,.ui-state-active a:link,.ui-state-active a:visited{color:#212121;text-decoration:none}.ui-widget :active{outline:0}.ui-state-highlight,.ui-widget-content .ui-state-highlight,.ui-widget-header .ui-state-highlight{border:1px solid #fcefa1;background:#fbf9ee url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/ui-lightness/images/ui-bg_highlight-soft_75_ffe45c_1x100.png) 50% 50% repeat-x;color:#363636}.ui-state-highlight a,.ui-widget-content .ui-state-highlight a,.ui-widget-header .ui-state-highlight a{color:#363636}.ui-state-error,.ui-widget-content .ui-state-error,.ui-widget-header .ui-state-error{border:1px solid #cd0a0a;background:#fef1ec url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/base/images/ui-bg_diagonals-thick_18_b81900_40x40.png) 50% 50% repeat-x;color:#cd0a0a}.ui-state-error a,.ui-widget-content .ui-state-error a,.ui-widget-header .ui-state-error a{color:#cd0a0a}.ui-state-error-text,.ui-widget-content .ui-state-error-text,.ui-widget-header .ui-state-error-text{color:#cd0a0a}.ui-priority-primary,.ui-widget-content .ui-priority-primary,.ui-widget-header .ui-priority-primary{font-weight:bold}.ui-priority-secondary,.ui-widget-content .ui-priority-secondary,.ui-widget-header .ui-priority-secondary{opacity:.7;filter:Alpha(Opacity=70);font-weight:normal}.ui-state-disabled,.ui-widget-content .ui-state-disabled,.ui-widget-header .ui-state-disabled{opacity:.35;filter:Alpha(Opacity=35);background-image:none}.ui-corner-tl{-moz-border-radius-topleft:4px;-webkit-border-top-left-radius:4px;border-top-left-radius:4px}.ui-corner-tr{-moz-border-radius-topright:4px;-webkit-border-top-right-radius:4px;border-top-right-radius:4px}.ui-corner-bl{-moz-border-radius-bottomleft:4px;-webkit-border-bottom-left-radius:4px;border-bottom-left-radius:4px}.ui-corner-br{-moz-border-radius-bottomright:4px;-webkit-border-bottom-right-radius:4px;border-bottom-right-radius:4px}.ui-corner-top{-moz-border-radius-topleft:4px;-webkit-border-top-left-radius:4px;border-top-left-radius:4px;-moz-border-radius-topright:4px;-webkit-border-top-right-radius:4px;border-top-right-radius:4px}.ui-corner-bottom{-moz-border-radius-bottomleft:4px;-webkit-border-bottom-left-radius:4px;border-bottom-left-radius:4px;-moz-border-radius-bottomright:4px;-webkit-border-bottom-right-radius:4px;border-bottom-right-radius:4px}.ui-corner-right{-moz-border-radius-topright:4px;-webkit-border-top-right-radius:4px;border-top-right-radius:4px;-moz-border-radius-bottomright:4px;-webkit-border-bottom-right-radius:4px;border-bottom-right-radius:4px}.ui-corner-left{-moz-border-radius-topleft:4px;-webkit-border-top-left-radius:4px;border-top-left-radius:4px;-moz-border-radius-bottomleft:4px;-webkit-border-bottom-left-radius:4px;border-bottom-left-radius:4px}.ui-corner-all{-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px}.ui-widget-overlay{background:#aaa url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/base/images/ui-bg_flat_0_aaaaaa_40x100.png) 50% 50% repeat-x;opacity:.3;filter:Alpha(Opacity=30)}.ui-widget-shadow{margin:-8px 0 0 -8px;padding:8px;background:#aaa url(https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/base/images/ui-bg_flat_0_aaaaaa_40x100.png) 50% 50% repeat-x;opacity:.3;filter:Alpha(Opacity=30);-moz-border-radius:8px;-webkit-border-radius:8px;border-radius:8px}");
									}
									
									api_update_stats( __acp.STATS_SITE_SUPPORTED );									
									if (__acp.input_id_0 == '')	{
										__acp.input_id_0 = __acp.missing_input_id_0;
										the_client_input_0.setAttribute('id', __acp.input_id_0);
									}
									if (the_client_input_1 != null && __acp.input_id_1 == '')	{
										__acp.input_id_1 = __acp.missing_input_id_1;
										the_client_input_1.setAttribute('id', __acp.input_id_1);
									}

		     						__acp.input_id_0 = '#' + __acp.input_id_0;
		     						var element_0 = $jquery(__acp.input_id_0);	

									if (__acpParams.open_suggestions_on_focus)	{			
										$jquery(__acp.input_id_0).focus(function()	{
											setTimeout(function()	{
													$jquery(__acp.input_id_0).autocomplete("search", $jquery(__acp.input_id_0).val());											
												}, 111);
										});
										if (the_client_input_1 != null && __acp.input_id_1 == '')	{
											$jquery(__acp.input_id_1).focus(function()	{
												$jquery(__acp.input_id_1).autocomplete("search", $jquery(__acp.input_id_1).val());												
											});										
										}
										
									}										
									
									
									try	{										
										if ( __acpParams.focus_on_searchbox 
											 && element_0.offset().top>$jquery(window).scrollTop() && element_0.offset().top < ($jquery(window).scrollTop() + $jquery(window).height() )
											 && document.activeElement.nodeName.toLowerCase()!= 'input' )	{
											 
											element_0.focus();
											// element_0.val('');
											setTimeout( function() { $jquery('#' + __acp.css_init_element_id).removeClass("ui-autocomplete-loading"); }, 1111);											
										}
									}	catch (e)	{}
									
									if (the_client_input_1 != null)	{
		     							__acp.input_id_1 = '#' + __acp.input_id_1;
		     							var element_1 = $jquery( __acp.input_id_1 );
		     						}
		     								     						
		     						var inputs_list = __acp.input_id_0; if (the_client_input_1 != null)	{	inputs_list += ',' +__acp.input_id_1;	} 
									
									
									function mix_history_suggestions(term, server_term, data_sug)	{							
										var local_history = getSiteUserHistory(term, __acp.max_autocomplete_personal);															
										var local_history_wix = getSiteUserHistory_wix(term, __acp.max_autocomplete_personal);															
										
										local_history = local_history_wix.concat( local_history );
										
										var data_items = new Array();												
										var temp_list  = new Array();
										if (data_sug == null)	{
											data_sug = new Array();
										}
										if (local_history.length==0)	{
											if (data_sug != null)	{
												data_items = data_sug;											
											}
										}	else	{  	// TODO: support personal items in the middle between popular and related (low priority todo...)
											if (__acp.autocomplete_order[0]=='personal')	{	
												data_items = local_history;
												temp_list  = data_sug;
											}	else	{
												data_items = data_sug;
												temp_list  = local_history;												     				    		
											}	
											// validate no double showing for the same term... might be in the previous history as well as in the populars												     				    												     				    	
											
											for (var j=0;j<temp_list.length;j++)	{	
												var newO = temp_list[j];
												var add_item = true;
												for (var i=0;i<data_items.length;i++)	{													
													if (data_items[i].label == newO.label && (data_items[i].type == newO.type || (data_items[i].id && newO.id && (data_items[i].id == newO.id))))	{	
														add_item=false;	
														break;
													}	
												}
												if (add_item)	{	data_items.push(newO);	}
											}															
										}	
										
										
																				
										var ret = get_non_repeating_related_suggestions(data_items);
										while (ret.length > __acp.max_autocomplete_total)	{
											delete ret[__acp.max_autocomplete_total];
											ret.length = ret.length - 1;
										}
										__acp.requests_cache[server_term] = ret;
										
										return ret;
									}

									var uppercase_regexp = new RegExp('[A-Z]');
									function capitaliseFirstLetter(string)	{
										if (string.match(uppercase_regexp)==null)	{
											var string = string.toLowerCase();
											if (string == 'faq' || string == 'cd' || string == 'asap')	{
												return string.toUpperCase();
											}
											var string = string.toLowerCase();
											return string.charAt(0).toUpperCase() + string.slice(1);
										}	else	{
											// No need... there's at least one Uppercase here!
											return string;
										}
									}
									
									function append_wix_suggestions(term, data_items)	{
										// Already computed from the /pop request 
										var pop_ret = new Array();
										if (term in __acp.POP_SUGGESTIONS_CACHE)	{
											pop_ret = __acp.POP_SUGGESTIONS_CACHE[term];
										}
									
										term = term.toLowerCase();
										/*
										
										if (!(term in __acp.ACP_INSTANT_SUGGEST_CACHE) || !(term in __acp.latest_data_obj))	{		
											var CACHE_ITEM = pop_ret;
										}	else	{
											var CACHE_ITEM = __acp.ACP_INSTANT_SUGGEST_CACHE[term];
										}
										*/
										
										// Get the pop local on top of the server for the sake of consistency
										var CACHE_ITEM = pop_ret;	
										if (term in __acp.ACP_INSTANT_SUGGEST_CACHE)	{
											for (var i=0;i<__acp.ACP_INSTANT_SUGGEST_CACHE[term].length;i++)	{
												var add_this = true;
												for (var j=0;j<CACHE_ITEM.length;j++)	{	
													if ( __acp.ACP_INSTANT_SUGGEST_CACHE[term][i].id && 
														 __acp.ACP_INSTANT_SUGGEST_CACHE[term][i].id != __acp.MOCK_RESULTS_ID &&
														 CACHE_ITEM[j].id &&
														 __acp.ACP_INSTANT_SUGGEST_CACHE[term][i].id == CACHE_ITEM[j].id )	{	
														// Avoid adding if the same suggestion id already exist
														add_this = false;
														break;
													}
												}
												if (add_this)	{
													CACHE_ITEM.push( __acp.ACP_INSTANT_SUGGEST_CACHE[term][i] );
												}
											}											
										}
																						
										// Verify it wasn't added before...						
										var items_len = data_items.length;
										while (items_len--) {
											if (data_items[items_len].type == __acp.WIX_SUGGESTION)	{												
												data_items.splice(items_len, 1);
											}
										}						
																					
										var product_suggestions_first = acp_options.PRODUCT_SUGGESTIONS_FIRST ? acp_options.PRODUCT_SUGGESTIONS_FIRST : true;
										var wix_suggest_list = new Array();
										var at_least_one_real_wix_suggest = false;
										
										for (var i=0; i<CACHE_ITEM.length && i<__acp.MAX_INSTANT_ITEMS_TO_RENDER && data_items.length<__acp.MAX_INSTANT_ITEMS_TO_RENDER;i++) {
											if ( CACHE_ITEM[i] != null)	{
												if (CACHE_ITEM[i].id == __acp.NO_RESULTS_FOUND_ID && at_least_one_real_wix_suggest)	{	
													// Skip search suggestions if there's at least one real suggest	
													continue;	
												}
												var newObj = new Object();
												newObj.label   = capitaliseFirstLetter( $jquery.trim(CACHE_ITEM[i]['label']) );
																								
												// Let's verify no same item from history exist...
												var skip_this = false;
												for (var ex=0;ex<data_items.length;ex++)	{
													if (data_items[ex].label == newObj.label && data_items[ex].type == __acp.HISTORY_SUGGESTION)	{
														skip_this = true;
														break;
													}
												}
												// Let's verify no same item from /pop cache...												
												for (var ex=0;ex<wix_suggest_list.length;ex++)	{
													if (wix_suggest_list[ex].label == newObj.label ) {
														skip_this = true;
														break;
													}
												}
												if (skip_this)	{	continue;	}
												newObj.value 	 	= $jquery.trim(CACHE_ITEM[i]['label']);
												newObj.id 	 		= $jquery.trim(CACHE_ITEM[i]['id']);
												
												if (CACHE_ITEM[i].product_url)	{
													newObj.product_url = CACHE_ITEM[i].product_url;
												}	else	{
													newObj.product_url = CACHE_ITEM[i]['value'];
												}
												 	
																									
												if ('category' in CACHE_ITEM[i])	{														
													var cat_trim = $jquery.trim( api_get_category_of_wix_page( newObj.product_url ) );	// 	CACHE_ITEM[i]['category'] );
													if ( cat_trim != '' && cat_trim != newObj.value && cat_trim != __acp.INSTALL_CATEGORY)	{														
														// newObj.category	= capitaliseFirstLetter( CACHE_ITEM[i]['category'] );
														newObj.category	= capitaliseFirstLetter( cat_trim );
													}	else	{
														newObj.category = '';
													}
												}
												if ('alias' in CACHE_ITEM[i])	{														
													var alias_trim = $jquery.trim( CACHE_ITEM[i]['alias'] );
													newObj.alias = capitaliseFirstLetter( alias_trim );
												}													
												
												newObj.type = __acp.WIX_SUGGESTION;
												at_least_one_real_wix_suggest = true;
												if ( 'thumb' in CACHE_ITEM[i] && __is_valid_thumb(CACHE_ITEM[i]['thumb']) )	{
													newObj.thumbs_url   = CACHE_ITEM[i]['thumb'];
													newObj.type = __acp.MAGENTO_SUGGESTION;											
													if ('price' in CACHE_ITEM[i]	)	{														
														newObj.price 	    = CACHE_ITEM[i]['price'];
													}	else	{
														newObj.price = '';
													}
												
													if ('currency' in CACHE_ITEM[i]	)	{													
														newObj.currency	    = CACHE_ITEM[i]['currency'];
													}	else	{
														newObj.currency	    = '';
													}
												}													
												wix_suggest_list.push( newObj );													
											}
										}		

										if (product_suggestions_first)	{
											data_items = wix_suggest_list.concat( data_items );
										}	else	{
											data_items = data_items.concat( wix_suggest_list );
										}						
										// Bring history items to the TOP
										var really_final_his = new Array();
										var really_final_rest = new Array();
										var any_history = false;
										for (var i=0;i<data_items.length;i++)	{
											if (data_items[i].type == __acp.HISTORY_SUGGESTION)	{	
												really_final_his.push( data_items[i] );		
												any_history=true;	
											}	else	{														
												if ((data_items[i].id == __acp.NO_RESULTS_FOUND_ID || data_items[i].id == __acp.MOCK_RESULTS_ID) && any_history)	{
													// Don't add the no results found if there's a history item...
													continue;
												}
												really_final_rest.push( data_items[i] );	
											}
										}
										data_items = really_final_his.concat( really_final_rest );
										
										// Put the ones with thumbnails at the top!
										var final_thumb = new Array();
										var final_rest  = new Array();
										for (var i=0;i<data_items.length;i++)	{
											if (data_items[i].type == __acp.MAGENTO_SUGGESTION)	{	
												final_thumb.push( data_items[i] );		
											}	else	{
												final_rest.push( data_items[i] );
											}
										}
										data_items = final_thumb.concat( final_rest );
										
										
										for (var order=0; order<data_items.length; order++)	{
											data_items[order].sug_pos = order;
										}
										return data_items;									
									}
									
									
									
									function get_amazon_suggest(term)	{										
										__acp.ACP_AMAZON_LATEST_SUGGEST = null;									
										if (term.length < __acp.ACP_AMAZON_SHOW_MIN_CHAR) {	return;	}
										var cur_term_words = term.split(' ');
										if (cur_term_words.length < __acp.ACP_AMAZON_SHOW_MIN_WORD) {	return;	}
										api_get_amazon_suggest(__acp.ACP_AMAZON_COMPLETE_URL.replace('{searchTerms}', term), 
															   function(data){
																	__acp.ACP_AMAZON_LATEST_SUGGEST = data;
															   });									
									}
									function get_instantsearch_suggest(term, site, ac_response)	{										
										var term = term.toLowerCase();
										try	{
											if ( term in __acp.ACP_INSTANT_SUGGEST_CACHE )	{	
												var inputbox_term = $jquery.trim($jquery('#' + __acp.css_init_element_id).val().toLowerCase());												
												if ( term == inputbox_term || inputbox_term in __acp.ACP_INSTANT_SUGGEST_CACHE )	{
													var data_items = mix_history_suggestions( term, inputbox_term, __acp.latest_data_obj[ inputbox_term ] );
													data_items = append_wix_suggestions(inputbox_term, data_items);						
													if (data_items == null)	{	return;		}
													// __acp_log('get_instantsearch_suggest REDNER ACP_INSTANT_SUGGEST_CACHE for: ' + term + ' | ' + data['term'] + ' | ' + inputbox_term);
													ac_response( $jquery(data_items) );		// 1) get_instantsearch_suggest from cache 
												}	  
											}
										}	catch(e)	{}
										
										api_get_instantsearch_suggest(__acp.ACP_INSTANT_COMPLETE_URL.replace('{instanceId}', encodeURIComponent(instanceId)).replace('{searchTerms}', encodeURIComponent(term)).replace('{searchSite}', encodeURIComponent(site)) + '&n=' + __acp.MAX_INSTANT_ITEMS_TO_RENDER + '&v=' + __acp.CLIENT_VER, 
															   function(data){		
																	var server_term = data['term'];
																	
																	if (data['items'] && data['items'].length>0)	{																		
																		__acp.ACP_INSTANT_SUGGEST_CACHE[ server_term  ] = data['items'];	
																	}																	
																	
																	var inputbox_term = $jquery.trim($jquery('#' + __acp.css_init_element_id).val().toLowerCase());												
																	if ( server_term == inputbox_term || inputbox_term in __acp.ACP_INSTANT_SUGGEST_CACHE )	{
																		var data_items = mix_history_suggestions( term, inputbox_term, __acp.latest_data_obj[ inputbox_term ] );
																		data_items = append_wix_suggestions(inputbox_term, data_items);						
																		if (data_items == null)	{	return;		}
																		// __acp_log('get_instantsearch_suggest REDNER for: ' + term + ' | ' + data['term'] + ' | ' + inputbox_term);
																		ac_response( $jquery(data_items) );		// 	2) api_get_instantsearch_suggest from INTERNET
																	}	else	{
																		// ac_response( null );																		
																	}
																	
															   });									
									}
									
									function get_non_repeating_related_suggestions(data_items)	{
										var ret_data_items = new Array();
										
										if (data_items)	{
											for (var j=0;j<data_items.length;j++)	{											
												var found_already = false;
												for (var i=0;i<j;i++)	{
													if (data_items[i].type == data_items[j].type && data_items[i].label.toLowerCase() == data_items[j].label.toLowerCase())	{													
														found_already = true;
														break;
													}											
												}
												if (!found_already)	{
													ret_data_items.push(data_items[j]);
												}
											}
										}
										return ret_data_items;
									}
												
									
									function render_acp_personal(term, ac_response)	{	
										var term = term.toLowerCase();
										var tar_url = __acp.SERVER_URL + "/?q=" + encodeURIComponent(term.toLowerCase()) + "&p=" + __acpParams.PARTNER_ID + "&l=" + encodeURIComponent(this_host) + "&v=" + __acp.CLIENT_VER;
										api_ajax_request_get ( __acp.AJAX_QUERY,
											tar_url,																		
											function( data_sug ) {													
												var server_term   = data_sug.term;	
												if (__acp.ab_test == null)	{	
													// First request...
													__acp.ab_test = data_sug.ab;	
												}	else	{
													// Subsequent requests...
													if (__acp.ab_test != data_sug.ab)	{
														// Not consistent with prior requests...
														__acp.ab_test = ''; 
													}													
												}
												if (__acp.ab_test_source == null && data_sug.items.length>=4)	{
													__acp.ab_test_source = __acp.AB_TEST_SOURCE_PERSONAL;
												}	
												
												// Magento... change all server items marked as Related web searches to be site-specific...
												for (var i=0;i<data_sug.items.length;i++)	{														
													if (data_sug.items[i].type == __acp.RELATED_SUGGESTION)	{
														data_sug.items[i].type = __acp.POP_SUGGESTION;
													}													
												}		 
												
												
												var inputbox_term = $jquery.trim($jquery('#' + __acp.css_init_element_id).val().toLowerCase());
												
												if ( server_term  != inputbox_term )	{
													// ac_response( null );	// $jquery(__acp.requests_cache[ inputbox_term ]) );
													return;	
												}

												
												var data_items_followups = getFollowups(term, __acp.max_followups);
												if (data_items_followups.length>0)	{
													var the_items = new Array();
													the_items = data_items_followups.concat(data_items_followups, data_sug.items);																											
												}	else	{
													the_items = data_sug.items;
												}
												
												__acp.latest_acp_personal_term 		= term;												
												__acp.latest_acp_personal_res_len 	= the_items.length;												
												
												if ( false && the_items.length < __acp.max_autocomplete_total && term.length>=__acp.GLOBAL_MIN_CHARS)	{
													render_acp_global(term, ac_response, the_items);	
												}	else	{
													var data_items = new Array();
													data_items = mix_history_suggestions(term, data_sug.term, the_items);
											
													if (data_items.length >0)	{ 													
													__acp.latest_data_obj[server_term] = data_items;
													}																										
													data_items = append_wix_suggestions(term, data_items);
													// __acp_log('render_acp_personal REDNER for: ' + term + ' | ' + server_term + ' | ' + inputbox_term + ' | len: '+ the_items.length);
													ac_response( $jquery( data_items ) );			// 3) render_acp_personal									
												}
											}
										);													
									}
									
									function render_acp_global(term, ac_response, acp_personal_items)	{
										var navLang = (navigator.language) ? navigator.language : navigator.userLanguage;
										var tar_url = __acp.AC_GLOBAL_URL + '/?q=' + encodeURIComponent(term.toLowerCase()) + '&l=' + navLang.substring(0,2);	
										
										__acp.ab_test_source = __acp.AB_TEST_SOURCE_GLOBAL;
										
										api_ajax_request_get ( __acp.AJAX_QUERY_GL,
											tar_url,																		
											function( data_sug ) {																														
												// GLOBAL search site...
												var server_term   = data_sug.query;
												var inputbox_term = $jquery('#' + __acp.css_init_element_id).val().toLowerCase();
												
												if ( server_term  != inputbox_term )	{
													//ac_response( null );	// $jquery(__acp.requests_cache[ inputbox_term ]) );
													return;	
												}														
												
												var data_items = new Array();	
												
												if (acp_personal_items != null)	{	data_items = acp_personal_items;	}
												var initial_suggestion_len = data_items.length;
												var suggestions_to_add = __acp.max_autocomplete_total;
												
												if (__acpParams.what_you_type_suggestion && __acpParams.what_you_type_position_first && __acp.site_status != __acp.ACP_SITE_GLOBAL_RELATED)	{
													var newObj = new Object();	newObj.label = term;	newObj.type  = __acp.RELATED_SUGGESTION;	data_items.push(newObj);													
												}
												
												for (var j=0; j<data_sug.items.length && j<__acp.max_autocomplete_global && j<suggestions_to_add && data_items.length<__acp.max_autocomplete_total; j++)	{
													var newObj   = new Object();
													if (is_profanity(data_sug.items[j]))	{	continue;	}
													newObj.label = data_sug.items[j];													
													newObj.type  = __acp.RELATED_SUGGESTION;
													data_items.push( newObj );
												}	
												
												if (__acpParams.what_you_type_suggestion 
													&& (__acp.site_status == __acp.ACP_SITE_GLOBAL_RELATED || __acpParams.what_you_type_position_first==false) 
													&& data_items.length<__acp.max_autocomplete_total)	{
													var newObj = new Object();	newObj.label = term;	newObj.type  = __acp.RELATED_SUGGESTION;	data_items.push(newObj);
												}
												
												var data_sug = new Object();
												data_sug.items = data_items;
												data_items = mix_history_suggestions(term, server_term, data_sug.items);												
																								
												// if (data_items.length >0)	{ 
													__acp.latest_data_obj[server_term] = data_items;		// global memory cache...
												// }											

												// Only render the dropdown if we recieved both Wix and AC+ Global
												data_items = append_wix_suggestions(term, data_items);
												if (data_items == null)	{
													// not ready yet with the Wix GAE response...
													return;
												}
												__acp_log('render_acp_global REDNER for: ' + term + ' | ' + data_items + ' | ' + inputbox_term);
												ac_response( $jquery(data_items) );			// global													
											
											}
										);												
									}
									
									function get_pop_suggestions_preprocessed(term)	{
										pop_ret = new Array();
										if (term.length > 0 && __acp.POP_SUGGESTIONS != null)	{																					
											// term = $jquery.trim( term.toLowerCase() );
											for (var i=0;i<__acp.POP_SUGGESTIONS.length;i++)	{	
												if (__acp.POP_SUGGESTIONS[i].alias)	{
													var match_loc = __acp.POP_SUGGESTIONS[i].alias.toLowerCase().indexOf( term );												
												}	else	{
													var match_loc = __acp.POP_SUGGESTIONS[i].label_lower.indexOf( term );												
												}
												if ( match_loc >= 0 ) {
													var found_already = false;
													for (var j=0;j<pop_ret.length;j++)	{
														if ( __acp.POP_SUGGESTIONS[i].label_lower == __acp.POP_SUGGESTIONS[j].label_lower )	{
															found_already = true;
															break;
														}
													}
													if (found_already)	{	continue;	}				
													var cat = api_get_category_of_wix_page( __acp.POP_SUGGESTIONS[i].product_url );
													if (cat != null && cat != '' && cat.toLowerCase() != __acp.POP_SUGGESTIONS[i].label_lower)	{
														__acp.POP_SUGGESTIONS[i].category = capitaliseFirstLetter( cat );
													}	else	{
														__acp.POP_SUGGESTIONS[i].category = '';
													}
													if (match_loc == 0)	{													
														pop_ret.push( __acp.POP_SUGGESTIONS[i] );
													}	else	{
														if (term.length >= 2)	{
															var prev_char = __acp.POP_SUGGESTIONS[i].label_lower[match_loc-1];
															if (prev_char == ' ' || prev_char == '-')	{
																pop_ret.push( __acp.POP_SUGGESTIONS[i] );
															}
														}
													}
													if (pop_ret.length >= __acp.MAX_INSTANT_ITEMS_TO_RENDER)	{	
														break;	// bingo - found them all! 
													}
												}													
											}
										}
										__acp.POP_SUGGESTIONS_CACHE[term] = pop_ret;
										return pop_ret;
									}
												
									ac_obj = $jquery(inputs_list).autocomplete({
									    // position: {  my: "right top", at: "right bottom", collision: "none" },
										delay: 0,
							        	minLength: 0,							        	
							            source: function(request, ac_response) {										
											setTimeout( function() { $jquery('#' + __acp.css_init_element_id).removeClass("ui-autocomplete-loading"); }, 1111);
											
							            	if ( the_client_input_0.getAttribute('autocomplete') == 'off' )	{	
												ac_response( null );
							            		return;
							            	}
											if ( api_db_get( __acp.ACP_DISABLED_KEY_GENERAL, true  ) == '1' || api_db_get( __acp.ACP_DISABLED_KEY + this_host, false ) == '1' )	{	return;	}
							                var term = request.term.replace(/&/g, '%26').toLowerCase();		

											if 	(term.indexOf('<')>=0 || term.indexOf('>')>=0)	{
												ac_response( null );
												return;
											}
																						
											if (__acp.css_init_element_id != this.element.attr("id"))	{ 
												init_site_css (this.element); 
												var stam = String(this.element.attr("id"));
												__acp.css_init_element_id = stam;															
											}
																				
							                if (term.length > 0 && term.length < 70) {	
												// Hack to capture extra space upon user keystroke... it will be smaller once we render stuff..
												try	{
													/* *** Wix.resizeWindow(iframe_max_width, 300, function(){});	*** */
												}	catch (e)	{
													// maybe we're in the Wix Modal view and resize wouldn't work!
												}
												
												// Let's fetch AC+ Glboal suggestions....
												if (term.length>=__acp.GLOBAL_MIN_CHARS) {
													render_acp_global(term, ac_response, null);
												}	else	{
													__acp.latest_data_obj[term.toLowerCase()] = null;													
												}
												
												// Check if in POP_SUGGESTIONS in the client already!
												pop_ret = get_pop_suggestions_preprocessed( term );	
												if (pop_ret.length > 0)	{
													var data_items = mix_history_suggestions( term, term, __acp.latest_data_obj[ term ] );
													data_items = append_wix_suggestions(term, data_items);													
													ac_response(data_items);											
													if (data_items.length >= __acp.MAX_INSTANT_ITEMS_TO_RENDER)	{												
														return;
													}
												}
											
												// Ask the server if not enough client side suggestions!
												get_instantsearch_suggest(term, this_host, ac_response);													
												
							                }	else	{
												// Hack to capture extra space upon user keystroke... it will be smaller once we render stuff..
												try	{
													/* *** Wix.resizeWindow(iframe_max_width, $jquery("ul.ui-autocomplete").outerHeight() + iframe_height, function(){}); *** */
												}	catch (e)	{
													// maybe we're in the Wix Modal view and resize wouldn't work!
												}
												
												
							                	// searchox is empty now (after deleting stuff)... let's close the dropdown
												if (__acpParams.open_suggestions_on_focus )	{
													var data_items		 = getFollowups('', __acp.max_followups);
													var data_items_his 	 = getSiteUserHistory_wix('', Math.min(__acp.max_autocomplete_personal, __acp.max_autocomplete_total-data_items.length));
													var data_items_rel_his = getSiteUserHistory('',  Math.min(__acp.max_autocomplete_personal, __acp.max_autocomplete_total-data_items.length-data_items_his.length));																												
													data_items.push.apply(data_items, data_items_his);	
													data_items.push.apply(data_items, data_items_rel_his);	
													
													/*
													Don't show top site terms upon focus...
													var data_items_top = getTopSiteSearches( __acp.max_autocomplete_total-data_items.length );
													// 
													data_items.push.apply(data_items, data_items_top);	
													*/

													if (data_items.length > 0)	{														
														__acp.requests_cache[''] 	= data_items;																																							
														//__acp.latest_data_obj 		= data_items;
													}
													
													ac_response( $jquery( data_items) );	// 4) open empty input
													return;
												}
												
												$jquery('#' + __acp.css_init_element_id).removeClass("ui-autocomplete-loading"); 
												this.close();
							                }
											
											// Just to make sure that the dropdown is aligned with the inputbox
											/*
											setTimeout(function()	{
													var inp_ele = $jquery('#' + __acp.css_init_element_id)
													var inp_left_offset = inp_ele.offset().left;
													
													var dropdown_ele = $jquery( ".ui-autocomplete" )
													var dropdown_left = dropdown_ele.offset().left;
													console.log(dropdown_left + ' vs. ' + inp_left_offset);												
													
												}, 500);
											*/			
											

											
							            },	// end of source:							            
							            
							            search: function(event, ui) { 
							            	__acp.focused_item_type = null;							            	
							            	__acp.focused_item_label = null;								            	
							            },
							            focus: function(event, ui)	{
							            	__acp.focused_item_type  = ui.item.type;							            	
							            	__acp.focused_item_label = ui.item.label;	
	
	// event.targetthis.active.children("a").removeClass("ui-state-focus");

							            },
							            select: function(event, ui) {
											try {
												Wix.setHeight(original_widget_height, {overflow:false});
											}	catch (e)	{}
											
							            	// event.preventDefault();
							            	// event.stopImmediatePropagation();
						            		var input_element = $jquery('#' + __acp.css_init_element_id);
											var orig_term	  = input_element.val().toLowerCase();
											
				     						
				     						var the_term = input_element.val();		// ui.item.label
											input_element.val( '' );	//	 ui.item.label );
							            	var enter_key=!1;13==event.which&&(enter_key=!0);
											var ui_item_type = ui.item.type;
																						
											if (ui.item.id == __acp.MOCK_RESULTS_ID)	{
												// Mock results...
												return false;
											}
																						
											if (ui.item.id == __acp.NO_RESULTS_FOUND_ID)	{	
												input_element.val( the_term );
												api_do_full_text_search();	// Stop navigation for the hardcoded Wix links
												return false;	
											}	
											
											switch (ui.item.type)	{
												case __acp.WIX_SUGGESTION:	
												case __acp.HISTORY_SUGGESTION:
													// navigate(ui.item.product_url, __acp.search_target, enter_key);		
													server_loopback( ui.item, true, orig_term );	// send to server + add to local history	
													return false;
												case __acp.RELATED_SUGGESTION:
													try	{
														api_update_stats( __acp.STATS_USE_RELATED );														
														server_loopback( ui.item, false, orig_term );	// send to server but don't add to local history	
													}	catch (e)	{}
													// navigate(api_get_search_redirect_url(ui.item.label), 'tab', enter_key);		
													return false;																
												default:						
													// navigate(ui.item.product_url, __acp.search_target, enter_key);		
													return false;
												
													alert('eeerrr');
													if (ui_item_type == __acp.POP_SUGGESTION )	{	
														api_update_stats( __acp.STATS_USE_POP );																
													}
													if (ui_item_type == __acp.HISTORY_SUGGESTION )	{																
														api_update_stats( __acp.STATS_USE_HISTORY );														
													}
													server_loopback( the_term, true, true, orig_term );	// send to server + to local history							            	

													if (__acp.search_dest == 1)	{
														// use the partner's search destination with a domain site search 
														var tari = this_host.replace('www.','').replace('search.','');
														api_update_stats( __acp.STATS_USE_RELATED );
														navigate( api_get_search_redirect_url(the_term+' site:'+ tari), __acp.search_target, enter_key );
													}	else	{										
														// use the original site's search results page					
														
														var thisLevel = input_element.parent();
														if (thisLevel.parent().get(0).tagName.toLowerCase() == 'form')	{
															thisLevel.parent().submit();
														}	else	{
															for (var level=0;level<10;level++)	{
																// DON'T DELETE THIS... decoy... levels are not really used here...
																try	{
																	if (thisLevel.get(0).tagName.toLowerCase() == 'form')	{	thisLevel.submit();	continue;	}
																}	catch(f)	{}
																var inputs = thisLevel.find('input[type=submit],input[type=default],input[type=button],input[type=image],button[type=submit],button[type=default],button[type=button],button[type=image]');	
																if (inputs.length>0)	{	inputs[0].click();	return;		}								            		
																var inputs  = thisLevel.find('a');	
																for (var i=0;i<inputs.length;i++)	{
																	var ht = getNodeHTML(inputs[i]);
																	if (ht.indexOf('srch')>=0 || ht.indexOf('search')>=0)	{	inputs[i].click();	return;	}
																}
																if (inputs == null)		{	break;	}

																thisLevel = thisLevel.parent();								            		
															}
														}
														
														input_element.focus();	
														//$jquery(event.target.form).submit();
														//input_element.closest("form").submit();	
													}	
													break;
											}	// end of switch											
	            							            		
							             },	// end of select:
							            										
							            open: function(event, ui) {		
											$jquery('#' + __acp.css_init_element_id).removeClass("ui-autocomplete-loading");
											
							            	$jquery("ul.ui-autocomplete").each(function(index) {	
							            		if ( $jquery(this).css('display') != 'none')	{													
													// Width...
													
													var inp_ele = $jquery('#' + __acp.css_init_element_id)
													var inp_wid = inp_ele.outerWidth();	
													var wid = inp_wid;
													var inp_left_offset = inp_ele.offset().left;
													
													/*
													// try with the <form> width...
													var form_width = null;													
													var my_form = inp_ele.closest('form');
													if (my_form	!= null && my_form.length != 0 && my_form.outerWidth() != null && my_form.outerWidth() < __acpParams.MAX_SUGGEST_WIDTH && my_form.offset().left != null)	{	
														var form_offset = my_form.offset().left;	
														var input_offset= inp_ele.offset().left;																
														form_width = my_form.outerWidth() - (input_offset-form_offset);																	
													}	

													if (form_width != null && form_width > wid)	{	wid = form_width;	}

													// Still very narrow width...
													var parent_element_width = null;
													
													if	( wid < __acpParams.MIN_SUGGEST_FORM_WIDTH )	{	
														// Go up the DOM to find the widest...
														var thisLevel = inp_ele.parent();
		
														for (var level=0;level<20 && thisLevel != null && thisLevel.length != 0;level++)	{	
															if (thisLevel.outerWidth() != null && thisLevel.outerWidth() < __acpParams.MAX_SUGGEST_WIDTH && thisLevel.offset().left != null)	{	
																var form_offset 	 = thisLevel.offset().left;	
																var input_offset	 = inp_ele.offset().left;																
																parent_element_width = thisLevel.outerWidth() - (input_offset-form_offset);
																
															}	
															thisLevel = thisLevel.parent();		
															if (thisLevel.prop("tagName").toLowerCase() == 'body')	{	break;	}
														}				
														if (parent_element_width != null)	{	wid = parent_element_width;	}														
													}
													if (wid < __acpParams.MIN_SUGGEST_WIDTH)	{	wid = __acpParams.MIN_SUGGEST_WIDTH;	}

													$jquery(this).outerWidth( wid );													
													
													
													*/
													//if (wid < __acpParams.MIN_SUGGEST_WIDTH)	{
													/* *** $jquery(this).outerWidth( __acpParams.MIN_SUGGEST_WIDTH ); 	*** */
													$jquery(this).outerWidth(  $jquery(this).outerWidth() - 2 );
													
													//}
													
													if ( false )	{ //more_space_on_the_left(wid, inp_left_offset) )	{
														$jquery(this).offset({left: $jquery(this).offset().left + inp_wid + 48 - __acpParams.MIN_SUGGEST_WIDTH});
													}
													
													
													
													
													
													
													// Separator if needed...
													if ( $jquery(".as_rel").length>0 && $jquery(".as_his,.as_popular_suggest,.as_magento_suggest,.as_search_suggest").length > 0 )	{
														$jquery(".as_rel:first").parent().parent().css('border-top', '1px solid #ccc');
													}
													
													// explanation text for first 
													var items = $jquery('.as_rel');
													if (items.length>0)	{
														items[0].innerHTML += ( '<span class="acp_desc acp_desc_rel"> - ' + escapeHTML(__acpParams.suggest_diff_text_rel) + '</span>' );
													}
													var items = $jquery('.as_search_suggest');
													if (items.length>0)	{
														items[0].innerHTML += ( '<span class="acp_desc"> - ' + escapeHTML(__acpParams.suggest_diff_text_site_search) + '</span>' );
													}
													/*
													var items = $jquery('.as_popular_suggest');
													if (items.length>0)	{
														items[0].innerHTML += ( '<span class="acp_desc acp_desc_pop"> - ' + escapeHTML(__acpParams.suggest_diff_text_pop) + '</span>' );
													}
													var items = $jquery('.as_his');
													if (items.length>0)	{
														items[0].innerHTML += ( '<span class="acp_desc acp_desc_his"> - ' + escapeHTML(__acpParams.suggest_diff_text_his) + '</span>' );
													}																													
													*/

													
													// Footer...													
													if (__LTR==false)	{
														__acpParams.footer_css = __acpParams.footer_css.replace('float:right', 'float:left');
													}
													
													/*
													if ($jquery('#acp_footer_acp').length == 0)	{
														$jquery(".ui-autocomplete").append("<li id='acp_footer_acp' style='" + __acpParams.footer_css + "'><a style='text-decoration:none;color:inherit' href='#' id='acp_footer_cfg_007' title='" + __acpParams.footer_tooltip +"'>" + __acpParams.footer_html +"</a></li>");
														$jquery("#acp_footer_cfg_007").click(open_configuration);	
													}
													*/
													
							            		}
											});							            					          							                							                
											
											// Adjust the Wix height according to the content											
											try	{
												/* *** Wix.resizeWindow(iframe_max_width, $jquery("ul.ui-autocomplete").outerHeight() + iframe_height, function(){}); *** */
											}	catch (e)	{
												// maybe we're in the Wix Modal view and resize wouldn't work!
											}
											
											
							            }	// end of open:							            
							        });	 //	end of ac_obj autocomplete			
																		
									// Attach _renderItem for every autocompelte component...									
									$jquery(__acp.input_id_0).autocomplete().data( "uiAutocomplete" )._renderItem = function( ul, item ) 		{	return dropdown_renderItem(ul, item);	}
									if (the_client_input_1 != null)	{	
										$jquery(__acp.input_id_1).autocomplete().data( "uiAutocomplete" )._renderItem = function( ul, item ) 	{	return dropdown_renderItem(ul, item);	}
									} 									
									
									// Attach a handler to get the [ENTER] on free text stuff
									attach_loopback_handler( element_0, the_client_form_0 );	
		     						if (the_client_input_1 != null)	{	attach_loopback_handler( element_1, the_client_form_1 );	}							
									
									// Mark the autocomplete property in a unique way (JQuery UI set it to "off")
								    the_client_input_0.setAttribute('autocomplete', __acp.ac_OfF);	 the_client_input_0.autocomplete = __acp.ac_OfF; 
									
									
								    if (the_client_input_1 !=null)  {	the_client_input_1.setAttribute('autocomplete', __acp.ac_OfF);	the_client_input_1.autocomplete = __acp.ac_OfF; }
									//if (the_client_form_0 != null)	{	the_client_form_0.setAttribute('autocomplete', __acp.ac_OfF);	}
									//if (the_client_form_1 != null)	{	the_client_form_1.setAttribute('autocomplete', __acp.ac_OfF);	}		
									
									function more_space_on_the_left(wid, inp_left_offset){
										var page_width = 0;
										var page_left  = 0;
										var inp_obj = $jquery('#acp_magento_search_id');
										var window_wid = $jquery(window).width();
										var parent = inp_obj.parent();
										var safety = 10;
										while (safety>0 && parent && parent.prop('tagName') && parent.prop('tagName').toLowerCase()!='body'){
											if (parent.width() < window_wid && parent.width() > page_width) {
												page_width = parent.width();
												page_left  = parent.offset().left;
											}
											parent = parent.parent();
											safety += 1;
										}
										
										return ( (page_width + page_left) < (wid + inp_left_offset) );											
									}
									

																		
							        function init_site_css(search_element) {										
										var uni_css_id = "as_css_style_x_007";
										$jquery('#'+uni_css_id).remove();

										// some rules to apply
										var back_color = search_element.css('background-color');
										if (back_color == 'transparent')	{	back_color = '#fdfdfd';	}
										var padding_left = search_element.css('padding-left').replace('px','');
										if (padding_left>16)	padding_left = ';';
											else				padding_left = ";padding-left: " + search_element.css('padding-left');
	
										LTR_stuff = ';';
										rtl_icon_display = ';';
										if (__LTR==false)	{
											LTR_stuff = ';text-align:right;direction: rtl;';
											rtl_icon_display = 'display:none';
										}
										
										var icon_suffix = 16;
										var icon_padding_left = '5px';
										var icon_position_y = 4;
										var font_size_css = search_element.css('font-size');
										var font_size = font_size_css.replace('px','');										
										var font_style = search_element.css('font-style');																				
										if (font_size<15)					{ icon_suffix = 12;	icon_padding_left = '18px';	icon_position_y=3;}
										if (font_size>22)					{ icon_suffix = 26;	icon_padding_left = '32px';  icon_position_y=8;}										
										var element_height = search_element.css('height').replace('px','');																			
										var font_weight = search_element.css('font-weight');
										icon_position_y = "50%";	//	icon_position_y + "px";
										
										var on_hover_css = "{ color: " + __acp.css_text_color_hover + "; background: " + __acp.css_background_old_browsers + "; background:-moz-linear-gradient(top, " + __acp.css_background_gradient_1 + " 0, " + __acp.css_background_gradient_2 + " 100%);background:-webkit-gradient(linear, 0 0, 0 100%, from(" + __acp.css_background_gradient_1 + "), to(" + __acp.css_background_gradient_2 + ")); background-image: linear-gradient(to bottom, " + __acp.css_background_gradient_1 + " 0%, " + __acp.css_background_gradient_2 + " 100%); -ms-filter:\"progid:DXImageTransform.Microsoft.gradient(startColorstr=#FF" + __acp.css_background_gradient_1.substr(1) + ",endColorstr=#FF" + __acp.css_background_gradient_2.substr(1) + ")\"; filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#FF" + __acp.css_background_gradient_1.substr(1) + ",endColorstr=#FF" + __acp.css_background_gradient_2.substr(1) + "); }";
										
										var rules = {
										   ".ui-draggable .ui-dialog-titlebar": "{border-radius:4px 4px 0 0;;font-size:	" + font_size_css + ";font-weight: normal;font-family:"	+search_element.css('font-family')+ "}",
										   
										   ".n_b_acp": 			"{ font-weight: normal; color: inherit; background-color:inherit; text-decoration:underline;  font-size:" + font_size_css + "}",
										   									   
   										   ".ui-autocomplete" : "{ max-height:none;overflow-y:hidden; position:absolute;background-image:none; cursor:default; z-index:99999 !important; background-color:#fff; /*border-radius:5px;*/ border: 1px solid #ccc; /*box-shadow: #666 0 0 10px;*/ padding-left:0 }",
										   ".ui-autocomplete .ui-menu-item": 		"{ color: #333; content:''; list-style-type: none; background-image:none; text-align: left; margin-left:0; margin-right:0; }",
										   
										   ".ui-autocomplete .ui-menu-item:hover":  on_hover_css,
					   
										   ".ui-autocomplete .ui-menu-item:before": "{content:''; }",							   										   
										   ".acp_category": "{color: #aaa; }",
										   ".as_icon": 			"{color: inherit; overflow-x:hidden;text-overflow: ellipsis;/*white-space:nowrap*/;/*background-position:3px "+icon_position_y+"*/; background-repeat: no-repeat;padding-left:"+icon_padding_left+" !important ; padding-top:6px;padding-bottom:6px;background-color:inherit; background-image: inherit;}",
										   ".as_icon_mobile": 	"{color: #666; overflow-x:hidden;text-overflow: ellipsis;/*white-space:nowrap*/;background-position:3px "+icon_position_y+"; background-repeat: no-repeat;padding-left:"+icon_padding_left+" !important ;padding-top:0;padding-bottom:0;line-height: 1.2em; white-space: nowrap;}",
										   
										   ".as_searchbox_focus_mobile": "{ position: absolute; left: 0; border-radius: 0; line-height: 1.2em; }",
										   
										   ".as_search_suggest": "{ /*background-image: url('http://wix.instantsearchplus.com/images/search_16.png');*/ background-color:inherit;}",
										   
										   ".as_popular_suggest": "{ /*background-image: url('http://wix.instantsearchplus.com/images/page_16.png'); */ background-color:inherit;}",
										   ".as_cart": "{ background-image: url('https://acp-mobile.appspot.com/images/cart_16.png'); }",
										   ".as_rel": "{ /*background-image: url('"+__acp.SERVER_URL+"/images/related_"+icon_suffix+".png');*/ }",
										   ".as_his": "{ /*background-image: url('http://wix.instantsearchplus.com/images/page_16.png');*/ }", 
										   //"{ background-image: url('"+__acp.SERVER_URL+"/images/history_"+icon_suffix+".png'); }",
										   ".as_amzn": "{ background-image: url('"+__acp.SERVER_URL+"/images/amazon_"+icon_suffix+".png'); }",										   
										   
										   ".acp_desc": 	"{color:#aaa;font-weight:lighter;text-decoration:none}",
										   
										   ".as_magento": "{ line-height:15px; padding-left:0 !important }",
										   ".as_magento_suggest": "{ /*margin-left: -13px*/ }",
										   ".as_magento_img": "{ float:left; border: 1px solid #eaeaea; background: url('https://acp-mobile.appspot.com/images/progress.gif') no-repeat center 50%;}",
		
		
	    ".as_img_container": "{float:left;display:inline-block;margin:0;padding:0;text-align:center; }",
	    ".as_img_container_popular_search": "{display:inline-block;margin:0;padding:0;text-align:center;border:0;vertical-align: text-bottom; margin-left:0px;margin-right:6px;width:18px;" + rtl_icon_display + " }",

	   
										   ".as_magento_product_section": "{padding-top:0px; padding-left:5px; text-align:left; text-overflow: ellipsis; vertical-align: middle;  overflow:hidden; /*white-space: nowrap;*/ "
														+  ";font-size:	" +font_size_css+  ";font-weight:"		+font_weight+	 ";font-family:"		+search_element.css('font-family')+ "}",
										   ".as_magento_product_section_mobile": "{padding-top:0px; text-align:left; text-overflow: ellipsis; vertical-align: middle;  overflow:hidden; white-space: nowrap; "
														+  ";font-size:	" +font_size_css+  ";font-weight: Normal;font-family:"		+search_element.css('font-family')+ "; }",
										   ".as_magento_product_name": "{color:inherit; text-decoration: none; 	/*overflow:hidden;text-overflow:ellipsis; white-space: nowrap*/}",
										   ".as_magento_product_desc": "{color:inherit; text-decoration: none; font-weight: normal;	overflow:hidden;text-overflow:ellipsis; white-space: nowrap}",								   
										   ".as_magento_price": "{font-weight:normal;}",
										   
										   ".ui-autocomplete .ui-menu-item #ui-active-menuitem": "{background-color:#eaf2f9; margin:0 !important; font-weight:"	+font_weight +"}",
										   ".ui-helper-hidden-accessible": "{display: none}",
										   
										   ".ui-autocomplete .ui-menu-item .ui-corner-all": "{/*color: #000 !important;*/ color: inherit; border-radius:0;margin:0 !important;border-width:0; background-image:none; text-align: left;"+
																							 ";padding-top: "		+search_element.css('padding-top')+
										   													 ";padding-bottom: "	+search_element.css('padding-bottom')+
																							 //padding_left +			// NOT a TYPO
																							 ";padding-left: 0" +
																							 LTR_stuff + 
										   													 // ";padding-right: "		+search_element.css('padding-right')+
										   													 ";font-size: 	"		+font_size_css+
										   													 ";text-transform:"		+search_element.css('text-transform')+
																							 ";text-decoration: none" +
 										   													 ";font-style:"			+font_style+								   													 																							 
																							 ";font-weight:"		+font_weight+
										   													 ";font-family:"		+search_element.css('font-family')+ "}",
										   
										   ".ui-autocomplete .ui-menu-item .ui-state-focus": on_hover_css
										   													 
										}
										// loop through and insert
										var css_stuff = '';
										for (selector in rules) {	css_stuff += (selector + rules[selector]);	}
										if (__LTR)	{
											css_stuff += ".ui-autocomplete-loading { background-image: none; /*url('https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/themes/base/images/ui-anim_basic_16x16.gif');*/ background-repeat: no-repeat; background-position: right center }";
										}	else	{
											css_stuff += ".ui-autocomplete-loading { background-image: none }";
										}
										api_add_css_style(uni_css_id, css_stuff);										
									}	// end of init_site_css	  
									
									break;
								default:	// Unknown yet...
									api_update_stats( __acp.STATS_SITE_NEW );									
									__acp.input_id_0 = '#' + __acp.input_id_0;
									var element_0 = $jquery(__acp.input_id_0);
									if (the_client_input_1 != null)	{
										__acp.input_id_1 = '#' + __acp.input_id_1;
										var element_1 = $jquery( __acp.input_id_1 );
									}
									
									attach_loopback_handler( element_0, the_client_form_0 );	
									if (the_client_input_1 != null)	{	attach_loopback_handler( element_1, the_client_form_1 );	}
									return;							     						
								}	//	END of main SWITCH		     					
								

//     					} // end of /load success...
//			)	; // end of appAPI.request
	

	initLocalHistory();	
		
	function dropdown_renderItem(ul, item)	{
			// <li class="ui-menu-item" role="menuitem">
			//		<a class="ui-corner-all" tabindex="-1">
			//			<div title="bill clinton s birth certificate - Search the web" class="as_rel as_icon">bill clinton s birth certificate</div>
			//		</a>
			// </li>
			var line_term = item.label;
			var line_term_tooltip = line_term.replace('&', '&amp;');
			var line_class = '', icon_class = 'as_icon_mobile', line_tooltip;
			if (!is_mobile)	{
				icon_class = 'as_icon';
			}
			var curr_query = $jquery('#' + __acp.css_init_element_id).val().toLowerCase();	
			switch (item.type)	{
				case __acp.RELATED_SUGGESTION:	line_class = 'as_rel'; 		line_tooltip = line_term_tooltip + __acpParams.related_suggest_tooltip; 	break;
				case __acp.HISTORY_SUGGESTION:	line_class = 'as_his'; 		line_tooltip = line_term_tooltip + __acpParams.history_suggest_tooltip;		break;
				case __acp.AMAZON_SUGGESTION:	line_class = 'as_amzn'; 	line_tooltip = line_term_tooltip + __acpParams.amazon_suggest_tooltip;		break;												
				case __acp.MAGENTO_SUGGESTION:	
					if (is_mobile)	{	
						line_class = 'as_cart'; 
					}	else	{	
						line_class = 'as_magento_suggest'; 		
					}
					line_tooltip = line_term_tooltip + __acpParams.product_suggest_tooltip;					
					break;												
				default:											
					if (item.id == __acp.NO_RESULTS_FOUND_ID && item.label.toLowerCase().indexOf(curr_query) >= 0)	{						
						line_class = 'as_search_suggest'; 		
						line_tooltip = line_term_tooltip + __acpParams.search_suggest_tooltip;		
					}	else	{
						line_class = 'as_popular_suggest'; 		
						line_tooltip = line_term_tooltip + __acpParams.popular_suggest_tooltip;		
					}
					break;							
			}
									  
			var line_term_highlight = highlight_term(curr_query, line_term, 'n_b_acp');
			if (item.category && item.category != __acp.INSTALL_CATEGORY)	{
				var real_category = item.category;
				
				if (item.product_url && api_is_current_wix_page( item.product_url ))	{
					real_category = '<b>This Page</b>';
				}
	
				if (line_term.toLowerCase() != $jquery.trim(real_category.toLowerCase())) {
					line_term_highlight += ' <span class="acp_category">in ' + real_category + '</span>';
				}
			}
			
			if (item.alias && line_term.toLowerCase() != item.alias.toLowerCase())	{
				line_term_highlight = capitaliseFirstLetter( highlight_term(curr_query, item.alias, 'n_b_acp') );
				line_term_highlight += ' <span class="acp_category">as in ' + line_term + '</span>';
			}
			
			if (item.type == __acp.MAGENTO_SUGGESTION)	{			
				line_term_highlight = get_magento_product_html(curr_query, item);										
			}	else	{
				// line_class = '';
				
				var img_pop_line = _isp_endpoint + '/images/page_16.png';
				if (line_class == 'as_rel')		{ img_pop_line = _isp_endpoint + '/images/related_16.png';	}	
				if (line_class == 'as_search_suggest')	{ img_pop_line = _isp_endpoint + '/images/search_16.png';	}
				
				line_term_highlight = '<span class="as_img_container_popular_search"><img style="vertical-align:middle;border:0" src="' + img_pop_line + '"></span>' + line_term_highlight;				
			}
			
			var target_href = '_top';
			if (isp_obj && isp_obj['resultOpenInTab'] && isp_obj['resultOpenInTab'] === true)	{
				target_href = '_blank';
			}
				
			var href_part = " href=\"#\" ";
			if (item.product_url && __is_valid_thumb(item.product_url))	{
				var p_url = item.product_url.replace('_escaped_fragment_=', '#!');
				if (p_url.indexOf('zoom;http')==0)	{
					p_url = p_url.replace('zoom;http', 'http');	//	 wrong indexing with a zoom prefix 
				}
				href_part = " target=\"" + target_href + "\" href=\"" + p_url + "\" ";
			}
			// no need for a tooltip anymore: title=\"" + line_tooltip + "\""
			return $jquery( "<li></li>" )
				.data( "item.autocomplete", item )
				.append( "<a " + href_part + ">" + "<div class=\""+ line_class  +"  " + icon_class + " \">" + line_term_highlight + "</div>" + "</a>" )
				.appendTo( ul );				// 									
	}
	
	function euro_pricing(number)	{
		var numberStr = parseFloat(number).toFixed(2).toString();
		var numFormatDec = numberStr.slice(-2); /*decimal 00*/
		numberStr = numberStr.substring(0, numberStr.length-3); /*cut last 3 strings*/
		var numFormat = new Array;
		while (numberStr.length > 3) {
			numFormat.unshift(numberStr.slice(-3));
			numberStr = numberStr.substring(0, numberStr.length-3);
		}
		numFormat.unshift(numberStr);
		return numFormat.join('.')+','+numFormatDec; /*format 000.000.000,00 */
	}
	
	function get_magento_product_html(curr_query, item)	{
		try {
			var price = acp_options.PRICE_TAX ? (item.price * acp_options.PRICE_TAX).toFixed(2) : item.price;
		} catch (e)	{
			var price = item.price;
		}
		
		try	{
			var currency_symbol = acp_options.PRICE_CURRENCY_CODE ? acp_options.PRICE_CURRENCY_CODE : item.currency;
			switch ( currency_symbol )	{
				case 'USD': price = '$'  + price; 		break;
				case 'AUD': price = 'AU$'  + price;		break;
				case 'NZD': price = '$'  + price; 		break;
				case 'CAD': price = 'CA$'  + price;		break;
				case 'SGD': price = 'S$'  + price; 		break;
				case 'MXN': price = '$'  + price; 		break;
				case 'GBP': price = '£'  + price; 		break;				
				case 'EGP': price = 'EG£'  + price; 	break;				
				case 'BRL': price = 'R$' + euro_pricing(price); 		break;
				case 'ILS': price = '₪'  + price; 		break;
				case 'PLN': price = 'zł' + price; 		break;
				case 'DKK': price = 'kr ' + price; 		break;
				case 'NOK': price = 'kr ' + price; 		break;
				case 'HUF': price = price + ' Ft'; 		break;
				case 'SEK': price = 'Kr ' + price; 		break;
				case 'HKD': price = 'HK$'+ price; 		break;
				case 'ZAR': price = 'R'  + price; 		break;
				case 'CHF': price = 'CHF'+ price; 		break;
				case 'BGN': price = euro_pricing(price)  + ' лв.'; 		break;
				case 'HRK': price = 'kn' + price; 		break;
				case 'INR': price = 'Rs. ' + price;		break;

				case 'EUR': price = euro_pricing(price) + ' €' ; 		break;				
				case 'RON': price = euro_pricing(price) + ' lei' ; 		break;				
				
				case 'UAH': price = price + ' грн.'; 	break;
				case 'RUB': price = price + ' к.'; 		break;
				case 'TRY': price = price + 'Kr'; 		break;		
				
				default: break;
			}
		}	catch(e)	{}
		
		var logo_width 	= acp_options.THUMBNAIL_WIDTH ? acp_options.THUMBNAIL_WIDTH : 50;
		var logo_height = acp_options.THUMBNAIL_HEIGHT ? acp_options.THUMBNAIL_HEIGHT : 50;
		var product_css = "as_magento_product_section";
		var ret			= '';
		if (is_mobile)	{	
			logo_width  = acp_options.THUMBNAIL_MOBILE_WIDTH ? acp_options.THUMBNAIL_MOBILE_WIDTH : 30;	
			logo_height = acp_options.THUMBNAIL_MOBILE_HEIGHT ? acp_options.THUMBNAIL_MOBILE_HEIGHT : 30;	
			product_css = "as_magento_product_section_mobile";
		}	else	{
			if (item.thumbs_url && item.thumbs_url != '' && 
			    item.thumbs_url.indexOf('images/missing.jpg') == -1 && 
				__is_valid_thumb(item.thumbs_url))	{
				ret =  '<img class="as_magento_img" src="' + item.thumbs_url + '" width="' + logo_width + '" height="' + logo_height + '">';
			}	else	{
				ret =  '<div style="width: '+ logo_width + 'px; height: ' + logo_height + 'px; float: left; background: url(\'https://acp-mobile.appspot.com/images/cart_16.png\') no-repeat scroll center center rgb(255, 255, 255); border: 1px solid rgb(238, 238, 238);"></div>';			
			}
		}
		
		ret += '<div class="' + product_css + '">';
		
		if (item.featured > 0 && !is_mobile) 	{
			var sale_img = acp_options.SALE_IMG ? acp_options.SALE_IMG : 'http://acp-mobile.appspot.com/images/for_sale.png';	
			ret += '<img src="' + sale_img + '" style="width:42px;float:right">';
		}
				   
		ret += '<div class="as_magento_product_name">' + item.label + '</div>';
		var show_desc = acp_options.SHOW_DESC ? acp_options.SHOW_DESC : false;
		if (show_desc)	{
			ret += '<div class="as_magento_product_desc">' + item.desc + '</div>';		
		}
		
		var show_price = acp_options.SHOW_PRICE ? acp_options.SHOW_PRICE : true;
		var show_price_zero = acp_options.SHOW_PRICE_ZERO ? acp_options.SHOW_PRICE_ZERO : false;
		
		if (show_price && (show_price_zero || parseFloat(item.price)>0))	{
			if (is_mobile)	{
				ret += ' <span class="as_magento_price">' + price + '</span>';	
			}	else	{			
				ret += '<div class="as_magento_price">' + price + '</div>';		
			}
		}
		ret += '</div>';
		
		return ret;
	}

	function edit_distance(a, b)	{ 
		// the 2 strings to compare
		  var c,d,e,f,g;
		  for(d=[e=0];a[e];e++) // loop through a and reset the 1st distance
			for(c=[f=0];b[++f];) // loop through b and reset the 1st col of the next row
			  g=
			  d[f]=
				e? // not the first row ?
				1+Math.min( // then compute the cost of each change
				  d[--f],
				  c[f]-(a[e-1]==b[f]),
				  c[++f]=d[f] // and copy the previous row of the distance matrix
				)
				: // otherwise
				f; // init the very first row of the distance matrix
		  return g;
	}

	function get_word_distance(curr_query_word, line_term_word)	{
		var i = line_term_word.indexOf(curr_query_word);				
		return i;						
		var line_term_word_prefix = line_term_word.substring(0, curr_query_word.length);
		if (curr_query_word == line_term_word_prefix)	{	return 0;	}
		return 1;
		var dist = edit_distance(curr_query_word, line_term_word_prefix);
		if ( (dist == 3 && curr_query_word.length<20) || (dist == 2 && curr_query_word.length<18) || (dist == 1 && curr_query_word.length<16)	)	{
			dist = 10;
		}
		return dist;
	}
	
	function highlight_term(curr_query, line_term, css_class)	{
		if (curr_query.length < 3)	{	return line_term;	}
		// Try to match the entire curr_query first...
		if ( curr_query.substring(cur_len-1, cur_len) ==' ')	{	curr_query = curr_query.substring(0,cur_len-1);	}
		if (line_term.toLowerCase().indexOf(curr_query) >=0 )	{
			try	{
				var regex = new RegExp( '(' + curr_query + ')', 'gi' );			
				return line_term.replace( regex, "<span class='" + css_class + "'>$1</span>" );							
			}	catch (e)	{
				// Regexp mess with some weird characters
				return line_term;
			}
		}	
				
		var words=curr_query.split(' ');		
		for (var w=0;w < words.length;w++)	{
			curr_query = words[w];
			if 	(curr_query.length < 2)	{	continue;	}			
			var cur_len =  curr_query.length;
			if ( curr_query.substring(cur_len-1, cur_len) ==' ')	{	curr_query = curr_query.substring(0,cur_len-1);	}
			if (line_term.toLowerCase().indexOf(curr_query) >=0 )	{
				var regex = new RegExp( '(' + curr_query + ')', 'gi' );
				return line_term.replace( regex, "<span class='" + css_class + "'>$1</span>" );											
			}	
		}
		return line_term;
				
		var curr_query_words 	= curr_query.split(' ');
		var line_term_words 	= line_term.split(' ');
		var curr_query_words_len= curr_query_words.length;
		var line_term_words_len = line_term_words.length;
		var highlight_words_index = new Array();
		var this_dist = 10;
		var min_dist  = 10;

		for (var j=0;j<line_term_words_len;j++)	{										
			if (line_term_words[j].length<1)	{	continue;	}
			// go on every word in the suggestion and see if there's anything close to it...											
			for (var i=0;i<curr_query_words_len;i++)	{											
				if ( curr_query_words[i].length <=1 )	{	continue;	}
				this_dist = get_word_distance( curr_query_words[i], line_term_words[j] );
				if (this_dist == 0)	{	
					line_term = line_term.replace(line_term_words[j],'<span class="' + css_class + '">'+line_term_words[j]+'</span>');
					break;
				}
			}
		}
		return line_term;
												
		var out_line_term = '';
		for (var k=0;k<line_term_words_len;k++)	{
			if (highlight_words_index[k]==min_dist)	{	out_line_term += '<span class="' + css_class + '">' + line_term_words[k] + '</span> ';	}
				else	{	out_line_term += line_term_words[k] + ' '; }										
		}
		return out_line_term;
	}	
	
	function get_amazon_redirect_url(query)	{
		return ( __acp.ACP_AMAZON_SEARCH_URL.replace('{searchTerms}', encodeURIComponent(query)) );
	}

	

	function getFollowups(prefix, max_results)			{
		var ret_list = new Array();
		
		// Nov. 21 2012 - just return the search engine referrer if found
		if (__acp.previous_search_type == 1 && __acp.previous_search != null && __acp.previous_search.indexOf(prefix)==0)	{
			var newObj = new Object();
			newObj.label = __acp.previous_search.replace('+', ' ');
			newObj.count = 1;
			newObj.type  = __acp.POP_SUGGESTION;
			ret_list.push( newObj );			
		}	
		return	ret_list;			
		
		
		
		
		
		if (__acp.previous_search_followups == null)	{	return	ret_list;	}
		var prefix = prefix.toLowerCase();
		if (prefix == __acp.previous_search)	{
			// the site search results page is the previous search...
			prefix = '';
		}

		
		var match_loc = -1;
		var cur_term = '';
		for (var i=0;i<__acp.previous_search_followups.length;i++)	{
			cur_term  = __acp.previous_search_followups[i];

			match_loc = cur_term.indexOf(prefix);
			if ( match_loc==0 || (prefix.length > 2 && match_loc>2 && cur_term[match_loc-1]==" ") )	{
				
				var newObj = new Object();
				newObj.label = __acp.previous_search_followups[i];
				newObj.count = 1;
				newObj.type  = __acp.POP_SUGGESTION;
				ret_list.push( newObj );
			}	
		}
		if (ret_list.length == 0)	{	return ret_list;	}
		ret_list = ret_list.slice(0, max_results);
		return ret_list;		
	}
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Local user history stuff...
	function getSiteUserHistory_wix(prefix, max_results)	{
		// product history
		var ret_list_products = new Array();
		if (__acp.current_site_user_history_product != null && max_results>=1)	{	//	$jquery.trim(prefix) != '' && 
			var cur_seconds = new Date().getTime() / 1000;	// since 1970...
			var prefix = prefix.toLowerCase();			
			var changed_history = false;
			var match_loc = -1;
			var cur_term = '';
			//alert ( __acp.current_site_user_history_product.length );
			
			for (var i=0;i<__acp.current_site_user_history_product.length;i++)	{
				if (__acp.current_site_user_history_product[i].item == null || cur_seconds - __acp.current_site_user_history_product[i].time > __acp.MAX_LOCAL_OLD_HISTORY_SEC)	{
					// See if this is an old one we should get rid of....
					delete (__acp.current_site_user_history_product[i]);
					changed_history = true;
					continue;
				}
				
				cur_term  = __acp.current_site_user_history_product[i].item.label.toLowerCase();
				// __acp_log(cur_term);
				match_loc = cur_term.indexOf(prefix);
				if ( match_loc==0 || (prefix.length > 2 && match_loc>2 && cur_term[match_loc-1]==" ") )	{
					var newObj 			= __acp.current_site_user_history_product[i].item;
					newObj.type  		= __acp.HISTORY_SUGGESTION;
					if (newObj.id == __acp.NO_RESULTS_FOUND_ID || newObj.id == __acp.MOCK_RESULTS_ID)	{	
						// Special id for 'no results found'
						continue;
					}
					ret_list_products.push( newObj );
				}	
			}
			if (ret_list_products.length > 0)	{	
				// Rank by term popularity...
				ret_list_products.sort(function(a, b){
					 return b.count-a.count;
				})

				// return just the top results...		
				ret_list_products = ret_list_products.slice(0, max_results);

				if (changed_history)	{
					saveLocalMemoryToDB_product();
				}		
			}
		}
		return ret_list_products;
	}
	
	function getSiteUserHistory(prefix, max_results)	{	
		var ret_list = new Array();
		if ( __acp.current_site_user_history != null && max_results>=1 )	{	
			var cur_seconds = new Date().getTime() / 1000;	// since 1970...
			var prefix = prefix.toLowerCase();
			
			var changed_history = false;
			var match_loc = -1;
			var cur_term = '';
			for (var i=0;i<__acp.current_site_user_history.length;i++)	{
				if (__acp.current_site_user_history[i].term == null || (cur_seconds - __acp.current_site_user_history[i].time) > __acp.MAX_LOCAL_OLD_HISTORY_SEC)	{
					// See if this is an old one we should get rid of....
					delete (__acp.current_site_user_history[i]);
					changed_history = true;
					continue;
				}
				cur_term  = __acp.current_site_user_history[i].term.toLowerCase();

				match_loc = cur_term.indexOf(prefix);
				if ( match_loc==0 || (prefix.length > 2 && match_loc>2 && cur_term[match_loc-1]==" ") )	{
					var newObj = new Object();
					newObj.label = __acp.current_site_user_history[i].term;
					newObj.count = __acp.current_site_user_history[i].count;
					newObj.type  = __acp.HISTORY_SUGGESTION;
					ret_list.push( newObj );
				}	
			}
			if (ret_list.length == 0)	{	return ret_list;	}
			// Rank by term popularity...
			ret_list.sort(function(a, b){
				 return b.count-a.count;
			})

			// return just the top results...		
			ret_list = ret_list.slice(0, max_results);

			if (changed_history)	{
				saveLocalMemoryToDB();
			}
		}
		
		return ret_list;	
	}
	
	function getTopSiteSearches(max_results)	{
		var ret_list = new Array();

		if (__acp.top_host_searches == null || __acp.top_host_searches.length == 0 || max_results<1)	{	return	ret_list;	}
// unsafeWindow.console.log(__acp.top_host_searches );																																											
		
		for (var i=0;i<max_results && i<__acp.top_host_searches.length;i++)	{
			var newObj = new Object();
			newObj.label = __acp.top_host_searches[i];
			newObj.count = 1;
			if (i>=(max_results-2))	{	// two last ones are related
				newObj.type  = __acp.RELATED_SUGGESTION;
			}	else	{
				newObj.type  = __acp.POP_SUGGESTION;
			}
			ret_list.push( newObj );
		}
		if (ret_list.length == 0)	{	return null;	}
		
		return ret_list;			
	}
		
	function addToLocalHistory_wix( item )	{		
		if (item.id != __acp.NO_RESULTS_FOUND_ID && item.id != __acp.MOCK_RESULTS_ID)	{
			// Special id reserved for no results found
			api_db_set( __acp.LOCAL_COOKIE_PREFIX_TEMP_WIX + this_host, api_json_stringify( item ), false );	
		}
		latestToStore();		
	}	
	
	function addToLocalHistory(my_term)	{
		__acp_log('addToLocalHistory: ' + my_term);
		api_db_set( __acp.LOCAL_COOKIE_PREFIX_TEMP + this_host, my_term.toLowerCase(), false );	
		latestToStore();
	}	
	
	function latestToStore()	{		
		var latest_sub = api_db_get( __acp.LOCAL_COOKIE_PREFIX_TEMP+ this_host, false );	
		if (latest_sub != null && latest_sub != "")	{	
			__acp_log('latestToStore: ' + latest_sub);		
			// clear the cookie...
			api_db_remove( __acp.LOCAL_COOKIE_PREFIX_TEMP + this_host, false );			
			// remove prefix/suffix spaces...
			var my_term = $jquery.trim(latest_sub);
			
			var cur_seconds = new Date().getTime() / 1000;	// since 1970...			
			var found_it = false;			
			for (var i=0;i<__acp.current_site_user_history.length;i++)	{
				var item = __acp.current_site_user_history[i];
				if (item.term == null)	{	continue;	}			
				if (item.term.toLowerCase() == my_term.toLowerCase())	{
					item.count +=1;
					item.time = cur_seconds;
					found_it = true;					
					break;
				}
			}
			if (!found_it)	{
				var newObj 		= new Object();
				newObj.time 	= parseInt(cur_seconds,10);
				newObj.term 	= my_term;
				newObj.count 	= 1;
				__acp.current_site_user_history.unshift(newObj);
			}
	
			saveLocalMemoryToDB();	
		}

		// PRODUCT HISTORY
		var latest_sub = api_db_get( __acp.LOCAL_COOKIE_PREFIX_TEMP_WIX + this_host, false );	
		if (latest_sub != null && latest_sub != "")	{	
			__acp_log('latestToStore: ' + latest_sub);		
			// clear the cookie...
			api_db_remove( __acp.LOCAL_COOKIE_PREFIX_TEMP_WIX + this_host, false );			
			// remove prefix/suffix spaces...
			var my_item = api_json_parse(latest_sub);
			
			var cur_seconds = new Date().getTime() / 1000;	// since 1970...			
			var found_it = false;			
			for (var i=0;i<__acp.current_site_user_history_product.length;i++)	{
				var cur_item = __acp.current_site_user_history_product[i];
				if (cur_item.item.id == null)	{	continue;	}			
				if (cur_item.item.id == my_item.id)	{
					cur_item.count +=1;
					cur_item.time = cur_seconds;
					found_it = true;					
					break;
				}
			}

			if (!found_it)	{
				var newObj 		= new Object();
				newObj.time 	= parseInt(cur_seconds,10);
				newObj.item 	= my_item;
				newObj.count 	= 1;
				__acp.current_site_user_history_product.unshift(newObj);
			}
	
			saveLocalMemoryToDB_product();	
		}		
		
	}

	function navigate(src, target, enter_key)	{
		$jquery(__acp.input_id_0).blur();						
		
		switch (target)	{
			case 'popup':
				$jquery("#acp_popup_id").dialog("open");
				$jquery("#modal_acp_popup_id").attr("src",src);							
				break;
			default:
				api_openURL( src, target, enter_key );
				break;
		}
	}
	
	var QS_list = null;

	function getUrlVars(href, param) {
		var hash;
		var hashes = href.slice(href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			if (hash[0]==param)    {
				return unescape(decodeURIComponent(hash[1]));
			}            
		}
		return null;
	}
		
		
	function get_QS( qs )    {
		try	{
			if (QS_list == null)	{
				QS_list  = [
							[".naver.", "query",0], [".comcast.", "q",0], [".baidu.", "wd",0], [".yandex.", "text",0], [".aol.", "q",0], [".ask.", "q",0], [".yahoo.", "p",0],
							[".msn.", "q",0], [".bing.", "q",0], [".google.", "q",0], ["x2t.com", "q",0], ["www.cuil.pt", "q",0], ["alnaddy.com", "q",0],
							[".search-results.", "q",1], [".iminent.com", "q",1], [".sweetim.com", "q",1], ["search.zonealarm.com", "q",1], ["search.softonic.com", "q",1],
							[".icq.com", "q",1], ["search.avg.com", "q",1], [".foxtab.com", "q",1], [".searchya.com", "q",1], ["search.conduit.com", "q",1],
							["searchitapp.com", "q",0], [".smilebox.com", "q",1], [".incredibar.com", "q",1], [".allmypics.com", "q",1], [".incredimail.com", "q",1],
							["go.linkury.com", "q",1], [".whitesmoke.com", "q",1], ["search.babylon.com", "q",1], [".mywebsearch.com", "searchfor",1]
							];
			}
			
			if (qs == null || qs == '')    {    return;        }
			var ACP_PREV_S = 'ACP_PREV_S';
			var ACP_PREV_T = 'ACP_PREV_T';
			var rel_search_sec_delta = 60*5;
			
			for (var i=0;i<QS_list.length;i++)    {
				if (qs.indexOf(QS_list[i][0])>=0)    {
					var val = $jquery.trim( getUrlVars(qs, QS_list[i][1]) );
					
					if (val != null && val.length > 3)    {
						__acp_log( val );
						server_loopback((val), false, 2, null);
						__acp.previous_search 		= val;
						__acp.previous_search_type	= 1;
						
						var prev_s 		= api_db_get(ACP_PREV_S, false);
						var prev_t 		= api_db_get(ACP_PREV_T, false);
						var cur_seconds	= parseInt( new Date().getTime() / 1000, 10);	// since 1970...		
						if ( typeof prev_s 		!= 'undefined' && prev_s != null && prev_s != '' && prev_s != val 
							 && typeof prev_t 	!= 'undefined' && prev_t != null && prev_t != ''
							 && (cur_seconds - parseInt(prev_t, 10)) < rel_search_sec_delta )	{
									__acp_log( prev_s + ' ' + prev_t ); 			
									
									api_ajax_request_get(__acp.AJAX_PREV,
										__acp.AC_GLOBAL_URL + "/fw?p=" + encodeURIComponent(prev_s) + "&q=" + encodeURIComponent(val) + "&v=" + __acp.CLIENT_VER,
										null);
										
						}						
						
						api_db_set(ACP_PREV_S, val, false);						
						api_db_set(ACP_PREV_T, cur_seconds.toString(), false);
						
						return QS_list[i][2];
					}                
					return 0;
				}
			}    
		}	catch(e)	{
			__acp_log('get_QS exception...');	
		}
	}







	
	function initializePopup(width, height)	{
		var ht = '<div id="acp_popup_id" title="Search the web"><iframe id="modal_acp_popup_id" width="100%" height="100%" marginWidth="0" marginHeight="0" frameBorder="0"  scrolling="auto" style="overflow-x:hidden;" title="Search the web"><h1>THINGS</h1></iframe></div>';
		$jquery('body').append(ht);	
		try	{
			$jquery("#acp_popup_id").dialog({
				   autoOpen: 	false,
				   modal: 		false,
				   resizable: 	false,	           
				   width: 		width,
				   height: 		height
			});
			$jquery('#element').dialog({zIndex: 9999999});
		}	catch (e){}				
	}
	
	// Target profile
	
	function calc_target_profile()	{		
		var partner_r = 2;
		if (__acpParams.PARTNER_ID.indexOf('conduit')>=0)	{ partner_r = -10;	}
		if (__acpParams.PARTNER_ID.indexOf('babylon')>=0 || __acpParams.PARTNER_ID.indexOf('softonic')>=0)	{	partner_r = 0;	}
		var browser_r = 1;
		if ( ($jquery.browser.webkit && !!window.chrome) ||
			 ($jquery.browser.msie   && parseInt($jquery.browser.version, 10)>=9)	||
			 ($jquery.browser.mozilla&& parseInt($jquery.browser.version, 10)>=15) )	{ 
				browser_r = 2; 
		}	
		if	( ($jquery.browser.msie   && parseInt($jquery.browser.version, 10)<=7)	||
			  ($jquery.browser.mozilla&& parseInt($jquery.browser.version, 10)<=9) )	{
				browser_r = 0;
		}		
		
		var days = 0;
		try	{	days = api_get_days_since_install(); } catch(e) {}
		
		if (days==0)	{
			__acp.profile_type = Math.round( 0.45*partner_r + 0.55*browser_r );
		}	else	{
			var days_r = 1;
			if (partner_r == 0)	{
				if ( days > 14 )	{	days_r = 0;	}
				if ( days < 3 )	{	days_r = 2;	}
			}
		
			var search_clone_r = 1;
			var search_clone_cnt_monthly = 30 * api_get_search_clone_cnt() / days;
			if (search_clone_cnt_monthly > 5)	{	search_clone_r = 0;	}
			if (search_clone_cnt_monthly <= 3)	{	search_clone_r = 2;	}

			var search_box_r = 1;
			var search_box_cnt_monthly = 30 * api_get_search_box_cnt() / days;
			if (search_box_cnt_monthly > 100)	{	search_box_r = 2;	}
			if (search_box_cnt_monthly < 10)	{	search_box_r = 0;	}
			
			__acp.profile_type = Math.round( 0.35*partner_r + 0.20*browser_r + 0.05*days_r + 0.25*search_clone_r + 0.15*search_box_r );			
			__acp_log( 'p: ' + partner_r + ' | b: ' + browser_r + ' | d: ' + days + ' / ' + days_r + ' | c: ' + search_clone_cnt_monthly + ' / ' + search_clone_r + ' | s: ' + search_box_cnt_monthly + ' / ' + search_box_r);
		}
		if ( __acp.profile_type < 0)	{
			__acp.profile_type = 0;
		}	
		if ( __acp.profile_type > 2)	{
			__acp.profile_type = 2;
		}			
		
	}
	
	
	
	function initLocalHistory()	{
		if (__acp.current_site_user_history == null)	{
			// read from local DB into __acp.current_site_user_history
			__acp.current_site_user_history = new Array();
			var db_store = api_db_get(__acp.LOCAL_COOKIE_PREFIX + this_host, false);
			if (db_store != null)	{	
				__acp_log('initLocalHistory: ' + db_store);			
				__acp.current_site_user_history = api_json_parse( db_store );
				if (__acp.current_site_user_history == null)	{	__acp.current_site_user_history = new Array();	alert('cookie json error');	}
			}
		}
		
		// Product History
		if (__acp.current_site_user_history_product == null)	{
			// read from local DB into __acp.current_site_user_history
			__acp.current_site_user_history_product = new Array();
			var db_store = api_db_get(__acp.LOCAL_COOKIE_PREFIX_WIX + this_host, false);
			if (db_store != null)	{	
				__acp_log('initLocalHistory: ' + db_store);			
				__acp.current_site_user_history_product = api_json_parse( db_store );
				if (__acp.current_site_user_history_product == null)	{	__acp.current_site_user_history_product = new Array();	alert('cookie json error');	}
			}
		}
		
		// previous_search if within the last few minutes
		var cur_seconds = new Date().getTime() / 1000;	
		if (__acp.current_site_user_history != null 	&& 
			__acp.current_site_user_history.length > 0 	&& 
			cur_seconds - __acp.current_site_user_history[0].time < __acp.MAX_PREVIOUS_SEARCH_TIMEOUT_SEC)	{
			__acp.previous_search 		= __acp.current_site_user_history[0].term;
			__acp.previous_search_type 	= 0;
		}
	}
	
	function saveLocalMemoryToDB()	{
		var db_store = __acp.current_site_user_history.slice(0, __acp.MAX_POPULAR_SEARCHES_HISTORY);
		db_store = api_json_stringify( db_store );		
		__acp_log('saveLocalMemoryToDB: ' + db_store);
		api_db_set(  __acp.LOCAL_COOKIE_PREFIX + this_host, db_store, false);	
	}
	function saveLocalMemoryToDB_product()	{
		var db_store = __acp.current_site_user_history_product.slice(0, __acp.MAX_POPULAR_PRODUCTS_HISTORY);
		db_store = api_json_stringify( db_store );		
		__acp_log('saveLocalMemoryToDB_product: ' + db_store);
		api_db_set(  __acp.LOCAL_COOKIE_PREFIX_WIX + this_host, db_store, false);	
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// LZW-compress a string
	function lzw_encode(s) {
		var dict = {};
		var data = (s + "").split("");
		var out = [];
		var currChar;
		var phrase = data[0];
		var code = 256;
		for (var i=1; i<data.length; i++) {
			currChar=data[i];
			if (dict[phrase + currChar] != null) {
				phrase += currChar;
			}
			else {
				out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
				dict[phrase + currChar] = code;
				code++;
				phrase=currChar;
			}
		}
		out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
		for (var i=0; i<out.length; i++) {
			out[i] = String.fromCharCode(out[i]);
		}
		return out.join("");
	}

	// Decompress an LZW-encoded string
	function lzw_decode(s) {
		var dict = {};
		var data = (s + "").split("");
		var currChar = data[0];
		var oldPhrase = currChar;
		var out = [currChar];
		var code = 256;
		var phrase;
		for (var i=1; i<data.length; i++) {
			var currCode = data[i].charCodeAt(0);
			if (currCode < 256) {
				phrase = data[i];
			}
			else {
			   phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
			}
			out.push(phrase);
			currChar = phrase.charAt(0);
			dict[code] = oldPhrase + currChar;
			code++;
			oldPhrase = phrase;
		}
		return out.join("");
	}


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Utilities to verify form stuff...
	function attach_loopback_handler(input_dom, form_dom)	{	
		// catch [ENTER] keystrokes - good where there are no <form> elements - e.g. www.socwall.com
		input_dom.keypress(function(event) {		
			if ( event.which == 13 ) {
				if (__acp.focused_item_type == null)	{	
					// User free text search typing...
					api_update_stats( __acp.STATS_USE_TYPED );
					server_loopback( null, false, input_dom.val() );	// send to server + record for user history
					try	{						
						// Close the suggestions in case it's an ajax page like search.iminent.com
						$jquery(__acp.input_id_0).autocomplete("close");						
						if (the_client_input_1 != null && __acp.input_id_1 == '')	{ $jquery(__acp.input_id_1).autocomplete("close");	}
					}	catch (e)	{}
				}	else	{
					event.preventDefault();
					event.stopImmediatePropagation();		
					return false;					
				}
				
				if (__acp.ac_OfF == __acp.OFF_AC)	{ wrap.innerHTML.toLowerCase();	}            	
			}
		});	
	}	
		
	function server_loopback(item, add_to_local, user_search_term)	{        				
		if (item == null)	{
			// User pushing ENTER without a suggest itme chosen!
			api_submit_loopback('', 0, this_host, 'f', __acp.previous_search, __acp.previous_search_type, __acp.ab_test, __acp.ab_test_source, user_search_term);	
		}	else	{		
			switch (item.type)	{				
				case __acp.WIX_SUGGESTION:
				case __acp.HISTORY_SUGGESTION:
					if (add_to_local)	{	addToLocalHistory_wix( item );	}
					api_submit_loopback(item.id, 	item.sug_pos, this_host, item.type, __acp.previous_search, __acp.previous_search_type, __acp.ab_test, __acp.ab_test_source, user_search_term);	
					break;
				case __acp.RELATED_SUGGESTION:
					api_submit_loopback(item.label, item.sug_pos, this_host, item.type, __acp.previous_search, __acp.previous_search_type, __acp.ab_test, __acp.ab_test_source, user_search_term);	
					break;
				default:
					//alert('rror');		
			}		
		}
	}
	
	
	function getNodeHTML(target)	{							
		var wrap = document.createElement( 'div' );
		wrap.appendChild(target.cloneNode(false));
		var inputs = target.getElementsByTagName('input');
		for (var i=0;i<inputs.length;i++)	{
			var clone = inputs[i].cloneNode(true);
			clone.value = '';
			wrap.appendChild(clone);				
		}
//alert( wrap.innerHTML.toLowerCase() );
		return wrap.innerHTML.toLowerCase();
	}


	function contain_bad_part(input_str)	{
		var bad_form_part = new Array('share', 'qty', 'producttagname', 'facebook','login', 'register', 'contact', 'weather', 'upload', 'sign', 'subscription','domain', 'username', 'payment', 'password', 'email','time','obituar','transaction','zip','phone','city', 'addr', 'person','itemstatus', 'arrivaldate', 'departuredate','datepicker','checkindate','checkoutdate', 'startdate', 'enddate', 'price');	// 'track', 'language',
		for (var i=0;i<bad_form_part.length;i++)	{
			var bad_str_loc = input_str.indexOf( bad_form_part[i] );
			if (bad_str_loc>=0)	{	
				if (input_str.indexOf('opacity')==bad_str_loc-3)		{	continue;	}
				if (input_str.indexOf('design')==bad_str_loc-2)			{	continue;	}
				if (input_str.indexOf('authenticity')==bad_str_loc-8)	{	continue;	}
				if (input_str.indexOf('domainsearch')==bad_str_loc)		{	continue;	}				
				if (input_str.indexOf('iphone')==bad_str_loc-1)			{	continue;	}								
//alert(input_str + ' : ' + bad_form_part[i]);				
				return true;
			}
		}
		return false;
	}

	function hasSearchWord(html)	{		
		var words = ['search','srch','query','keyword','find','lookup','recherch','busca','busque','suche','cerca','pesqui','поиск','Найти','Искать', 'szukaj','zoek','søk','sök','Търс','hleda','arama','www.google.com/custom'];		
		for (var i=0;i<words.length;i++)	{	if (html.indexOf(words[i])>=0)	{ 	return true;	}	}		
		return false;
	}
	
	function document_keywords(){
		var keywords = '';
		var metas = document.getElementsByTagName('meta');
		if (metas) {
			for (var x=0,y=metas.length; x<y; x++) {
				var meta_name = metas[x].name.toLowerCase();
				if (meta_name == "keywords" || meta_name == "description") {
					keywords += (' ' + metas[x].content);
				}
			}
		}
		return keywords != '' ? keywords : false;
	}

	var profanity_words = null;
	function is_profanity(c){
		try{
			if (profanity_words == null)	{
				profanity_words = ["porn ","pthc","boob ","jizz ","orgy ","bdsm","2g1c","a2m ","ass ","bbw ","cum ","tit ","pussy ","negro ","aryan ","bitch ","dildo ","juggs","yiffy","fuck ","titty","pubes","anal ","clit ","cock ","kama ","kike ","milf ","poof ","shit ","slut ","smut ","spic ","twat ","wank ","cunt ","bimbos","goatse","hooker","rectum","sodomy","vagina","goatcx","faggot","rimjob","femdom","dommes","honkey","incest","licked","nympho","tranny","voyeur","spooge","raping","gokkun","blow j","feltch","hentai","sadism","boner ","nigga ","queaf ","twink ","cocks ","twinkie","r@ygold","cocaine","neonazi","strapon","bukkake","jigaboo","asshole","cuckold","redtube","nig nog","camgirl","gay boy","gay sex","humping","schlong","swinger","camslut","raghead","figging","pegging","shemale","kinbaku","shibari","nawashi","fisting","pisspig","bondage","rimming","titties","upskirt","handjob","preteen","footjob","tubgirl","wetback","squirt ","darkie ","nigger ","orgasm ","sleazy d","bunghole","butthole","genitals","taste my","knobbing","huge fat","kinkster","pedobear","swastika","futanari","omorashi","goregasm","clitoris","bisexual","assmunch","daterape","bangbros","camwhore","frotting","tub girl","arsehole","bareback","blumpkin","hand job","birdlock","tentacle","goo girl","ball gag","big tits","bulldyke","ponyplay","mr hands","strap on","piss pig","creampie","jailbait","pre teen","jerk off","babeland","cumming ","dolcett ","gay dog ","gay man ","sodomize","prolapsed","big black","dog style","bung hole","fingering","strappado","rosy palm","goodvibes","servitude","two girls","date rape","fapserver","urophilia","anilingus","camel toe","group sex","hard core","threesome","tribadism","dp action","poopchute","zoophilia","phone sex","bastinado","girl on g","throating","gang bang","jail bait","ball sack","fellatio ","jack off ","jiggaboo ","slanteye ","stormfront","submissive","black cock","masturbate","eat my ass","bi curious","buttcheeks","circlejerk","autoerotic","giant cock","bestiality","poop chute","muffdiving","scissoring","transexual","asian babe","deepthroat","doggystyle","dominatrix","muff diver","sadie lune","sasha grey","jiggerboo ","pedophile ","towelhead ","violet wand","ejaculation","nsfw images","nimphomania","coprophilia","tea bagging","violet blue","bullet vibe","blue waffle","clusterfuck","doggiestyle","interracial","foot fetish","fudgepacker","spread legs","tongue in a","how to kill","blow your l","deep throat","doggy style","girl on top","nymphomania","style doggy","beaver lips","pole smoker","venus mound","double dong","nonconsent ","paedophile ","sultry women","crossdresser","ball kicking","big knockers","stileproject","motherfucker","spunky teens","fuck buttons","ethical slut","stickam girl","vorarephilia","doggie style","donkey punch","fudge packer","ball licking","ball sucking","shaved pussy","urethra play","raging boner","white power ","cunnilingus ","blonde action","rapping women","dirty sanchez","women rapping","golden shower","piece of shit","dirty pillows","how to murder","carpetmuncher","jackie strano","madison young","shaved beaver","male squirting","yellow showers","acrotomophilia","rusty trombone","linda lovelace","menage a trois","electrotorture","beaver cleaver","carpet muncher","mound of venus","pleasure chest","ducky doolittle","reverse cowgirl","brunette action","barenaked ladies","babes in toyland","bianca beauchamp","wartenberg wheel","courtney trouble","female squirting","one cup two girls","new pornographers","two girls one cup","leather restraint","chocolate rosebuds","double penetration","female desperation","wartenberg pinwheel","missionary position","consensual intercourse","leather straight jacket","blonde on blonde action","rosy palm and her 5 sisters"];
			}
			for(var d=0;d<profanity_words.length;d++){
				if(0<=c.indexOf(profanity_words[d])){return true}
			}
		}catch(f){}
		return false;
	}
	
	var built_in_suggest = null;
	function document_has_autocomplete()	{
		if (built_in_suggest != null)	{	return built_in_suggest;	}
		built_in_suggest = false;
		var scripts = document.getElementsByTagName('script');
		var i = scripts.length;
		var innerScript = '';
		while (i--) {
			innerScript = scripts[i].innerHTML.toLowerCase();
			if (innerScript.indexOf('suggest')>0 
				|| innerScript.indexOf('complete')>0	
				|| innerScript.indexOf('ssgObj')>0
				|| scripts[i].src.indexOf('autocomplete')>=0)	{
				built_in_suggest = true;
				return built_in_suggest;
			}
		}
		if (built_in_suggest != true)	{
			var sheetList = document.styleSheets;
			var ruleList, i, j, txt;		 
			for (i=sheetList.length-1; i >= 0; i--)       {
					 try { ruleList = sheetList[i].cssRules; } catch (e)	{    continue;   }					 
					 for (j=0; j<ruleList.length; j++)           {         
						 txt = ruleList[j].selectorText.toLowerCase();
						 if (txt.indexOf('autocomplete')>=0 || txt.indexOf('autosuggest')>=0) {
							built_in_suggest = true;
							return built_in_suggest;
						 }
					 }   
			}
		}	
		return built_in_suggest;
	}
	
	function getPossibeMatchingInputs(rootNode)	{
		var inputs = rootNode.getElementsByTagName('input');
		
		var possible_inputs = new Array();
		var lenny = inputs.length;
		var has_autocomplete_off;
	
		for (var i=0;i<lenny; i++)	{
			var inp = inputs[i];
			
			var inp_t = inp.getAttribute('type');
			var inp_ac = inp.getAttribute('autocomplete');			
			var inp_aria = inp.getAttribute('aria-autocomplete');

			has_autocomplete_off = false;
			
			//unsafeWindow.console.log( 'start' );			 
			if (inp_t != null)	{	inp_t = inp_t.toLowerCase();	}			
			if ( (inp_aria != null || inp_ac == 'off') && document_has_autocomplete() )	{
				//  || (inp_ac == 'off' && ( inp.onkeydown !=null || inp.getAttribute('onkeydown')!=null )) )	{			
				// unsafeWindow.console.log( ' has autocomplete=off' );				
				has_autocomplete_off = true;
			}			
			var input_html = getNodeHTML(inp);

			if	( has_autocomplete_off==false && (inp_t == null || inp_t == '' || inp_t == 'text' || inp_t == 'type' || inp_t == 'search' || inp_t == 'input') && ( contain_bad_part( input_html )==false) )	{
				// now let's ferret out the ones with a non-qualified <form> stuff...		

				var parent = inp.parentNode;
				var keep_input = true;	
				var the_input_form = null;	
				while (parent.tagName.toLowerCase() != 'body' && parent != null)	{
					if (parent.tagName.toLowerCase() == 'form')	{
						// found the matching <form...		
						if ( (parent.getAttribute('id')!=null && parent.getAttribute('id')=='aspnetForm') || (parent.getAttribute('action')!=null && parent.getAttribute('action').toLowerCase().indexOf('.aspx')>=0))	{	
							// ignore the .net form since it might contain login stuff etc (don't have the <form> bu keep the <input>)
							break;
						}			
						var form_html = getNodeHTML( parent );							
						if (parent.getAttribute('autocomplete')=='off')	{
							has_autocomplete_off = true;
						}						
						if ( hasSearchWord(form_html)==false || contain_bad_part(form_html) || parent.getAttribute('autocomplete')=='off' )	{	
							keep_input=false;
						}	else	{
							the_input_form = parent;
						}
						break;	
					}
					parent = parent.parentNode;
				}

				if (the_input_form==null && hasSearchWord(input_html)==false )	{				
					keep_input = false;				
				}
				
				if (keep_input)	{					
					var obj = new Object();	
					obj.input = inp;
					obj.form = the_input_form;
					possible_inputs.push( obj );
				}									
			
			}										
		}	
		
		/*if (possible_inputs.length == 0)	{
			var irr_type = 4;
			if (has_autocomplete_off)	{	irr_type = 5;	}
			
			api_ajax_request_get ( 	'irr',
							__acp.STATS_URL + "/irr?t=" + irr_type + "&l=" + encodeURIComponent(this_host) + "&p=" + __acp.porn_site,
							function(){} );
		}*/
		
		return possible_inputs;
	}	
});	//	END of JQuery DOMReady...

