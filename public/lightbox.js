// Lightbox functionality
class Lightbox {
  constructor() {
    this.modal = document.getElementById("lightboxModal")
    this.modalImg = document.getElementById("lightboxImg")
    this.captionText = document.getElementById("lightboxCaption")
    this.closeBtn = document.querySelector(".close-lightbox")
    this.prevBtn = document.querySelector(".prev")
    this.nextBtn = document.querySelector(".next")
    this.images = document.querySelectorAll(".screenshot-img")
    this.currentIndex = 0

    this.init()
  }

  init() {
    // Add click event to all screenshot images
    this.images.forEach((img, index) => {
      img.addEventListener("click", () => {
        this.openLightbox(index)
      })

      // Add loading effect
      img.addEventListener("load", () => {
        img.style.opacity = "1"
      })
    })

    // Close lightbox events
    this.closeBtn.addEventListener("click", () => {
      this.closeLightbox()
    })

    // Navigation events
    this.prevBtn.addEventListener("click", () => {
      this.showPrevImage()
    })

    this.nextBtn.addEventListener("click", () => {
      this.showNextImage()
    })

    // Close on background click
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeLightbox()
      }
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (this.modal.style.display === "block") {
        switch (e.key) {
          case "Escape":
            this.closeLightbox()
            break
          case "ArrowLeft":
            this.showPrevImage()
            break
          case "ArrowRight":
            this.showNextImage()
            break
        }
      }
    })

    // Add image counter and keyboard hint
    this.addImageCounter()
    this.addKeyboardHint()
  }

  openLightbox(index) {
    this.currentIndex = index
    this.modal.style.display = "block"
    this.modal.classList.add("show")
    document.body.style.overflow = "hidden" // Prevent background scrolling

    this.showImage()
    this.updateImageCounter()
  }

  closeLightbox() {
    this.modal.style.display = "none"
    this.modal.classList.remove("show")
    document.body.style.overflow = "auto" // Restore scrolling
  }

  showImage() {
    const img = this.images[this.currentIndex]

    // Show loading spinner
    this.showLoadingSpinner()

    // Create new image to preload
    const newImg = new Image()
    newImg.onload = () => {
      this.modalImg.src = newImg.src
      this.modalImg.alt = img.alt
      this.captionText.innerHTML = this.getImageCaption(img)
      this.hideLoadingSpinner()
    }

    newImg.onerror = () => {
      this.modalImg.src = "/placeholder.svg?height=400&width=600&text=ไม่สามารถโหลดภาพได้"
      this.modalImg.alt = "ไม่สามารถโหลดภาพได้"
      this.captionText.innerHTML = "ไม่สามารถโหลดภาพได้"
      this.hideLoadingSpinner()
    }

    newImg.src = img.src
  }

  showPrevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    this.showImage()
    this.updateImageCounter()
  }

  showNextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length
    this.showImage()
    this.updateImageCounter()
  }

  getImageCaption(img) {
    const card = img.closest(".screenshot-card")
    const title = card.querySelector("h3").textContent
    const description = card.querySelector("p").textContent
    return `<strong>${title}</strong><br>${description}`
  }

  showLoadingSpinner() {
    if (!document.querySelector(".loading-spinner")) {
      const spinner = document.createElement("div")
      spinner.className = "loading-spinner"
      this.modal.appendChild(spinner)
    }
  }

  hideLoadingSpinner() {
    const spinner = document.querySelector(".loading-spinner")
    if (spinner) {
      spinner.remove()
    }
  }

  addImageCounter() {
    const counter = document.createElement("div")
    counter.className = "image-counter"
    counter.id = "imageCounter"
    this.modal.appendChild(counter)
  }

  updateImageCounter() {
    const counter = document.getElementById("imageCounter")
    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`
    }
  }

  addKeyboardHint() {
    const hint = document.createElement("div")
    hint.className = "keyboard-hint"
    hint.innerHTML = "ใช้ ← → เพื่อเปลี่ยนภาพ | ESC เพื่อปิด"
    this.modal.appendChild(hint)
  }
}

// Initialize lightbox when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Lightbox()
})

// Preload images for better performance
function preloadImages() {
  const images = document.querySelectorAll(".screenshot-img")
  images.forEach((img) => {
    const imageObj = new Image()
    imageObj.src = img.src
  })
}

// Call preload after page load
window.addEventListener("load", preloadImages)

// Add smooth scroll behavior for better UX
function smoothScrollToScreenshots() {
  const screenshotsSection = document.getElementById("screenshots")
  if (screenshotsSection) {
    screenshotsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Add touch/swipe support for mobile
let touchStartX = 0
let touchEndX = 0

document.addEventListener("touchstart", (e) => {
  if (document.getElementById("lightboxModal").style.display === "block") {
    touchStartX = e.changedTouches[0].screenX
  }
})

document.addEventListener("touchend", (e) => {
  if (document.getElementById("lightboxModal").style.display === "block") {
    touchEndX = e.changedTouches[0].screenX
    handleSwipe()
  }
})

function handleSwipe() {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next image
      document.querySelector(".next").click()
    } else {
      // Swipe right - previous image
      document.querySelector(".prev").click()
    }
  }
}

// Add image zoom functionality within lightbox
let isZoomed = false
let zoomLevel = 1

document.addEventListener("DOMContentLoaded", () => {
  const lightboxImg = document.getElementById("lightboxImg")

  if (lightboxImg) {
    lightboxImg.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleZoom()
    })

    lightboxImg.addEventListener("wheel", (e) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      zoomLevel = Math.max(0.5, Math.min(3, zoomLevel + delta))
      lightboxImg.style.transform = `scale(${zoomLevel})`
    })
  }
})

function toggleZoom() {
  const lightboxImg = document.getElementById("lightboxImg")
  if (isZoomed) {
    lightboxImg.style.transform = "scale(1)"
    lightboxImg.style.cursor = "zoom-in"
    zoomLevel = 1
  } else {
    lightboxImg.style.transform = "scale(1.5)"
    lightboxImg.style.cursor = "zoom-out"
    zoomLevel = 1.5
  }
  isZoomed = !isZoomed
}

// Add fullscreen API support
function toggleFullscreen() {
  const modal = document.getElementById("lightboxModal")

  if (!document.fullscreenElement) {
    modal.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    document.exitFullscreen()
  }
}

// Add double-click to fullscreen
document.addEventListener("DOMContentLoaded", () => {
  const lightboxImg = document.getElementById("lightboxImg")

  if (lightboxImg) {
    lightboxImg.addEventListener("dblclick", (e) => {
      e.stopPropagation()
      toggleFullscreen()
    })
  }
})
