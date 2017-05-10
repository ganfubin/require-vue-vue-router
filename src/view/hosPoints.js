define(['text!temple/hosPoints.html','css!assets/css/module/hosPoints.css', 'vue', 'common'],
    function(sTpl, css, Vue, common){
        var vueComponent = Vue.extend({
            template: sTpl,
            data:function(){
                return {
			        total:'',
			        list:[]
                }
            },
            mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    loginScriptInit($dom);
                })
            },
            methods:{
				back: function(){
		            var type = common.getUrlParam('type');
		            if(type==0){
		                location.href='personal.html'
		            }else{
		                location.href='hos_detail.html'+'?cid='+common.getUrlParam('cid')+'&s='+common.getUrlParam('s')+'&t='+common.getUrlParam('t');
		            }
		        }
            }
        });

        /**
		 * 格式化数字  每4位加一个逗号
		 * */
		function format_number(n){
		    var b=parseInt(n).toString();
		    var len=b.length;
		    if(len<=4){return b;}
		    var r=len%4;
		    return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{4}/g).join(","):b.slice(r,len).match(/\d{4}/g).join(",");
		}

        function loginScriptInit($dom){
            function getBaseInfo(cid){
		        $.ajax({
		            url:'/doct-openapi/api/guardApi/getGuardAccountInfo.jhtml',
		            type:'GET',
		            dataType:'json',
		            data:{
		                companyId:cid
		            },
		            beforeSend: function (request) {
		                request.setRequestHeader("token",common.readCookie('token') );
		            },
		            success: function (data) {
		                switch (data.code){
		                    case 0:
		                        getBalacneInfo(cid,data.content);
		                        break;
		                    case 80007:
		                        break;
		                    default:
		                        break;
		                }
		            },
		            error: function (err) {
		                console.log(err)
		            }
		        })
		    }

		    function getBalacneInfo ( cid,cache ){
		        $.ajax({
		            url:''+'/doct-openapi'+'/api/guardApi/getGuardAccountPointList.jhtml',
		            type:"GET",
		            dataType:"json",
		            data:{
		                companyId:cid
		            },
		            beforeSend:function(request){
		                request.setRequestHeader("token",common.readCookie('token'));
		            },
		            success:function(data){

		                points.total=format_number(cache.Point);
		                points.list = data.content;
		                $('#loading').fadeOut(300,function(){
		                    $('#loading').remove()
		                });
		                switch (data.code){
		                    case 0:
		                        break;
		                    case 80007:
		                        location.href='login.html';
		                        break;
		                    case 80006:
		                        location.href='login.html';
		                        break;
		                    default:
		                        break;
		                }
		            }
		        })
		    }

		    var cid = common.getUrlParam('cid');
		    getBaseInfo(cid)
        }

        return vueComponent;
});