define(['text!temple/appointmentHist.html','css!assets/css/module/appointmentHist.css', 
		'vue', 'common','component/loading/loading'],
    function(sTpl, css, 
    		Vue, common, cmptLoading){
        var vueComponent = Vue.extend({
            template: sTpl,
            data: function(){
            	return {
            		loding: true,
            		query: {},
            		appoint_list:[],
        			currAp:{}
            	}
            },
            components: {
	            cmptLoading
	        },
	        mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    _vm.token = common.readCookie('token');
                    _vm.query = _vm.$route.query;
                    _vm.init(_vm.$route.query.cid);
                })
            },
            methods:{
            	init: function( cid ){
            		var _vm = this;
            		$.ajax({
				        url: common.API.host + common.API.search + '/api/treatment/getAppointList.jhtml',
				        type:'GET',
				        dataType:'json',
				        data:{
				            companyId:cid
				        },
				        beforeSend: function (request) {
				            request.setRequestHeader("token", _vm.token);
				        },
				        success: function (data) {
				            switch (data.code){
				                case 0:
				                    if(data.content && data.content.length!=0){
				                        _vm.appoint_list = data.content
				                    }
				                    $('#appointHist').show(0,function(){
				                        _vm.loding = false;
				                    });
				                    break;
				                case 80007:
				                	_vm.$router.push('login');
				                    break;
				                case 80006:
				                    _vm.$router.push('login');
				                    break;

				            }
				        },
				        error: function (err) {
				            console.log(err)
				        }
				    })
            	},
		        formatApTime:function( obj ){
		            if( obj.AppointmentDate ){
		                var date = obj.AppointmentDate.replace(/-/ig,'/');
		                return date+' '+obj.AppointmentStartTime.slice(0,-3)+'~'+obj.AppointmentEndTime.slice(0,-3);
		            }
		        },
		        apStatus:function( obj ){
		            var latestTime = obj.AppointmentDate+' '+obj.AppointmentEndTime;

		            var latestTemp= latestTime.replace(/-/g,'/');
		            var latest = new Date(latestTemp).getTime();
		            var now  = new Date().getTime();
		            switch(obj.Status){
		                case 0:
		                    if( latest<now){
		                        return '已过期'
		                    }else{
		                        return '已经预约'
		                    }
		                break;
		                case 1:
		                    return '已上门';
		                    break;
		                case -1:
		                    return '已取消';
		                    break

		            }

		        },
		        getTimeTemp:function(  obj ){

		            var latestTime = obj.AppointmentDate+' '+obj.AppointmentEndTime;
		            return   new Date(latestTime).getTime();
		        },
		        viewDetail:function(item){
		            this.currAp=item;

		                $('.appointDetail').animate({
		                    left:0,
		                    top:0,
		                    bottom:0,
		                    right:0
		                },300,function(){

		                })

		        },
		        back:function(){

		                $('.appointDetail').animate({
		                    left:'100%',
		                    top:0,
		                    bottom:0,
		                    right:'-100%'
		                },300,function(){
		                    this.currAp={};
		                })

		        },
		        showCancelApAlert:function(){
		            var now = new Date().getTime();
		            var apDay = this.currAp.AppointmentDate.replace(/-/g,'/')+' 00:00:00';
		            var apDayTemp = new Date(apDay).getTime();


		            if(now > apDayTemp){
		                cantCancel()
		            }else{
		                showCancelApAlert()
		            }

		        },
		        cancelable:function(){
		            var _that = this
		            if(_that.currAp.Status==0){
		                //判断是否过期
		                var timeStr = _that.currAp.AppointmentDate.replace(/-/g,'/')+' '+_that.currAp.AppointmentEndTime.slice(0,5);
		                var now = new Date().getTime();
		                var latestTimeTemp = new Date(timeStr).getTime();
		                console.log(latestTimeTemp);
		                if(latestTimeTemp<now){
		                    return false
		                }else{
		                    return true
		                }
		            }else{
		                return false
		            }
		        },
		        cancelAp: function(){
		        	var _vm = this;
		        	$.ajax({
				        url: common.API.host + common.API.search + '/api/treatment/cancelCureAppointment.jhtml',
				        type:'POST',
				        dataType:'json',
				        data:{
				            companyId: _vm.query.cid,
				            appointId: appoint.currAp.ID
				        },
				        beforeSend: function (request) {
				            comon.createLoading('取消中...');
				            request.setRequestHeader("token",readCookie('token') );
				        },
				        success: function (data) {
				            switch (data.code){
				                case 0:
				                    $('.loading_img').css({
				                        background:'url("img/succ.png") no-repeat center',
				                        backgroundSize:'contain'
				                    });
				                    $('.loading .tips').text('取消成功');
				                    $('.mask').fadeOut(1000,function(){
				                        $('.mask').empty()
				                    });
				                    var cid = getUrlParam('cid');
				                    get_cureHistList(cid);
				                    $('.appointDetail').animate({
				                        left:'100%',
				                        top:0,
				                        bottom:0,
				                        right:'-100%'
				                    },300,function(){
				                        this.currAp={};
				                    })
				                    break;
				                case 80007:
				                   _vm.$router.push('login');
				                    break;
				                case 80006:
				                    _vm.$router.push('login');
				                    break;
				                default:
				                    break;

				            }
				        },
				        error: function (err) {
				            console.log(err)
				        }
				    })
		        }
            }
	    })
	    return vueComponent
});