define(['text!temple/introduce.html','css!assets/css/module/introduce.css', 
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
                    introduce: '',
                    loding: true,
                    query: {}
                }
            },
            mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    _vm.token = common.readCookie('token');
                    _vm.query = _vm.$route.query;
                    _vm.init(_vm.query);
                    
                })
            },
            methods:{
            	init: function(query){
            		var _vm = this;
            		if(_vm.token){
            			_vm.getHosById(query.cid);
            		}else{
            			_vm.$router.push('login')
            		}
            	},
                getHosById: function(cid){
                	var _vm = this;
                	$.ajax({
		                url:'/doct-openapi/api/company/getCompanyInfoById.jhtml',
		                type:'GET',
		                dataType:'json',
		                data:{
		                    id: cid
		                },
		                beforeSend: function (request) {
		                    request.setRequestHeader("token", _vm.token);
		                },
		                success: function (data) {
		                    console.log(data);
		                    switch (data.code){
		                        case 0:
		                                var introduce = data.content.memo;
		                                _vm.introduce = introduce || '未填写'
		                                _vm.loding = false;
		                            break;
		                    }
		                },
		                error: function (err) {
		                    console.log(err)
		                }
		            })
                },
                back: function(){
                	var _vm = this;
                	_vm.$router.push({path: 'hosDetail',query: {cid: _vm.query.cid, s: _vm.query.s, t: _vm.query.t}})
                }
		        

            }
        });
        return vueComponent;
});