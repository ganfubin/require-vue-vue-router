define(['text!temple/appointmentHos.html','css!assets/css/module/appointmentHos.css', 
		'vue', 'common','component/loading/loading'],
    function(sTpl, css, 
    		Vue, common, cmptLoading){
        var vueComponent = Vue.extend({
            template: sTpl,
            data: function(){
            	return {
            		hosList: [],
            		loding: true
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
                    _vm.init();
                })
            },
            methods:{
            	init: function(){
            		 var _vm = this;
            		 if(_vm.token){
            		 	_vm.getAllBindHos();
            		 }else{
            		 	_vm.$router.push('login');
            		 }
            	},
            	getAllBindHos: function(){
            		var _vm = this;
            		$.ajax({
			            url: common.API.host + common.API.search + '/api/company/get_myhospitals.jhtml',
			            type:'POST',
			            dataType:'json',
			            beforeSend: function (request) {
			                request.setRequestHeader("token", _vm.token);
			            },
			            success: function (data) {
			                switch (data.code){
			                    case 0:
			                        if(data.content.length!=0){
			                        	_vm.loding = false;
			                            _vm.hosList = data.content;
			                        }else{
			                            //location.href='add_hos.html';
			                        }
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
            	},
            	jump: function(item){
            		var _vm = this;
            		_vm.$router.push({path: 'appointmentHist',query: {cid: item.id}})
            	}
            }
	    })
	    return vueComponent
});