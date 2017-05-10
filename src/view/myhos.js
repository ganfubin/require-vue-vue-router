define(['text!temple/myhos.html','css!assets/css/myhos.css', 'vue', 'common'],
    function(sTpl, css, Vue, common){
        var vueComponent = Vue.extend({
            template: sTpl,
            data:function(){
                return {
                    hosList:[],
        			srcUrl:'http://www.hellodoctor.com.cn/'
                }
            },
            mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    _vm.token = common.readCookie('token');
                    _vm.init();
                    
                    //loginScriptInit($dom);
                })
            },
            methods:{
            	init: function(){
            		var _vm = this;
            		if(_vm .token){
            			common.API.getMyHos='/api/company/get_myhospitals.jhtml';
            			_vm .getMyHosList();
            		}else{
            			_vm.$router.push('login')
            		}
            	},
                jump:function(item){
		            var isTop = item.isTop;
		            this.$router.push({path:'hosDetail',query: {cid: item.id,s: 0, t: isTop}});
		        },
		        getMyHosList: function(){
		        	var _vm = this;
		        	$.ajax({
		                url: common.API.host + common.API.search + common.API.getMyHos,
		                type:'POST',
		                dataType:'json',
		                beforeSend: function (request) {
		                    request.setRequestHeader("token",_vm.token);
		                },
		                success: function (data) {
		                    switch (data.code){
		                        case 0:

		                            if(data.content.length != 0){
		                                _vm.hosList = data.content;
		                                $('#loading').remove()
		                            }else{
		                                _vm.$router.push('addHos');
		                            }
		                    }
		                },
		                error: function (err) {
		                    console.log(err)
		                }
		            })
		        }

            }
        });
        return vueComponent;
});