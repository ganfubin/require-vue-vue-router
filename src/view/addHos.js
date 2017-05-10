define(['text!temple/addHos.html','css!assets/css/addHos.css', 'vue', 'common', 'py'],
    function(sTpl, css, Vue, common, pinyin){
        var vueComponent = Vue.extend({
            template: sTpl,
            data:function(){
                return {
                    indexList:[],
		            list:{},
		            myHos:[]
                }
            },
            mounted: function(){
                this.$nextTick(function(){
                    var _vm = this;
                    var $dom = $(_vm.$el);
                    _vm.$dom = $dom;
                    _vm.token = common.readCookie('token');
                    _vm.init();
                })
            },
            methods:{
            	init: function(){
            		this.getHosList();
            	},
                jump:function(item){
                	 var _vm = this;
		            if(_vm.myHos.indexOf(item.id)>=0){
		            	this.$router.push({path:'hosDetail',query: {cid: item.id,s: 0, t: 1}});
		            }else{
		            	this.$router.push({path:'hosDetail',query: {cid: item.id,s: 1, t: 1}});
		            }
		        },
		        indexed:function( obj ){
		            console.log(obj);
		            if(obj=='#'){
		                window.scrollTo(0,44)
		            }else{
		                window.scrollTo(0,$('#'+obj).offset().top)
		            }
		        },
		        getAddress:function( data ){
		            var areaAddress = data.areaAddress==null?'':data.areaAddress;
		            var address = data.address==null?"":data.address;
		            var result = areaAddress+address;
		            if(result==''){
		                return '未填写'
		            }else{
		                return result
		            }
		        },
		        getHosList: function(){
		        	var _vm = this;
		        	$.ajax({
			            url:''+'/doct-openapi'+'/api/company/get_all.jhtml',
			            type:'POST',
			            dataType:'json',
			            beforeSend:function(request){
			                request.setRequestHeader("token", _vm.token);
			            },
			            success:function( data){
			                switch (data.code){
			                    case 0:
			                        _vm.createList(data.content);
			                        _vm.getMyHosList();
			                        break;
			                    case 80007:
			                    	_vm.$router.push('login');
			                        break;
			                    case 80006:
			                        _vm.$router.push('login');
			                        break;
			                    default:
			                        break;
			                }
			            },
			            error:function(err){}
			        })
		        },
		        createList: function(content){
		        	var _vm = this;
			        var indexList = [];
				    var hos_list;
				    var cache ={};
				    var len = content.length;
				    for(var i =0;i<len;i++){
				        var firststr = pinyin.getFullChars(content[i].companyName)[0];
				        var reg =/[a-zA-Z]/;
				        //过滤首字母非单词
				        if(!reg.test(firststr)){
				            firststr='#'
				        }
				        if(indexList.indexOf(firststr.toUpperCase())<0){
				            indexList.push(firststr)
				        }
				        //查找分区数据数组
				        if(cache[firststr.toUpperCase()]){
				            cache[firststr.toUpperCase()].push(content[i])
				        }else{
				            cache[firststr.toUpperCase()]=[];
				            cache[firststr.toUpperCase()].push(content[i])
				        }
				    };

				        _vm.indexList = indexList.sort();
				    	//生成列表索引值
				        _vm.list = _vm.objKeySort(cache);
				        $('#loading').remove();
				    	$('.mask').empty().fadeOut(300);
		        },
		        getMyHosList: function(){
		        	var _vm = this;
		        	$.ajax({
				        url:''+'/doct-openapi'+'/api/company/get_myhospitals.jhtml',
				        type:'POST',
				        dataType:'json',
				        beforeSend:function(request){
				            common.createLoading('加载中');
				            request.setRequestHeader("token",_vm.token);
				        },
				        success:function( data){
				            switch (data.code){
				                case 0:
				                    $.each(data.content,function(i,v){
				                        _vm.myHos.push(v.id);
				                    });
				                    $('#loading').remove();
				                    break;
				                case 80007:
				                    _vm.$router.push('login');
				                    break;
				                case 80006:
				                    _vm.$router.push('login');
				                    break;
				                default:
				                    break;
				            }
				        },
				        error:function(err){}
				    })
		        },
		        objKeySort: function(obj){
		        	var newkey = Object.keys(obj).sort();
			        //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
			        var newObj = {};//创建一个新的对象，用于存放排好序的键值对
			        for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
			            newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
			        }
			        return newObj;//返回排好序的新对象
		        },
		        backToMyHos: function(){
		        	var _vm = this;
		        	if(_vm.myHos.length==0){
		                window.close();
		            }else{
		                if(common.getUrlParam('type') == 1){
		                     _vm.$router.push('cure');
		                }else{
		                   _vm.$router.push('myhos');

		                }

	            }
		        }
            }
        });
        return vueComponent;
});