define(['text!temple/hosBanlance.html','css!assets/css/module/hosBanlance.css', 'vue', 'common'],
    function(sTpl, css, Vue, common){
        var vueComponent = Vue.extend({
            template: sTpl,
            data:function(){
                return {
                    rest:'0',
                    balanceList:[]
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
                checkDetail: function (){
                    var type = getUrlParam('type');
                    if(type=='0'){
                        location.href='balance_detail.html'+'?cid='+getUrlParam('cid')+'&type='+getUrlParam('type');
                    }else{
                        location.href = 'balance_detail.html'+'?cid='+getUrlParam('cid')+'&s='+getUrlParam('s')+'&t='+getUrlParam('t');
                    }

                },
                back:function(){
                    var type = getUrlParam('type');
                    if(type==0){
                        location.href='personal.html'
                    }else{
                        location.href='hos_detail.html'+'?cid='+getUrlParam('cid')+'&s='+getUrlParam('s')+'&t='+getUrlParam('t');
                    }
                },
                toggleDetail:function(e){
                    var target = e.target;
                    while (target.tagName.toLowerCase()!='h2'){
                        target=target.parentNode
                    }
                    $(target).parent().toggleClass('show')
                }
            }
        });

        function loginScriptInit($dom){
            function getBaseInfo ( hosId  ){
                $.ajax({
                    url: '' + '/doct-openapi' + '/api/guardApi/getGuardAccountInfo.jhtml',
                    type: "GET",
                    dataType: "json",
                    data: {
                        companyId: hosId
                    },
                    beforeSend: function (request) {
                        request.setRequestHeader("token", common.readCookie('token'));
                    },
                    success: function (data) {
                        switch ( data.code ){
                            case 0:
                                var cache = data.content;
                                getBalacneInfo(cache,cid);
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

            function getBalacneInfo ( cache,cid ){
                $.ajax({
                    url:''+'/doct-openapi'+'/api/guardApi/getGuardAccountDepositList.jhtml',
                    type:"GET",
                    dataType:"json",
                    data:{
                        companyId:cid
                    },
                    beforeSend:function(request){
                        request.setRequestHeader("token",common.readCookie('token'));
                    },
                    success:function(data){
                        switch (data.code){
                            case 0:
                                balance.rest=format_number(cache.Deposit);
                                balance.balanceList=data.content;
                                $('#loading').fadeOut(300,function(){
                                    $('#loading').remove()
                                });
                                break;
                            case 80007:
                                location.href='login.html'
                                break;
                            case 80006:
                                location.href='login.html'
                                break;
                            default:
                                break;
                        }
                    }
                })
            }

            var cid = common.getUrlParam('cid');
            getBaseInfo(cid);

        }

        return vueComponent;
});