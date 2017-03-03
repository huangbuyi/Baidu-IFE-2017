/*
* Author: 4bin
* Email: huang4bin@gmail.com
* Blog: http://4bin.cn
* License: MIT
*/
// todo：搞清楚组件的属性、状态、配置项，以及它们之间的关系。
var GiantCanvas = function () {
	var // 导航器宽度
		nWidth = 0,
		// 画布宽度
		cWidth = 0,
		// 画布高度
		cHeight = 0,
		// 图片宽度
		iWidth = 0,
		// 图片高度
		iHeight = 0,
		// 画布element
		canvas = null,
		// 导航器element
		navigator = null,
		// 缩放比例面板
		scalePanel = null,
		// 画布上下文
		ctx = null,
		// 导航器画布
		nCtx = null,
		// 导航器方框
		rect = null,
		// 图片拖拽至边缘的最小显示
		appearSize = 100,
		// 缩放步进
		scaleStep = 0.1,
		// 最小缩放比例
		minScale = 0.0008,
		// 最大缩放比例
		maxScale = 32
	var // 图片在画布中的横坐标
		x = 0,
		// 图片在画布中的纵坐标
	 	y = 0,
	 	// 拖动过程中，鼠标前一次移动位置的横坐标
	 	prevX = 0,
	 	// 拖动过程中，鼠标前一次移动位置的纵坐标
	 	prevY = 0,
	 	// 缩放比例
	 	scale = 1,
	 	// 图片element
	 	image = null,
	 	// ★★ 存储图像数据的画布
	 	bCanvas = null,
	 	// 存储图像数据画布的上下文
	 	bCtx = null

	var features = {
		dragOn: false,
		cutoutOn: false
	}

	function initial (can, nav, panel) {
		ctx = can.getContext('2d')
		cWidth = can.clientWidth
		cHeight = can.clientHeight
		navigator = nav
		scalePanel = panel
		canvas = can
		rect = document.createElement('div')
		rect.className = 'navWindow'
		navigator.appendChild(rect)
		canvas.addEventListener('mousedown', handleMouseDown)
		canvas.addEventListener('mousewheel', handleMouseWheel)
		navigator.addEventListener('click', handleNavigatorClick)
	}

	function setImage (src) {                                                                                                                                                                                                                                                                                                        
		image = new Image()
		image.src = src 
	
		image.addEventListener('load', function () {
			iWidth = image.width
			iHeight = image.height

			var nCanvas = document.createElement('canvas')
			nCtx = nCanvas.getContext('2d')
			nCanvas.style.display = 'block'
			nWidth = nCanvas.width = parseInt(navigator.getBoundingClientRect().width)
			nCanvas.height = nWidth * iHeight / iWidth
			navigator.appendChild(nCanvas)
			
			bCanvas = document.createElement('canvas')
			bCanvas.width = iWidth
			bCanvas.height = iHeight
			bCanvas.style.display = 'none'
			bCtx = bCanvas.getContext('2d')
			bCtx.drawImage(image,0,0,iWidth,iHeight)
			document.body.appendChild(bCanvas)

			scale = 1
			setXY(0, 0)
		})
	}

	function setFeatures(f, bool) {
		// todo 验证输入
		features[f] = !!bool
	}

	function update () {
		ctx.clearRect(0, 0, cWidth, cHeight)
		nCtx.clearRect(0, 0, nWidth, nWidth*iHeight/iWidth)

		// 将导航器方框区域绘制到画布。
		// Debug：这里ie有个bug，第二个和第三个参数不能小于0
		ctx.drawImage(bCanvas, -x/scale, -y/scale, cWidth/scale, cHeight/scale, 0, 0, cWidth, cHeight)	
		nCtx.drawImage(bCanvas, 0, 0, iWidth, iHeight, 0, 0, nWidth, nWidth*iHeight/iWidth)
		rect.style.left = -x * nWidth / (iWidth * scale) + 'px'
		rect.style.top = -y * nWidth / (iWidth * scale) + 'px'

		var width = nWidth * cWidth / iWidth / scale
		if( width !== Number(rect.style.width)){
			rect.style.width = width + 'px'
			rect.style.height = width * cHeight / cWidth + 'px'
		}
		scalePanel.innerText = (scale * 100).toFixed(2) + '%'
	}

	function handleDrag (e) {
		var p = calculateChange(e, canvas)
		var offsetX = (p.x - prevX) 
		var offsetY = (p.y - prevY)
		setXY(x + offsetX, y + offsetY)
		prevX = p.x 
		prevY = p.y
	}

	function handleMouseDown (e) {
		var prevP = calculateChange(e, canvas)
		prevX = prevP.x 
		prevY = prevP.y
		
		features.cutoutOn && cutout((prevP.x - x)/scale, (prevP.y - y)/scale)

		if( features.dragOn ) {
			window.addEventListener('mousemove', handleDrag)
			window.addEventListener('mouseup', handleMouseUp)
		}
	}
		

	function handleMouseUp (e) {
		window.removeEventListener('mousemove', handleDrag)
		window.removeEventListener('mousemove', handleMouseUp)
	}

	function handleNavigatorClick (e) {
		var p = calculateChange(e, navigator)
		var tmpX = cWidth / 2 - iWidth * scale * p.x / nWidth
		var tmpY = cHeight / 2 - iWidth * scale * p.x / nWidth * p.y / p.x  
		setXY(tmpX, tmpY)
	}

	function handleMouseWheel (e) {
		var wd = e.wheelDelta
		var newScale = scale * (1 + (wd > 0 ? scaleStep : -scaleStep))
		newScale = newScale < minScale ? minScale : newScale
		newScale = newScale > maxScale ? maxScale : newScale
		if( newScale !== scale ){
			var p = calculateChange(e, canvas)
			var newX = (x - p.x) * newScale / scale + p.x
			var newY = (y - p.y) * newScale / scale + p.y
			scale = newScale
			setXY(newX , newY)
		}	
	}

	function setXY (vx, vy) {
		// 防止图片被拖出画布
		if(vx < appearSize - iWidth * scale) {
			x = appearSize - iWidth * scale
		} else if (vx > cWidth - appearSize) {
			x = cWidth - appearSize 
		} else {
			x = vx
		}
		if(vy < appearSize - iHeight * scale) {
			y = appearSize - iHeight * scale
		} else if (vy > cHeight - appearSize) {
			y = cHeight - appearSize
		} else {
			y = vy
		}
		update()
	}

	/* 计算鼠标事件相对容器的位置 */
	function calculateChange(e, container, skip) {
	  !skip && e.preventDefault()
	  const containerWidth = container.clientWidth
	  const containerHeight = container.clientHeight
	  const x = typeof e.pageX === 'number' ? e.pageX : e.touches[0].pageX
	  const y = typeof e.pageY === 'number' ? e.pageY : e.touches[0].pageY
	  let left = x - (container.getBoundingClientRect().left + window.pageXOffset)
	  let top = y - (container.getBoundingClientRect().top + window.pageYOffset)

	  if (left < 0) {
	    left = 0
	  } else if (left > containerWidth) {
	    left = containerWidth
	  }
	  if (top < 0) {
	    top = 0
	  } else if (top > containerHeight) {
	    top = containerHeight
	  }

	  return {
	    x: left,
	    y: top
	  }
	}

	function cutout(ix, iy) {
		var tolerance = 10
		var imageData = bCtx.getImageData(ix,iy,50,50)
		for(var i=0,len=imageData.data.length; i < len; i++) {
			imageData.data[i] = 0
		}
		bCtx.putImageData(imageData,ix,iy)	
		update()
	}

	return {
		initial: initial,
		setImage: setImage,
		setFeatures: setFeatures
	}
}




