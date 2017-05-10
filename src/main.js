/**
 * Created by  
 */
define(function(require){
    var Vue = require('vue');
    var router = require('router/router');
    //jquery 作为全局使用
    var $ = require('jquery');
    var FastClick = require('fastclick');
    FastClick.attach(document.body);
    
    Vue.config.debug = true;
    Vue.config.devtools = true;

    new Vue({
        el : '#app',
        router
    });
});


