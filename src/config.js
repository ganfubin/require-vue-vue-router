require.config({
    baseUrl : './src',
    paths :{
        'jquery': './lib/jquery.min',
        'Vue': './lib/vue',
        'vueRouter': './lib/vue-router',
        'vueX': './lib/vuex',
        'lodash.min': './lib/lodash.min',
        'text': './lib/text',
        'css': './lib/css',
        'fastclick': './lib/fastclick',
        'mobiscroll': './lib/mobiscroll.custom-2.5.2/mobiscroll.custom-2.5.2.min',
        'ajaxfileupload': './lib/ajaxfileupload',
        
        //自己封装的方法
        'common': './assets/js/common',
        'py': './lib/py',
        'lodash': './assets/js/lodash',
        'vue': './assets/js/vue-extendFunction',
        'commonRem': './assets/js/commonRem'

    },
    shim : {
        'commonRem': {
            deps: ['jquery'],
            exports: 'commonRem'
        }

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