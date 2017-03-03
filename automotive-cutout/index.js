let gc = new GiantCanvas()
gc.initial(document.querySelector('.canvas'), document.querySelector('.navigator'),document.querySelector('.scalePanel'))
gc.setImage('./ship.jpg')

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