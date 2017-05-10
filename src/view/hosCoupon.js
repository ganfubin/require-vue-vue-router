define(['text!temple/hosCoupon.html','css!assets/css/module/hosCoupon.css','vue','common', 'component/loading/loading'],
    function(sTpl, css, Vue, common, cmptLoading){

        var vueComponent = Vue.extend({
            template: sTpl,
            components: {
	            cmptLoading
	        },
            data:function(){
                return {
			        list: [],
			        overdue: [],
			        expired: [],
			        type: 0,
			        loding: true
                }
            },
            mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    _vm.query = _vm.$route.query;
                    _vm.token = common.readCookie('token');
                    _vm.query = _vm.$route.query;
                    _vm.token = common.readCookie('token');
                    _vm.init();
                })
            },
            methods:{
            	init: function(){
            		var cid = this.query.cid;
            		this.getBaseInfo(cid)
            	},
            	getBaseInfo: function(cid){
            		var _vm = this;
            		$.ajax({
			            url:'/doct-openapi/api/guardApi/getGuardAccountInfo.jhtml',
			            type:'GET',
			            dataType:'json',
			            data:{
			                companyId: cid
			            },
			            beforeSend: function (request) {
			                request.setRequestHeader("token", _vm.token);
			            },
			            success: function (data) {
			                switch (data.code){
			                    case 0:
			                        _vm.getCouponInfo(cid, data.content);
			                        break;
			                    case 80007:
			                        //location.href='login.html'
			                        break;
			                    case 80006:
			                        //location.href='login.html'
			                        break;
			                    default:
			                        break;
			                }
			            },
			            error: function (err) {

			            }
			        })
            	},
            	getCouponInfo: function(cid, cache){
            		var _vm = this;
			        $.ajax({
			            url:''+'/doct-openapi'+'/api/guardApi/getGuardAccountCouponList.jhtml',
			            type:"GET",
			            dataType:"json",
			            data:{
			                companyId:cid
			            },
			            beforeSend:function(request){
			                request.setRequestHeader("token", _vm.token);
			            },
			            success:function(data){
			                var expired =[],
			                    overDue=[];
			                var _len  = data.content.length;
			                for(var i=0;i<_len;i++){
			                    var now = new Date().getTime();
			                    var targetTime = new Date(data.content[i].Expiration+' 23:59:59').getTime();

			                    if(now > targetTime){
			                        overDue.push(data.content[i])
			                    }else{
			                        expired.push(data.content[i])
			                    }
			                }
			                _vm.list = expired;
			                _vm.overdue = overDue;
			                _vm.expired = expired;
			                _vm.loding = false;
			                switch (data.code){
			                    case 0:
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
			            }
			        })
            	},
		        back: function(){
		        	var _vm = this;
		            var type = _vm.query.t;
		            console.log(type);
		            if(type == 0){
		            	_vm.$router.push('personal');
		            }else{
		                _vm.$router.push({path:'hosDetail',query: {cid: _vm.query.cid, s: _vm.query.s, t: _vm.query.t}});
		            }

		        },
		        timeScope: function ( startTime, endTime ){
		            startTime = startTime.slice(0,startTime.indexOf(' '));
		            return startTime+'~'+endTime
		        },
		        showOverDue: function(e){
		            this.list=this.overdue;
		            var target = e.target;
		            while (target.tagName.toLowerCase()!='h2'){
		                target = target.parentNode;
		            }
		            $(target).addClass('show-tit').siblings('h2').removeClass('show-tit')
		            this.type = 1
		        },
		        showExpired: function(e){
		            this.list = this.expired;
		            var target = e.target;
		            while (target.tagName.toLowerCase()!='h2'){
		                target = target.parentNode;
		            }
		            $(target).addClass('show-tit').siblings('h2').removeClass('show-tit')
		            this.type =  0
		        }
            }
        });
        return vueComponent;
});