define(['text!temple/login.html','css!assets/css/module/login.css','vue'],
    function(sTpl, css, Vue){
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

        //TODO 由于没有修改以前的代码，直接用的以前的js 没有按照vue规范编程

        function loginScriptInit ($dom){
            var login={};

            login.init = function(){
                login.initNodes();
            };

            login.initNodes = function(){

                this.loginBtn = $('#login_btn');
                this.sendBtn = $('#sendMsg');
                this.PWD = /^[a-zA-Z0-9]{6,16}$/;
                this.PHONE = /^1[3|4|5|7|8]\d{9}$/;

                this.sendBtn.on('click',function() {
                    var _mobile = $('#mobile').val();
                    if(login.PHONE.test(_mobile)){
                        $('#sendMsg').attr({'disabled':'disabled'});
                        getValidMsg(_mobile)
                    }else{
                        login.showTips($('#mobile'),'请输入正确的手机号码');
                    }
                })

            };
            /**
             * 公共验证方法
             * */
            login.valid =function( reg,el,err,isVaslid){
                var _val = el.val().trim();
                if(!reg.test(_val)){
                    if(isVaslid){
                        login.showTips(el,err)
                    }
                    return false
                }else{
                    if(isVaslid){
                        login.hideTips(el)
                    }
                    return true
                }
                $('#loading').remove();
            };
            /**
             * 验证结果事件
             * */
            login.showTips=function( el,err ){
                el.siblings('.err').text(err).show()
            };
            login.hideTips = function( el ){
                el.siblings('.err').hide()
            };
            login.getAccount =function(){
                return  $('#mobile').val();
            };
            login.getPwd = function(){
                return $('#pwd').val();
            };
            login.submit=function(){
                var allowed=false ;
                var mobileValid;
                var pwdValid;
                var validValue;

                if($('#mobile').val()==''){
                    login.showTips($('#mobile'),'请输入手机号');
                    mobileValid=false;
                    allowed=false
                }else{
                    mobileValid=login.valid(login.PHONE,$('#mobile'),'请输入正确的手机号码',true)
                }
                if($('#valid_msg').val()==''){
                    login.showTips($('#valid_msg'),'请输入验证码');
                    validValue='';
                    allowed=false
                }else{
                    validValue=$('#valid_msg').val();
                }
                if($('#pwd').val()==''){
                    login.showTips($('#pwd'),'请输入6-16位密码');
                    allowed=false
                    pwdValid=false
                }else{
                    pwdValid=login.valid(login.PWD,$('#pwd'),'请输入6-16位密码',true)
                }


                console.log(mobileValid,pwdValid,validValue)
                if(mobileValid && pwdValid && validValue!=''){
                    console.log('sendLogin xhr')
                    var mobile = $('#mobile').val();
                    var pwd = $('#pwd').val()
                    var securityCode= $('#valid_msg').val();
                    startLogin(mobile,pwd,securityCode)
                }



            };





            /**
             *获取验证码
             * */
            function getValidMsg(mobile){

                $.ajax({
                    url:''+'/doct-openapi'+'/api/register/wechatRegisterSendsms.jhtml',
                    type:"POST",
                    dataType:"json",
                    data:{
                        mobile:mobile,
                        platformId:'1'
                    },
                    success:function(data){
                        $('.err').hide()
                        var option  = {};
                        switch (data.code){
                            case 0:
                                var num = 60;
                                var timer = setInterval(function(){
                                    num--;
                                    if(num>0){
                                        $('#sendMsg').html(num+'s后重新获取').attr({'disabled':'disabled'})
                                    }else{
                                        clearInterval(timer);
                                        timer=null
                                        $('#sendMsg').html('重新获取验证码').removeAttr('disabled')
                                    }
                                },1000);
                                break;
                            case 11009:
                                showErrTips('操作频率过快,请稍后再次获取');
                                break;
                            default:
                                showErrTips(data.desc)
                        }
                    }
                })
            }
            /**
             *获取验证码失败提示
             * */
            function showErrTips( text ){
                var html ='';
                html+=
                    ' <div class="login_mask">'+
                       '<div class="sendError">'+
                            '<p class="title"></p>'+
                            '<p class="content">'+text+'</p>'+
                            '<p class="login_mask_btn">确定</p>'+
                        '</div>'+
                    '</div>';
                $('body').append(html);
                $('.login_mask').fadeIn(300)
            }
            /**
             * 关闭获取验证码失败弹窗
             * */
            function hideMask(){

                $('.login_mask').fadeOut(300,function(){

                    $('.login_mask').remove();
                })

            }

            function startLogin( mobile,pwd,securityCode){
                $.ajax({
                    url:''+'/doct-openapi'+'/api/register/wechatRegister.jhtml',
                    type:"POST",
                    dataType:"json",
                    data:{
                        mobile:mobile,
                        password:pwd,
                        securityCode:securityCode
                    },
                    success:function(data){
                        console.log(data);
                        switch (data.code){
                            case 0:
                                location.href="personal.html";
                                break;
                            default:
                                showErrTips(data.desc);
                                break;
                        }
                    }
                })
            }

            function  initUserInfo(){
                $.ajax({
                    url:''+'/doct-openapi'+'/wechat/common/getWechatUserInfo.jhtml',
                    type:"GET",
                    dataType:"json",
                    async:false,
                    success:function(data){
                        switch (data.code){
                            case 0:
                                $('.pic img').attr({'src':data.content.headurl});
                                $('.tips p span').text(data.content.name);
                                login.init();
                                break;
                        }
                    },
                    error:function(error){
                    }
                })
            }


            $('#mobile').on('blur',function(){

                if($('#mobile').val()==''){
                    login.showTips($('#mobile'),'请输入手机号');
                }else{
                    var _val = $('#mobile').val();
                    if(login.PHONE.test(_val)){
                        login.hideTips($('#mobile'))
                    }else{
                        login.showTips($('#mobile'),'请输入正确的手机号');
                    }
                }
            }).on('input',function(){
                var _val = $('#mobile').val();
                    if(login.PHONE.test(_val)){
                        login.hideTips($('#mobile'))
                    }
            });



            $('#pwd').on('blur',function(){
                if($('#pwd').val()==''){
                    login.showTips($('#pwd'),'请输入密码');
                }else{
                    var _val = $('#pwd').val();
                    if(login.PWD.test(_val)){
                        login.hideTips($('#pwd'))
                    }else{
                        login.showTips($('#pwd'),'请输入6-16位密码');
                    }
                }
            }).on('input',function(){
                var _val = $('#pwd').val();
                if(login.PWD.test(_val)){
                    login.hideTips($('#pwd'))
                }
            });
            $('#valid_msg').on('blur',function(){
                if($('#valid_msg').val()==''){
                    login.showTips($('#valid_msg'),'请输入验证码');
                }else{
                    login.hideTips($('#valid_msg'));
                }
            })
            $('body').on('click','.login_mask_btn',function(e){
                if(e.target.className.toLocaleLowerCase()=='login_mask_btn'||'login_mask'){
                    $('#sendMsg').html('重新获取验证码').removeAttr('disabled');
                    hideMask()
                }
            });
            $('#login_btn').on('click',function(){
                login.submit()
            });

            initUserInfo();
        }
        return vueComponent;
})