define(function (require, exports, module) {
    var sTpl = require('text!temple/personal.html');
    require("css!assets/css/module/personal.css");
    var common = require('common');
    var Vue = require('vue');
    var cmptLoading = require('component/loading/loading');
    var vueComponent = Vue.extend({
        template: sTpl,
        components: {
            cmptLoading
        },
        data:function(){
            return{
                tipsToggle: false,
                myHosToggle: true,
                userInfo: {
                    age: 20,
                    gender: 1,
                    headurl: ''
                },
                info: {
                    balance: {
                        integer: '--',
                        decimal: '--'
                    },
                    voucher: {
                        integer:  '--',
                        decimal: '--'
                    },
                    points: {
                        integer: '--',
                        decimal: '--'
                    }
                },
                hosName: '',
                hosImgSrc: 'src/assets/img/icon_search.png',
                loding: true
            }
        },
        mounted: function(){
            this.$nextTick(function(){
                var _vm = this;
                var $dom = $(_vm.$el);
                _vm.$dom = $dom;
                _vm.hasToken();
                _vm.getWxUserInfo();
            })
        },
        methods: {
            hasToken: function(){
                if(common.readCookie('token')){
                    this.tipsToggle = false;
                    return true
                }else{
                     this.tipsToggle = true;
                    return false
                }
            },
            getWxUserInfo: function(){
                var _vm = this;
                $.ajax({
                    url:''+'/doct-openapi'+'/wechat/common/getWechatUserInfo.jhtml',
                    type:"GET",
                    dataType:"json",
                    success:function(data){

                        switch (data.code){
                            case 0:
                                //绘制用户信息
                                var content = data.content || {};
                                _vm.drawUserInfo(content);
                                if(common.readCookie('token')){
                                    _vm.getMyHos();
                                }else{
                                    _vm.myHosToggle = true;
                                    _vm.loding = false;
                                }
                                break;
                            default:
                                _vm.loding = false;
                                break;
                        }
                    }
                })
            },
            getMyHos: function(){
                var _vm = this;
                $.ajax({
                    url:''+'/doct-openapi'+'/api/company/get_myhospitals.jhtml',
                    type:"POST",
                    dataType:"json",
                    beforeSend:function(request){
                        request.setRequestHeader("token",readCookie('token'));
                    },
                    success:function(data){
                        switch (data.code){
                            case 0:
                                if(hasToken != null){
                                    if(data.content && data.content.length && data.content.length!=0){
                                        var topHos = data.content[0];
                                        var topHosId =topHos.id;
                                        _vm.hosId = topHosId;
                                        getAccountInfo(topHos);
                                        _vm.myHosToggle = false;
                                    }else {
                                        _vm.myHosToggle = true;
                                        _vm.loding = false;
                                        
                                    }
                                } else{
                                    _vm.myHosToggle = true;
                                    _vm.loding = false;
                                    
                                }
                                break;
                            default:
                                break;
                        }
                    }
                })
            },
            getAccountInfo: function(hosInfo){
                var _vm = this;
                $.ajax({
                    url:''+'/doct-openapi'+'/api/guardApi/getGuardAccountInfo.jhtml',
                    type:"GET",
                    dataType:"json",
                    data:{
                        companyId:hosId
                    },
                    beforeSend:function(request){
                        request.setRequestHeader("token",readCookie('token'));
                    },
                    success:function(data){
                        switch (data.code){
                            case 0:
                                var info =data.content;
                                var balance = info.Deposit + '';
                                var vouncher = info.Coupon + '';
                                var point = info.Point + '';
                                var balanceInt,balanceDec,vouncherInt,vouncherDec,pointInt,pointDec;
                                //余额数据处理
                                if(balance.indexOf('.') == -1){
                                    balanceInt = balance;
                                    balanceDec = '00';
                                }else{
                                    balanceInt = balance.slice(0,balance.indexOf('.'));
                                    balanceDec = balance.slice(balance.indexOf('.')+1);
                                }
                                //优惠券数据处理
                                if(vouncher.indexOf('.') == -1){
                                    vouncherInt = vouncher;
                                    vouncherDec = '00';
                                }else{
                                    vouncherInt = balance.slice(0,vouncher.indexOf('.'));
                                    vouncherDec = balance.slice(vouncher.indexOf('.')+1);
                                }
                                //积分数据处理
                                if(point.indexOf('.') == -1){
                                    pointInt = point;
                                    pointDec = '00';
                                }else{
                                    pointInt = balance.slice(0,point.indexOf('.'));
                                    pointDec = balance.slice(point.indexOf('.')+1);
                                }
                                _vm.info = {
                                    balance: {
                                        integer:  balanceInt || '--',
                                        decimal: balanceDec || '--'
                                    },
                                    voucher: {
                                        integer:  vouncherInt || '--',
                                        decimal: vouncherDec || '--'
                                    },
                                    points: {
                                        integer:  pointInt || '--',
                                        decimal: pointInt || '--'
                                    }
                                }

                                //医院信息部分(头像,名称)
                                _vm.hosName = hosInfo.companyName || '';
                                _vm.hosImgSrc = 'http://www.hellodoctor.com.cn/'+hosInfo.logo;
                                _vm.loding = false;
                                break;
                            case 80007:
                                break;
                            default:
                                break;
                        }
                    }
                })

            },
            drawUserInfo: function(content){
                this.userInfo = content;
            },
            routerLink: function($event){
                var $this = $($event.currentTarget);
                var url = $this.data('url');
                var parm = $this.data('parm');
                var _vm = this;
                if(parm){
                    var cid = common.getUrlParam('cid');
                    url && this.$router.push({path: url,params:{cid: _vm.hosId, type: 0}});
                 }else{
                    url && this.$router.push(url);
                 }
               
            }

        }
    });
    return vueComponent;
});