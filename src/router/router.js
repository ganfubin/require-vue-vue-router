define(function(require){

  var Vue = require("vue");
  var vueRouter = require("vueRouter");

  Vue.use(vueRouter);

  var router = new vueRouter({
  	routes: [
	  	{
          path: '',
          redirect: '/login'
      },
      {
          path: '/login',
          name: 'login',
          component : function(resolve){
            require(['src/view/login.js'], resolve)
          }
      },
      {
          path: '/personal',
          name: 'personal',
          component: function(resolve){
             require(['src/view/personal.js'], resolve)
           }
      },
      {
          path: '/agreement',
          name: 'agreement',
          component: function(resolve){
             require(['src/view/agreement.js'], resolve)
           }
      },
      {
          path: '/settings',
          name: 'settings',
          component: function(resolve){
             require(['src/view/settings.js'], resolve)
           }
      },
      {
          path: '/modifyInfo',
          name: 'modifyInfo',
          component: function(resolve){
             require(['src/view/modifyInfo.js'], resolve)
           }
      },
      {
          path: '/hosBanlance',
          name: 'hosBanlance',
          component: function(resolve){
             require(['src/view/hosBanlance.js'], resolve)
           }
      },
      {
          path: '/hosCoupon',
          name: 'hasCoupon',
          component: function(resolve){
             require(['src/view/hosCoupon.js'], resolve)
           }
      },
      {
          path: '/hosPoints',
          name: 'hosPoints',
          component: function(resolve){
             require(['src/view/hosPoints.js'], resolve)
           }
      },
      {
          path: '/myhos',
          name: 'myhos',
          component: function(resolve){
             require(['src/view/myhos.js'], resolve)
           }
      },
      {
          path: '/addHos',
          name: 'addHos',
          component: function(resolve){
             require(['src/view/addHos.js'], resolve)
           }
      },
      {
          path: '/hosDetail',
          name: 'hosDetail',
          component: function(resolve){
             require(['src/view/hosDetail.js'], resolve)
           }
      },
      {
          path: '/appointmentHos',
          name: 'appointmentHos',
          component: function(resolve){
             require(['src/view/appointmentHos.js'], resolve)
           }
      },
      {
          path: '/appointmentHist',
          name: 'appointmentHist',
          component: function(resolve){
             require(['src/view/appointmentHist.js'], resolve)
           }
      },
      {
          path: '/introduce',
          name: 'introduce',
          component: function(resolve){
             require(['src/view/introduce.js'], resolve)
           }
      }
  	]
  });


  return router
})
