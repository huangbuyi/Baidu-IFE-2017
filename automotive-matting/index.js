let gc = new GiantCanvas()
var rEle = document.querySelector('.r')
var gEle = document.querySelector('.g')
var bEle = document.querySelector('.b')
var aEle = document.querySelector('.a')
var xEle = document.querySelector('.x')
var yEle = document.querySelector('.y')

// 初始化画布
gc.initial({
	canvas: document.querySelector('.canvas'), 
	navigator: document.querySelector('.navigator'),
	scalePanel: document.querySelector('.scalePanel'),
	onClick: function (v) {
		rEle.value = v.color.r
		gEle.value = v.color.g
		bEle.value = v.color.b
		aEle.value = v.color.a
		xEle.value = v.x 
		yEle.value = v.y
	}
})

// 设置图片
gc.setImage('./test.jpg')

// 加载本地图片
document.querySelector('.file').onchange = function (e) {
	var file = this.files[0]
	imgSrc = (window.URL || window.webkitURL).createObjectURL(file);
	gc.setImage(imgSrc)
}

document.querySelector('.dragOn').onclick = function (e) {
	if( this.className.indexOf('tool-on') > -1 ) {
		this.className = this.className.replace('tool-on', 'tool')
		gc.setFeatures('dragOn', false)
	} else {
		this.className = this.className.replace('tool', 'tool-on')
		gc.setFeatures('dragOn', true)
	}
}

document.querySelector('.cutoutOn').onclick = function (e) {
	if( this.className.indexOf('tool-on') > -1 ) {
		this.className = this.className.replace('tool-on', 'tool')
		gc.setFeatures('cutoutOn', false)
	} else {
		this.className = this.className.replace('tool', 'tool-on')
		gc.setFeatures('cutoutOn', true)
	}
}

document.querySelector('.tolerance').onchange = function (e) {
	gc.setFeatures('tolerance', e.target.value)
}

// todo 画布点击事件冒泡
// todo 返回原图，撤销抠图操作