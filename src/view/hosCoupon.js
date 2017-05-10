define(['text!temple/hosCoupon.html','css!assets/css/hosCoupon.css','vue','common', 'component/loading/loading'],
    function(sTpl, css, Vue, common, 'cmptLoading'){

        var vueComponent = Vue.extend({
            template: sTpl,
            components: {
	            cmptLoading
	        },
            data:function(){
                return {
			        list:[],
			        overdue:[],
			        expired:[],
			        type:0,
			        loding: true
                }
            },
            mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    loginScriptInit($dom);
                })
            },
            methods:{
		        back:function(){
		            var type = getUrlParam('type');
		            if(type==0){
		                location.href='personal.html'
		            }else{
		                location.href='hos_detail.html'+'?cid='+getUrlParam('cid')+'&s='+getUrlParam('s')+'&t='+getUrlParam('t');
		            }

		        },
		        timeScope:function ( startTime,endTime ){
		            startTime = startTime.slice(0,startTime.indexOf(' '));
		            return startTime+'~'+endTime
		        },
		        showOverDue:function(e){
		            this.list=this.overdue;
		            var target = e.target;
		            while (target.tagName.toLowerCase()!='h2'){
		                target = target.parentNode;
		            }
		            $(target).addClass('show-tit').siblings('h2').removeClass('show-tit')
		            this.type=1
		        },
		        showExpired:function(e){
		            this.list = this.expired;
		            var target = e.target;
		            while (target.tagName.toLowerCase()!='h2'){
		                target = target.parentNode;
		            }
		            $(target).addClass('show-tit').siblings('h2').removeClass('show-tit')
		            this.type=0
		        }
            }
        });

        /**
		 * 格式化数字  每4位加一个逗号
		 * */
		function format_number(n){
		    var b=parseInt(n).toString();
		    var len=b.length;
		    if(len<=4){return b;}
		    var r=len%4;
		    return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{4}/g).join(","):b.slice(r,len).match(/\d{4}/g).join(",");
		}

        function loginScriptInit($dom){
                var cid = common.getUrlParam('cid');

			    function getBaseInfo(cid){
			        $.ajax({
			            url:'/doct-openapi/api/guardApi/getGuardAccountInfo.jhtml',
			            type:'GET',
			            dataType:'json',
			            data:{
			                companyId:cid
			            },
			            beforeSend: function (request) {
			                request.setRequestHeader("token",common.readCookie('token') );
			            },
			            success: function (data) {
			                switch (data.code){
			                    case 0:
			                        getCouponInfo(cid,data.content);
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
			    }

			    function getCouponInfo ( cid,cache ){
			    	var _vm = this;
			        $.ajax({
			            url:''+'/doct-openapi'+'/api/guardApi/getGuardAccountCouponList.jhtml',
			            type:"GET",
			            dataType:"json",
			            data:{
			                companyId:cid
			            },
			            beforeSend:function(request){
			                request.setRequestHeader("token",common.readCookie('token'));
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
			                coupon.list=[];
			                coupon.list = expired;
			                coupon.overdue=[];
			                coupon.overdue=overDue;
			                coupon.expired=[];
			                coupon.expired=expired;


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
			    }

			    getBaseInfo(cid);
        }

        return vueComponent;
});