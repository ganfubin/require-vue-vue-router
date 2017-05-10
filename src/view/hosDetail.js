define(['text!temple/hosDetail.html','css!assets/css/module/hosDetail.css', 
		'vue', 'common', 'component/loading/loading',  'component/alertModel/alertModel'],
    function(sTpl, css, 
    		Vue, common, cmptLoading, cmptAlertModel){
        var vueComponent = Vue.extend({
            template: sTpl,
            components: {
	            cmptLoading,
	            cmptAlertModel
	        },
            data:function(){
                return {
                	query : {},
                	baseInfo: {
                		cName: '--',
			        	realAddress: '--',
			        	memo: '--',
			        	logoSrc: ''
                	},
                	pointInfo: {
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
	                loding: true,
	                bindToggle: true,
	                alertShow: false,
	                alertOption: {},
	                isStatus: false,
	                isTop: false
                }
            },
            mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    _vm.query = _vm.$route.query;
                    _vm.token = common.readCookie('token');
                    _vm.isTop = _vm.query.t;
                    _vm.init(_vm.query || {});
                })
            },
            methods:{
				init: function(query){
					var _vm = this;
					var cid = query.cid || '';
					_vm.getHosById(cid);

				},
				getHosById: function(cid){
					var _vm = this;
					$.ajax({
			            url:'/doct-openapi/api/company/getCompanyInfoById.jhtml',
			            type:'GET',
			            dataType:'json',
			            data:{
			                id:cid
			            },
			            beforeSend: function (request) {
			                request.setRequestHeader("token", _vm.token);
			            },
			            success: function (data) {
			                switch (data.code){
			                    case 0:
			                        _vm.getGuardAccountInfo(cid, data.content);
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
				},
				getGuardAccountInfo: function(cid, content){
					var _vm = this;
					$.ajax({
			            url:'/doct-openapi/api/guardApi/getGuardAccountInfo.jhtml',
			            type:'GET',
			            dataType:'json',
			            data:{
			                companyId:cid
			            },
			            beforeSend: function (request) {
			                request.setRequestHeader("token", _vm.token);
			            },
			            success: function (data) {
			                switch (data.code){
			                    case 0:
			                        _vm.pageInit(content, data.content);
			                        break;
			                    case 80007:
			                        break;
			                    default:
			                        _vm.pageInit(content);
			                        break;
			                }
			            },
			            error: function (err) {
			                console.log(err)
			            }
			        })
				},
				pageInit: function(data, info){
					var _vm = this;
					var logoSrc = 'http://www.hellodoctor.com.cn/'+data.logo;
			        var cName = data.companyName;
			        var areaAddress = data.areaAddress == null ? '' : data.areaAddress;
			        var address = data.address == null ? "" : data.address;
			        var realAddress = areaAddress+address;
			        var memo = data.memo == null ? '未填写' : data.memo;
			        _vm .baseInfo = {
			        	cName: cName,
			        	realAddress: realAddress,
			        	memo: memo,
			        	logoSrc: logoSrc
			        }

			        if(info) {
			            var balance = info.Deposit + '';
			            var vouncher = info.Coupon + '';
			            var point = info.Point + '';
			            var balanceInt, balanceDec, vouncherInt, vouncherDec, pointInt, pointDec;
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

			            _vm.pointInfo = {
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
			        }
			        switch (_vm.query.s){
			            case '1':
			            	_vm.bindToggle = true;
			            	_vm.isStatus = false;
			                _vm.loding = false;
			                break;
			            default:
			            	_vm.bindToggle = false;
			            	_vm.isStatus = true;
			                _vm.loding = false;
			                break;
			        }
				},
				routerLink: function($event){
	                var $this = $($event.currentTarget);
	                var url = $this.data('url');
	                var parm = $this.data('parm');
	                var _vm = this;
	                if(parm){
	                    url && this.$router.push({path: url,query: _vm.query});
	                 }else{
	                    url && this.$router.push(url);
	                 }
	            },
	            bindHos: function(){
	            	var _vm = this;
	            	_vm.alertOption = {
	            		title: '绑定提示',
	            		content: '您确定要绑定'+_vm.baseInfo.cName +'?',
	            		sureText: '确定',
	            		cancelText: '取消',
	            		success: _vm.alertOk
	            	}
	            	_vm.alertShow = true;
	            },
	            alertOk: function(){
	            	var _vm = this;
	            	var cid = _vm.query.cid;
				    $.ajax({
				        url:''+'/doct-openapi'+'/api/company/focus.jhtml',
				        type:'POST',
				        dataType:'json',
				        data:{
				            companyId:cid
				        },
				        beforeSend:function(request){
				            //createLoading('申请中');
				            request.setRequestHeader("token", _vm.token);
				        },
				        success:function( data){
				            switch (data.code){
				                case 90006:
				                    bindFail();
				                    break;
				                case 0:
					                _vm.alertOption = {
					            		title: '绑定成功',
					            		content: '',
					            		sureText: '确定',
					            		cancelText: '取消'
					            	}
					            	_vm.alertShow = true;
				                    break;
				                default :
				                    break
				            }
				        },
				        error:function(err){}
				    })
	            },
	            setIsTop: function($event){
	            	var _vm = this;
	            	var cid = this.query.cid,
	            		isTop = this.query.t;
	            	var $this = $($event.currentTarget);
	            	_vm.isTop  = !_vm.isTop;
	            	$.ajax({
				        url:''+'/doct-openapi'+'/api/company/setCompanyTop.jhtml',
				        type:'POST',
				        dataType:'json',
				        data:{
				            companyId: cid,
				            isTop: isTop
				        },
				        beforeSend:function(request){
				            //createLoading('切换医院置顶中');
				            _vm.$spin.show('切换医院置顶中');
				            request.setRequestHeader("token", _vm.token);
				        },
				        success:function( data){
				        	 _vm.$spin.hide();
				            switch (data.code){
				                case 90006:
				                    break;
				                case 0:
				                    break;
				                case 80007:
				                	_vm.$router.push('login');
				                    break;
				                case 80006:
				                	_vm.$router.push('login');
				                    break;
				                default :
				                    break;


				            }
				        },
				        error:function(err){}
				    })
	            },
	            back: function(){
	            	var _vm = this;
	            	var type =  _vm.query.t;
	            	if(type==1){
	            		_vm.$router.push('addHos');
				    }else{
				    	_vm.$router.push('myhos');
				    }
	            }
            }
        });

    return vueComponent;
})