require.config({
    baseUrl : './src',
    paths :{
        jquery: './lib/jquery.min',
        vue: './lib/vue',
        vueRouter: './lib/vue-router',
        vueX: './lib/vuex',
        lodash: './lib/lodash.min',
        text: './lib/text',
        css: './lib/css',
        fastclick: './lib/fastclick',
        mobiscroll: './lib/mobiscroll.custom-2.5.2/mobiscroll.custom-2.5.2.min',
        ajaxfileupload: './lib/ajaxfileupload',
        //自己封装的方法
        common: './assets/js/common',
        py: './lib/py'

    },
    shim : {
        //

    },
    packages: [
        //包管理
        // {
        //     name : "vuex",
        //     location :"vuex",
        //     main : "vuex"
        // }
        {
            name: 'component',
            location: './component'
        }
    ]
})
require(['./main'])