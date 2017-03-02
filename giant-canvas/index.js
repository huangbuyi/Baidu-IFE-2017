/*
* Author: 4bin
* Email: huang4bin@gmail.com
* Blog: http://4bin.cn
* License: MIT
*/

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
		// 画布上下文
		ctx = null,
		// 导航器方框
		rect = null,
		// 图片拖拽至边缘的最小显示
		appearSize = 100
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
	 	image = null

	function initial (can, nav) {
		ctx = can.getContext('2d')
		cWidth = can.clientWidth
		cHeight = can.clientHeight
		navigator = nav
		canvas = can
		rect = document.createElement('div')
		rect.className = 'navWindow'
		navigator.appendChild(rect)
		canvas.addEventListener('mousedown', handleMouseDown)
		navigator.addEventListener('click', handleNavigatorClick)
	}

	function setImage (src) {
		var oldImg = image                                                                                                                                                                                                                                                                                                           
		image = new Image()
		image.src = src 
	
		image.addEventListener('load', function () {
			iWidth = image.width
			iHeight = image.height
			oldImg && navigator.removeChild(oldImg)
			navigator.appendChild(image)
			nWidth = image.width
			var width = nWidth * cWidth / iWidth / scale
			rect.style.width = width + 'px'
			rect.style.height = width * cHeight / cWidth + 'px'
			setXY(0, 0)
			update()
		})
	}

	function update () {
		ctx.clearRect(0, 0, cWidth, cHeight)

		// 将导航器方框区域绘制到画布。
		// Debug：这里ie有个bug，第二个和第三个参数不能小于0
		ctx.drawImage(image, -x/scale, -y/scale, cWidth/scale, cHeight/scale, 0, 0, cWidth, cHeight)	
		rect.style.left = -x * nWidth / iWidth + 'px'
		rect.style.top = -y * nWidth / iWidth + 'px'
	}

	function handleDrag (e) {
		var p = calculateChange(e, canvas)
		var offsetX = (p.x - prevX) / scale 
		var offsetY = (p.y - prevY) / scale
		setXY(x + offsetX, y + offsetY)
		prevX = p.x 
		prevY = p.y
	}

	function handleMouseDown (e) {
		var prevP = calculateChange(e, canvas)
		prevX = prevP.x 
		prevY = prevP.y
		window.addEventListener('mousemove', handleDrag)
		window.addEventListener('mouseup', handleMouseUp)
	}

	function handleMouseUp (e) {
		window.removeEventListener('mousemove', handleDrag)
		window.removeEventListener('mousemove', handleMouseUp)
	}

	function handleNavigatorClick (e) {
		var p = calculateChange(e, navigator)
		var tmpX = cWidth / 2 - iWidth * p.x / nWidth
		var tmpY = cHeight / 2 - iWidth * p.x / nWidth * p.y / p.x
		setXY(tmpX, tmpY)
	}

	function setXY (vx, vy) {
		// 防止图片被拖出画布
		if(vx < appearSize - iWidth) {
			x = appearSize - iWidth
		} else if (vx > cWidth - appearSize) {
			x = cWidth - appearSize
		} else {
			x = vx
		}
		if(vy < appearSize - iHeight) {
			y = appearSize - iHeight
		} else if (vy > cHeight - appearSize) {
			y = cHeight - appearSize
		} else {
			y = vy
		}
		update()
	}

	return {
		initial: initial,
		setImage: setImage
	}
}

/* 计算鼠标事件相对容器的位置 */
var calculateChange = function (e, container, skip) {
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

let gc = new GiantCanvas()
gc.initial(document.querySelector('.canvas'), document.querySelector('.navigator'))
gc.setImage('./ship.jpg')

// 加载本地图片
document.querySelector('.file').onchange = function (e) {
	var file = this.files[0]
	imgSrc = (window.URL || window.webkitURL).createObjectURL(file);
	gc.setImage(imgSrc)
}

