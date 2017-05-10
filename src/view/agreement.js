define(function (require, exports, module) {
    var sTpl = require('text!temple/agreement.html');
    require("css!assets/css/module/agreement.css");


    var Vue = require("vue");
    var vueComponent = Vue.extend({
        template: sTpl,
        methods: {
            routerLink: function(){
                this.$router.push('/personal');
                
            }

        },
        data:function(){
            return{
                msg:"学生信息页面",
                myComData:"自定义组件的数据"
            }
        }
    });

    return vueComponent;
});