/**
 * 扩展vue的全局方法
 */
define(['Vue', 'lodash'],function(Vue, _){

	Vue.prototype.$spin = {

		show: function(msg) {
			var msg = msg || '';
			var spinHtml = '<div class="mask spin">'
							+'<div class="loading">'
								+'<div class="loading_img"></div>'
								+'<p class="tips">'+ msg +'</p>'
							+'</div>'
						+'</div>'
			var div = document.createElement('div');
			div.innerHTML = spinHtml;
			div.classList.add('js-mask-span');
			document.body.appendChild(div);
		},
		hide: function(){
			var div = document.getElementsByClassName('js-mask-span');
			setTimeout(function(){
				document.body.removeChild(div[0])
			}, 300)
			
		}
	}


	return Vue
})