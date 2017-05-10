define(function (require, exports, module) {
    var sTpl = require('text!temple/modifyInfo.html');
    require("css!assets/css/modifyInfo.css");
    var common = require('common');
    var Vue = require("vue");
    require('mobiscroll');
    require('ajaxfileupload');
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

    function loginScriptInit($dom){
    	$(function() {
		    (function ($) {
		        $.mobiscroll.i18n.zh = $.extend($.mobiscroll.i18n.zh, {
		            setText: '确定',
		            cancelText: '取消'
		        });
		    })(jQuery);
		        var currYear = (new Date()).getFullYear();
		        var opt={};
		        opt.date = {preset : 'date'};
		        //opt.datetime = { preset : 'datetime', minDate: new Date(2012,3,10,9,22), maxDate: new Date(2014,7,30,15,44), stepMinute: 5  };
		        opt.datetime = {preset : 'datetime'};
		        opt.time = {preset : 'time'};
		        opt.default = {
		            theme: 'android-ics light', //皮肤样式
		            display: 'bottom', //显示方式
		            mode: 'scroller', //日期选择模式
		            lang:'zh',
		            dateFormat: 'yyyy年mm月dd日',
		            dateOrder:'yymmdd',
		            startYear:(new Date('1980/1/1')).getFullYear(), //开始年份
		            endYear:currYear , //结束年份
		            onSelect:function(valueText,inst){
		                user.birth=valueText.replace(/年|月/g,'-').replace(/日/,'')+' 00:00:00';
		            }
		        };

		        $("#pick_date").val('').scroller('destroy').scroller($.extend(opt['date'], opt['default']));
		        var optDateTime = $.extend(opt['datetime'], opt['default']);
		        var optTime = $.extend(opt['time'], opt['default']);
		        $("#pick_date").mobiscroll(optDateTime).datetime(optDateTime);
		        $("#pick_date").mobiscroll(optTime).date(optTime);

		        //下面注释部分是上面的参数可以替换改变它的样式
		        //希望一起研究插件的朋友加我个人QQ也可以，本人也建个群 291464597 欢迎进群交流。哈哈。这个不能算广告。
		        // 直接写参数方法
		        //$("#scroller").mobiscroll(opt).date();
		        // Shorthand for: $("#scroller").mobiscroll({ preset: 'date' });
		        //具体参数定义如下
		        //{
		        //preset: 'date', //日期类型--datatime --time,
		        //theme: 'ios', //皮肤其他参数【android-ics light】【android-ics】【ios】【jqm】【sense-ui】【sense-ui】【sense-ui】
		        //【wp light】【wp】
		        //mode: "scroller",//操作方式【scroller】【clickpick】【mixed】
		        //display: 'bubble', //显示方【modal】【inline】【bubble】【top】【bottom】
		        //dateFormat: 'yyyy-mm-dd', // 日期格式
		        //setText: '确定', //确认按钮名称
		        //cancelText: '清空',//取消按钮名籍我
		        //dateOrder: 'yymmdd', //面板中日期排列格
		        //dayText: '日',
		        //monthText: '月',
		        //yearText: '年', //面板中年月日文字
		        //startYear: (new Date()).getFullYear(), //开始年份
		        //endYear: (new Date()).getFullYear() + 9, //结束年份
		        //showNow: true,
		        //nowText: "明天",  //
		        //showOnFocus: false,
		        //height: 45,
		        //width: 90,
		        //rows: 3}

		    });
		var user={};
		//var notNeed = FastClick.notNeeded(document.body);
		//$.fn.triggerFastClick=function(){
		//    this.trigger("click");
		//    if(!notNeed){
		//        this.trigger("click");
		//    }
		//}


		function getUserInfo(){

		    $.ajax({
		        url:''+'/doct-openapi'+'/wechat/common/getWechatUserInfo.jhtml',
		        type:"GET",
		        dataType:"json",
		        success:function(data){
		            switch (data.code){
		                case 0:
		                    $('.pic img').attr({'src':data.content.headurl})
		                    $('#changeName .value').text(data.content.name);
		                    var genderText='';
		                    if(data.content.gender ==1){
		                        $('#male').addClass('current').siblings().removeClass('current');
		                        genderText='男';
		                        user.gender=1
		                    }else{
		                        $('#female').addClass('current').siblings().removeClass('current');
		                        genderText='女';
		                        user.gender=0
		                    }
		                    $('#changeGender .value').text(genderText);

		                    var birth = data.content.birth;
		                    if(birth==null){
		                        $('#pick_date').attr({'placeholder':''});
		                        user.birth='1980年1月1日';
		                        birth='1980年1月1日';
		                    }else{
		                        var year = birth.slice(0,4);
		                        var month = birth.slice(5,7);
		                        var day = birth.slice(8,10);

		                        var output = year+'年'+month+'月'+day+'日';
		                       birth= year+'年'+month+'月'+day+'日';
		                        $('#pick_date').attr({'placeholder':output});
		                        user.birth=birth;
		                    }

		                    var requestDate = new Date( birth.replace(/年|月/g,'/').replace(/日/g,''));
		                    $("#pick_date").scroller('setDate', requestDate, true);

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
		                    break;
		            }
		        }
		    })








		}

		/**
		 * 显示昵称修改弹窗
		 * */
		function showModifyName(){
		    $('.modify_name').show().siblings().hide();
		    $('.modify_mask').fadeIn(300)
		}
		/**
		 * 显示修改性别弹窗
		 * */
		function showModifyGender(){
		    $('.modify_gender').show().siblings().hide();
		    $('.modify_mask').fadeIn(300)
		}
		function modify_gender(event){

		    var target = event.target;
		    $(target).addClass('current').siblings().removeClass('current');
		    var gender =$(target).attr('data-value');
		    user.gender=gender;
		    if(gender==1){
		        $('#changeGender .value').text('男');
		    }else{
		        $('#changeGender .value').text('女');
		    }
		    hideMask()
		}


		/**
		 *上传头像
		 * */
		$('.header .pic  img,#uploadImg').on('click',function(e){
		    e.preventDefault();
		    $("#file").trigger('click')
		})
		$('#pick_date ').siblings('i').on('click',function(e){
		    e.preventDefault();
		    $("#pick_date").mobiscroll('show')
		});


		$('#file').ajaxfileupload({
		    action:''+'/doct-openapi'+"/api/mutual/upload.jhtml",
		    params: {
		        fileType: 'image',
		        submit_button:document.getElementById('file')
		    },
		    onStart: function( data ) {
		        createLoading('上传中...')
		        console.log(data.submit_button.files[0])
		        var size = data.submit_button.files[0].size;
		        var translateBase = 2097152;//2M -> 字节数
		        if(size>translateBase){
		            $(this).val('');
		            $('.mask').fadeOut(300,function(){
		                $('.mask').empty();
		                createToast('头像大小不能超过2M');
		            });
		        }
		    },
		    onComplete: function(data) {
		        //上传头像处理
		        //switch(data.code){
		        //    case 0:
		        //        $('.mask').empty().fadeOut(300);
		        //        $('.pic img').attr({'src': 'http://www.hellodoctor.com.cn/' + data.content.url});
		        //        break;
		        //    case 0:
		        //        $('.mask').empty().fadeOut(300);
		        //        $('.pic img').attr({'src': 'http://www.hellodoctor.com.cn/' + data.content.url});
		        //        break;
		        //    case 0:
		        //        $('.mask').empty().fadeOut(300);
		        //        $('.pic img').attr({'src': 'http://www.hellodoctor.com.cn/' + data.content.url});
		        //        break;
		        //}
		        if(data.status==false){                 //上传文件格式错误
		            $(this).val('');
		            createToast(data.message.content)
		        }else if(data.code ==10010){
		            //图片过大


		        }else if(data.code==0){
		            $('.mask').empty().fadeOut(300);
		            $('.pic img').attr({'src': 'http://www.hellodoctor.com.cn/' + data.content.url});
		        }
		    }
		});

		/**
		 * 修改用户信息
		 * */
		function submit( imagePath,name,gender,birth ){
		    var birthTemp  = new Date(birth.replace(/-/g,'/')).getTime();
		    var now = new Date().getTime();
		    console.log(birthTemp);
		    if(birthTemp>now){
		        createToast('选择生日日期不能超过今天哦')
		    }else{
		        $.ajax({
		            url:''+'/doct-openapi'+'/api/user/user_detail_info_modify.jhtml',
		            type:"POST",
		            dataType:"json",
		            data:{
		                imagePath:imagePath,
		                name:name,
		                gender:gender,
		                birth:birth
		            },
		            beforeSend: function(request) {
		                createLoading('加载中');
		                request.setRequestHeader("token",readCookie('token'));
		            },
		            success:function(data){
		                switch (data.code){
		                    case 0:
		                        $('.loading_img').css({
		                            background:'url("img/succ.png") no-repeat center',
		                            backgroundSize:'contain'
		                        });
		                        $('.loading .tips').text('修改成功');
		                        $('.mask').fadeOut(1000);
		                        break;
		                    case 80007:
		                        break;
		                    default:
		                        $('.mask').fadeOut(300,function(){
		                            $('#loading').remove();
		                        });
		                        break;
		                }
		            }
		        })
		    }

		}
		/**
		 * 页面初始化
		 * */
		function pageInit(){
		    getUserInfo()
		}
		/**
		 * 隐藏弹窗
		 * */
		function hideMask(){
		    $('.modify_mask').fadeOut(300);
		    $('.modify_mask input').val('');
		}
		$('#female,#male').on('click',function(e){
		    modify_gender(e)
		});
		$('#cancel_gender,#cancel_modify').on('click',function(){
		    hideMask()
		});
		$('#changeGender').on('click',function(){
		    showModifyGender();
		});
		$('#changeName').on('click',function(){
		    showModifyName();
		});


		$('#save').on('click',function(){
		    var name = $('#changeName .value').text().trim();
		    var gender = user.gender;
		    var imagePath=  $('.pic img').attr('src').replace( 'http://www.hellodoctor.com.cn/','');
		    var birth = user.birth;
		    if(name!==''){
		        if(birth==''){
		            createToast('生日不能为空');
		        }else{
		            submit(imagePath,name,gender,birth)
		        }
		    }else{
		        createToast('昵称不能为空');
		    }


		});

		$('#sure_modify').on('click',function(){
		    var NAME= /^[\s\u4e00-\u9fa5a-zA-Z0-9]{1,16}$/;
		    if($('#newName').val()==''){
		        createToast('昵称不能为空');
		    }else{
		        if(NAME.test($('#newName').val())==true){
		            $('#changeName .value').text($('#newName').val());
		            hideMask();
		            user.name= $('#newName').val()
		        }else{
		            createToast('请输入1~16位汉字、数字、字母')
		        }
		    }
		});
		pageInit();

    }

    return vueComponent;
 });