define(function (require, exports, module) {
    var sTpl = require('text!temple/agreement.html');
    require("css!assets/css/module/agreement.css");


    var Vue = require("vue");
    var vueComponent = Vue.extend({
        template: sTpl,
        mounted: function(){
            this.$nextTick(function(){
                var _vm = this;
                var $dom = $(_vm.$el);
                _vm.$dom = $dom;
                loginScriptInit($dom);
            })
        }
    });
    function loginScriptInit($dom){
        var deviceWidth = document.documentElement.clientWidth;
        var ag = document.getElementById('agreement');
        if (deviceWidth < 640){
            ag.style.width=320+'px'
        }
    }

    return vueComponent;
});