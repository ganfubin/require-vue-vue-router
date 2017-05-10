define(['text!temple/hosPoints.html','css!assets/css/module/hosPoints.css', 
	'vue', 'common', 'component/loading/loading'],
    function(sTpl, css, 
    	Vue, common, cmptLoading){
        var vueComponent = Vue.extend({
            template: sTpl,
            components: {
                cmptLoading
            },
            data:function(){
                return {
			        total:'',
			        list:[],
			        loding: false
                }
            },
            mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    _vm.query = _vm.$route.query;
                    _vm.token = common.readCookie('token');
                    _vm.init();
                })
            },
            methods:{
            	init: function(){
                    var cid = this.query.cid;
                    this.getBaseInfo(cid);
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
			                        _vm.getBalacneInfo(cid, data.content);
			                        break;
			                    case 80007:
			                        break;
			                    default:
			                        break;
			                }
			            },
			            error: function (err) {
			                console.log(err)
			            }
			        })
                },
                getBalacneInfo: function(cid, cache ){
                	var _vm = this;
                	$.ajax({
			            url:''+'/doct-openapi'+'/api/guardApi/getGuardAccountPointList.jhtml',
			            type:"GET",
			            dataType:"json",
			            data:{
			                companyId:cid
			            },
			            beforeSend:function(request){
			                request.setRequestHeader("token", _vm.token);
			            },
			            success:function(data){

			                _vm.total = _vm.formatNumber(cache.Point);
			                _vm.list = data.content;
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
                formatNumber: function(n){
                	var b = parseInt(n).toString();
                    var len = b.length;
                    if(len <= 4){return b;}
                    var r = len%4;
                    return r > 0 ? b.slice(0,r)+","+b.slice(r,len).match(/\d{4}/g).join(",") : b.slice(r,len).match(/\d{4}/g).join(",");
                },
				back: function(){
					var _vm = this;
                    var type = _vm.query.t;
                    if(type == 0){
                        _vm.$router.push('personal');
                    }else{
                        _vm.$router.push({path: 'hosDetail',query: {cid: _vm.query.cid, s: _vm.query.s, t: _vm.query.t}});
                    }
		        }
            }
        });

        return vueComponent;
});