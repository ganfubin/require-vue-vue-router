define(['text!temple/settings.html','css!assets/css/settings.css'],
    function(sTpl, css){
    	var Vue = require("vue");
        var vueComponent = Vue.extend({
            template: sTpl,
            mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    
                })
            }
        });

        return vueComponent;
 })