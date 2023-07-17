let currentImageIndex = 0
let currentRotationIndex = 0
const maxImages = 29
const maxRotations = 3
let startX = 0
let startY = 0
let threshold = 100
let deltaYInterpolation = 0
let interpolationStep = 0.05
let currentScale = 1
const scaleStep = 0.25
let isAnimating = false
let intervalId
const image = document.getElementById('image')
const playPauseButton = document.getElementById('play-pause-button')
const iconElement = playPauseButton.querySelector('i')

function previousImage() {
	currentImageIndex = (currentImageIndex - 1 + maxImages) % maxImages
	updateImage()
}

function nextImage() {
	currentImageIndex = (currentImageIndex + 1) % maxImages
	updateImage()
}

function rotateDown() {
	currentRotationIndex = (currentRotationIndex - 1 + maxRotations) % maxRotations
	updateImage()
}

function rotateUp() {
	currentRotationIndex = (currentRotationIndex + 1) % maxRotations
	updateImage()
}

function zoomIn() {
	if (currentScale < 2) {
		currentScale += scaleStep
		applyScale()
	}
}

function zoomOut() {
	if (currentScale > 1) {
		currentScale -= scaleStep
		applyScale()
	}
}

function applyScale() {
	image.style.transform = 'scale(' + currentScale + ')'
}

function toggleAnimation() {
	if (!isAnimating) {
		isAnimating = true
		intervalId = setInterval(function () {
			currentImageIndex = (currentImageIndex + 1) % maxImages
			updateImage()
			applyScale()
		}, 200)
		iconElement.classList.remove('ti-player-play-filled')
		iconElement.classList.add('ti-player-pause-filled')
	} else {
		clearInterval(intervalId)
		isAnimating = false
		applyScale()
		iconElement.classList.remove('ti-player-pause-filled')
		iconElement.classList.add('ti-player-play-filled')
	}
}

function updateImage() {
	image.src =
		'jelonek/jelonek-glowa-row-0' +
		(currentRotationIndex + 1) +
		(currentImageIndex + 1 < 10 ? '_00' : '_0') +
		(currentImageIndex + 1) +
		'.jpg'
	image.style.transform = 'none'
}

function handleTouchStart(event) {
	startX = event.touches[0].clientX
	startY = event.touches[0].clientY
}

function handleTouchMove(event) {
	let currentX = event.touches[0].clientX
	let currentY = event.touches[0].clientY

	let deltaX = startX - currentX
	let deltaY = startY - currentY

	if (Math.abs(deltaX) >= threshold && Math.abs(deltaY) <= threshold) {
		if (deltaX > 0) {
			previousImage()
		} else {
			nextImage()
		}
	} else if (Math.abs(deltaY) >= threshold && Math.abs(deltaX) <= threshold) {
		deltaYInterpolation += deltaY * interpolationStep
		let roundedDeltaY = Math.round(deltaYInterpolation)

		if (roundedDeltaY >= threshold) {
			rotateUp()
			deltaYInterpolation = 0
		} else if (roundedDeltaY <= -threshold) {
			rotateDown()
			deltaYInterpolation = 0
		}
	}
}

function handleMouseDown(event) {
	startX = event.clientX
	startY = event.clientY
}

function handleMouseMove(event) {
	let currentX = event.clientX
	let currentY = event.clientY

	let deltaX = startX - currentX
	let deltaY = startY - currentY

	if (Math.abs(deltaX) >= threshold && Math.abs(deltaY) <= threshold) {
		if (deltaX > 0) {
			previousImage()
		} else {
			nextImage()
		}
	} else if (Math.abs(deltaY) >= threshold && Math.abs(deltaX) <= threshold) {
		deltaYInterpolation += deltaY * interpolationStep
		let roundedDeltaY = Math.round(deltaYInterpolation)

		if (roundedDeltaY >= threshold) {
			rotateUp()
			deltaYInterpolation = 0
		} else if (roundedDeltaY <= -threshold) {
			rotateDown()
			deltaYInterpolation = 0
		}
	}
}

function handleMouseUp() {
	startX = 0
	startY = 0
	deltaYInterpolation = 0
}

image.addEventListener('touchstart', handleTouchStart, false)
image.addEventListener('touchmove', handleTouchMove, false)
image.addEventListener('mousedown', handleMouseDown, false)
image.addEventListener('mousemove', handleMouseMove, false)
image.addEventListener('mouseup', handleMouseUp, false)
image.addEventListener('dragstart', function (event) {
	event.preventDefault()
})
