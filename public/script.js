// Theme Toggle
const themeToggle = document.getElementById("themeToggle")
const body = document.body

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem("theme") || "light"
body.setAttribute("data-theme", currentTheme)

// Update theme toggle icon
function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i")
  if (theme === "dark") {
    icon.className = "fas fa-sun"
  } else {
    icon.className = "fas fa-moon"
  }
}

updateThemeIcon(currentTheme)

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
})

// Mobile Navigation
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
})

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  })
})

// FAQ Toggle
document.querySelectorAll(".faq-question").forEach((question) => {
  question.addEventListener("click", () => {
    const faqItem = question.parentElement
    const faqAnswer = faqItem.querySelector(".faq-answer")

    // Close all other FAQ items
    document.querySelectorAll(".faq-item").forEach((item) => {
      if (item !== faqItem) {
        item.classList.remove("active")
        item.querySelector(".faq-answer").classList.remove("active")
      }
    })

    // Toggle current FAQ item
    faqItem.classList.toggle("active")
    faqAnswer.classList.toggle("active")
  })
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 70 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// Download button functionality
const downloadBtn = document.getElementById("downloadBtn")
    downloadBtn.addEventListener("click", () => {
    const downloadUrl = "https://github.com/Miki5535/SIENG_Download_For_Web/archive/refs/heads/main.zip";
    // const downloadUrl = "https://github.com/Miki5535/SIENG_Code/archive/refs/heads/main.zip";

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "SIENG_Code-main.zip"; // ชื่อไฟล์ตอนโหลด
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<i class="fas fa-check"></i> กำลังดาวน์โหลด...';
    downloadBtn.disabled = true;

    setTimeout(() => {
      downloadBtn.innerHTML = originalText;
      downloadBtn.disabled = false;
    }, 3000);
  });

// Navbar scroll effect
let lastScrollTop = 0
const navbar = document.querySelector(".navbar")

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    navbar.style.transform = "translateY(-100%)"
  } else {
    // Scrolling up
    navbar.style.transform = "translateY(0)"
  }

  lastScrollTop = scrollTop
})

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements for animation
document.querySelectorAll(".feature-card, .screenshot-card, .step, .changelog-item").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(30px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

// Add loading states
window.addEventListener("load", () => {
  document.body.classList.remove("loading")
})

// Error handling for images
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", function () {
    this.src = "/placeholder.svg?height=300&width=400"
    this.alt = "ไม่สามารถโหลดภาพได้"
  })
})

// Copy to clipboard functionality (for future use)
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      // Show success message
      console.log("Copied to clipboard")
    })
    .catch((err) => {
      console.error("Failed to copy: ", err)
    })
}

// Print functionality
function printPage() {
  window.print()
}

// Share functionality
async function shareContent() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "SIENG - Secure Incognito ENcryption Guard",
        text: "โปรแกรมปกป้องข้อมูลสำคัญด้วยเทคนิค Steganography และ Cryptography",
        url: window.location.href,
      })
    } catch (err) {
      console.log("Error sharing:", err)
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    copyToClipboard(window.location.href)
    alert("ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว")
  }
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // Press 'D' to trigger download
  if (e.key === "d" || e.key === "D") {
    if (!e.ctrlKey && !e.altKey) {
      downloadBtn.click()
    }
  }

  // Press 'T' to toggle theme
  if (e.key === "t" || e.key === "T") {
    if (!e.ctrlKey && !e.altKey) {
      themeToggle.click()
    }
  }
})

// Performance monitoring
const perfObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === "navigation") {
      console.log("Page load time:", entry.loadEventEnd - entry.loadEventStart, "ms")
    }
  })
})

if ("PerformanceObserver" in window) {
  perfObserver.observe({ entryTypes: ["navigation"] })
}

// Service Worker registration (for future PWA features)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Uncomment when you have a service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then((registration) => {
    //         console.log('SW registered: ', registration);
    //     })
    //     .catch((registrationError) => {
    //         console.log('SW registration failed: ', registrationError);
    //     });
  })
}

// Tab functionality for Usage section
document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.getAttribute("data-tab")

    // Remove active class from all buttons and contents
    document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
    document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

    // Add active class to clicked button and corresponding content
    button.classList.add("active")
    document.getElementById(targetTab).classList.add("active")
  })
})

// Update navigation to include usage section
document.querySelectorAll(".nav-link").forEach((link) => {
  if (link.getAttribute("href") === "#usage") {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const target = document.querySelector("#usage")
      if (target) {
        const offsetTop = target.offsetTop - 70
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  }
})
