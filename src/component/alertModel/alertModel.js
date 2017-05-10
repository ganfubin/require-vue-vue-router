define(['text!component/alertModel/alertModel.html','css!component/alertModel/alertModel.css', 'vue'],
    function(sTpl, css, Vue){
    	 var vueComponent = Vue.extend({
            template: sTpl,
            props: {
            	alertShow: {
	                type: [Boolean]
	            },
	            option: {
	            	 type: [Object]
	            }
            },
            data: function(){
            	return {
            		alertToggle: false,
            		alert: {
            			title: '系统提示',
            			content: '',
            			cancelText: '取消',
            			sureText: '确定',
            			success : '',
            			cancel: ''

            		}
            	}
            },
            mounted: function(){
            	var _vm = this;
            	_vm.alert = _vm.option;
            	_vm.alertToggle = _vm.alertShow;
            },
            watch: {
            	alertShow: function(){
            		var _vm = this;
            		_vm.alertToggle = _vm.alertShow;            		
            	},
            	option: function(){
            		var _vm = this;
            		_vm.alert = _vm.option;
            	}
            },
            methods: {
            	ok: function(){
            		//this.$emit('on-ok');
            		this.alertToggle = false;
            		typeof this.alert.success == 'function' && this.alert.success();
            	},
            	cancel: function(){
            		//this.$emit('on-cancel');
            		this.alertToggle = false;
            		typeof this.alert.cancel == 'function' && this.alert.cancel();
            	}
            }

        })

    return vueComponent
})