 /**
 * Created by 彬彬 on 2016/12/18.
 */
 define(function (require, exports, module) {
     var sTpl = require('text!temple/teacher.html');
     var Vue = require('vue');
     var vueComponent=Vue.extend({
         template:sTpl,
         data:function(){
             return{
                 msg:'老师信息页面',
                 params1:"",
                 params2:""
             }
         },
         
         route:{
             data:function(transition){
                 return{
                     params1:transition.to.params.params1,
                     params2:transition.to.params.params2
                 }
             }
         },
         watch:{
             'params2':function(val,oldVal){
                 console.log(JSON.stringify(this.$data));
             }
         },
         methods:{
             click1:function(){
                 this.msg='点击后的值';
             }
         }
     });

     return vueComponent;
 });