
var GiantCanvas = function () {
	var nWidth = 0,
		cWidth = 0,
		cHeight = 0,
		iWidth = 0,
		iHeight = 0,
		canvas = null,
		navigator = null,
		ctx = null,
		rect = null,
		appearSize = 100
	var x = 0,
	 	y = 0,
	 	prevX = 0,
	 	prevY = 0,
	 	scale = 1,
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

document.querySelector('.file').onchange = function (e) {
	var file = this.files[0]
	imgSrc = (window.URL || window.webkitURL).createObjectURL(file);
	gc.setImage(imgSrc)
}

//render(currP.x, currP.y)

/*function render(x, y) {
	ctx.clearRect(0,0,width,height)
	ctx.drawImage(img, x, y, width, height, 0, 0, width, height)
}

function handleDrag (e) {
	var p = calculateChange(e, canvas)
	var offsetX = p.x - prevP.x 
	var offsetY = p.y - prevP.y
	currP.x = currP.x - offsetX
	currP.y = currP.y - offsetY
	render(currP.x, currP.y)
	prevP = p
}

function handleMouseDown (e) {
	prevP = calculateChange(e, canvas)
	window.addEventListener('mousemove', handleDrag)
	window.addEventListener('mouseup', handleMouseUp)
}

function handleMouseUp (e) {
	window.removeEventListener('mousemove', handleDrag)
	window.removeEventListener('mousemove', handleMouseUp)
}

canvas.addEventListener('mousedown', handleMouseDown)




function enhanceImage (img) {
	this.x = 0
	this.y = 0
	this.Img = new Image() 
	this.Img.src = img                                                                                                                               

	document.querySelector('.navigator').appendChild(this.Img)
}
var i = new enhanceImage('./ship.jpg')

function navigator (x, y, w, h) {
	this.rectW = w
	this.rectH = h 
	this.x = x
	this.y = y
}
*/
