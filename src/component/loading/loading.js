define(['text!component/loading/loading.html','css!component/loading/loading.css', 'vue'],
    function(sTpl, css, Vue){
    	 var vueComponent = Vue.extend({
            template: sTpl,
            props: {
            	loding: {
	                type: [Boolean]
	            },
	            lodingTime: {
	            	 type: Number,
	            	 default: 300
	            }
            },
            data: function(){
            	return {
            		loadShow: false
            	}
            },
            mounted: function(){
            	var _vm = this;
            	_vm.loadShow = _vm.loding;
            },
            watch: {
            	loding: function(){
            		var _vm = this;
            		setTimeout(function(){
            			_vm.loadShow = _vm.loding;
            		},_vm.lodingTime)
            		
            	}
            }

        })

    return vueComponent
})