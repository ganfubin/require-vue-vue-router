define(function (require, exports, module) {

	var API = {
	    host:'',
	    search:'/doct-openapi',
	    getparams:'/api/mutual/getWeChatJsSdkConfig.jhtml',
	};

	//写cookies
	function setCookie(name, value) {
	    var days = 1;
	    var exp = new Date();
	    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
	    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	}
	//读取cookies
	function readCookie(name) {
	    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	    if (arr = document.cookie.match(reg)) {
	        return unescape(arr[2]);
	    } else {
	        return null;
	    }

	}
	//删除cookies
	function delCookie(name) {
	    var cval = readCookie(name);
	    if (cval != null) {
	        document.cookie = name + "=" + cval + ";expires=" + (new Date(0)).toGMTString();
	    }
	}


	function createAlert( option ){

	    var html ="";
	    html+=
	        '<div class="alert">'+
	        '<p class="alert_title">'+option.title+'</p>'+
	        '<p class="alert_content">'+option.content+'</p>'+
	        '<div class="alert_footer">';
	    if(option.btnNum==2){
	        html+='<a class="alert_btn cancel">'+option.cancelText+'</a>'+
	            '<a class="alert_btn sure">'+option.sureText+'</a>';
	    }else{
	        html+=
	            '<a class="alert_btn sure solo">'+option.sureText+'</a>';
	    }
	    html+=
	        '</div>'+
	        '</div>';

	    $('.mask').html(html);
	    $('.alert_btn.cancel').on('tap',function(){
	        option.cancelCB()
	    })
	    $('.alert_btn.sure').on('tap',function(){
	        option.sureCB()
	    })
	    $('.mask').fadeIn(300);
	}
	function createLoading( tips,callBack ){
	    var loading_tpl = '';
	    loading_tpl+=
	        '<div class="loading">'+
	        '<div class="loading_img"></div>'+
	        '<p class="tips">'+tips+'</p>'+
	        '</div>';
	    if(callBack){
	        $('.mask').html(loading_tpl).fadeIn(300,function(){
	            getUserDetail();
	            getUserPositon();
	            getUserAuth();
	            $('.mask').empty().fadeOut(300,publicTabs('.panel_docDetail'))
	        });
	    }else{
	        $('.mask').html(loading_tpl).fadeIn(300);

	    }


	}
	/**
	 * @获取地址hash字符串传递的参数
	 * @param name
	 * @returns {null}
	 */
	function getUrlParam(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	    if (r != null) return unescape(r[2]); return null; //返回参数值
	}

	function createPopup(){
	    if($('#loading').length==0){
	        $('body').append('<div class="popup"></div>')
	    }
	}
	function deletePopup(){
	    $('.popup').remove()
	}

	function createToast(desc){
	    $('.toast').remove();
	    var html ='';
	    html+='<div class="toast">'+
	        '<p><span>'+desc+'</span></p>'+
	        '</div>';
	    $('body').append(html);
	    $('.toast').fadeIn(300,function(){
	        setTimeout(function(){
	            $('.toast').fadeOut(300,function(){
	                $('.toast').remove();
	            })
	        },2000)
	    })
	}


	function getWXparams(){
	    $.ajax({
	        url:API.host+API.search+API.getparams,
	        type:'POST',
	        dataType:'json',
	        data:{
	            url:location.href.split('#')[0]
	        },
	        success:function(data){
	            window.wx.config({
	                debug: false,
	                appId: data.content.appId,
	                timestamp:data.content.timestamp,
	                nonceStr: data.content.nonceStr,
	                signature: data.content.signature,
	                jsApiList: [
	                    'onMenuShareTimeline',
	                    'chooseImage',
	                    'previewImage',
	                    'uploadImage',
	                    'downloadImage',
	                ]
	            });

	        },
	        error:function(err){
	            console.log('error'+err)
	        }
	    })
	}
	return {
		API: API,
		setCookie: setCookie,
		readCookie: readCookie,
		delCookie: delCookie,
		createAlert: createAlert,
		createLoading: createLoading,
		getUrlParam: getUrlParam,
		createPopup: createPopup,
		deletePopup: deletePopup,
		createToast: createToast,
		createToast: createToast,
		getWXparams: getWXparams
	}
})