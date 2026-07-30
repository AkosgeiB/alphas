/**
 * Kosgei K. Alphas - Portfolio Site Interactivity & QR Code Generator
 */

document.addEventListener("DOMContentLoaded", () => {
    // Toast Notification System
    function showToast(message, duration = 3000) {
        const toast = document.getElementById("toast");
        if (toast) {
            toast.textContent = message;
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
            }, duration);
        }
    }

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById("themeToggle");
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;
    
    // Check local storage for preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        if (themeIcon) {
            themeIcon.className = "fa-solid fa-sun";
        }
    } else {
        document.body.classList.remove("light-theme");
        if (themeIcon) {
            themeIcon.className = "fa-solid fa-moon";
        }
    }

    if (themeToggleBtn && themeIcon) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");
            const isLight = document.body.classList.contains("light-theme");
            
            if (isLight) {
                themeIcon.className = "fa-solid fa-sun";
                localStorage.setItem("theme", "light");
                showToast("Switched to Light Theme");
            } else {
                themeIcon.className = "fa-solid fa-moon";
                localStorage.setItem("theme", "dark");
                showToast("Switched to Dark Theme");
            }
            
            // Re-render QR code to match theme color
            updateQRCodeColors();
        });
    }

    // Navigation Menu Toggle for Mobile
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            const icon = navToggle.querySelector("i");
            if (navMenu.classList.contains("open")) {
                icon.className = "fa-solid fa-xmark";
            } else {
                icon.className = "fa-solid fa-bars";
            }
        });
    }

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu) navMenu.classList.remove("open");
            const icon = navToggle ? navToggle.querySelector("i") : null;
            if (icon) icon.className = "fa-solid fa-bars";
        });
    });

    // Navigation Active Link Highlighting on Scroll
    const sections = document.querySelectorAll("section");
    window.addEventListener("scroll", () => {
        let current = "";
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

    // QR Code Generation Logic
    const qrContainer = document.getElementById("qrcode");
    const qrInput = document.getElementById("qrText");
    const generateBtn = document.getElementById("btnGenerateQr");
    const downloadBtn = document.getElementById("btnDownloadQr");

    // Fallback URL if running locally or not deployed yet
    let defaultUrl = window.location.href;
    if (defaultUrl.startsWith("file://")) {
        defaultUrl = "https://akosgei.vercel.app"; // Live production domain
    }
    
    // Set default input value
    if (qrInput) {
        qrInput.value = defaultUrl;
    }

    // Initialize/Update QRCode
    let qrCodeInstance = null;
    function updateQRCodeColors() {
        if (!qrContainer) return;
        
        // Find current URL or default
        const currentUrl = qrInput ? qrInput.value.trim() : defaultUrl;
        
        // Clear container and recreate QR
        qrContainer.innerHTML = "";
        
        const isLight = document.body.classList.contains("light-theme");
        const darkColor = isLight ? "#0f172a" : "#121214";
        
        qrCodeInstance = new QRCode(qrContainer, {
            text: currentUrl || defaultUrl,
            width: 180,
            height: 180,
            colorDark: darkColor,
            colorLight: "#FFFFFF",
            correctLevel: QRCode.CorrectLevel.H
        });
    }

    // Run initial generation
    updateQRCodeColors();

    // Generate custom QR Code on button click
    if (generateBtn && qrInput) {
        generateBtn.addEventListener("click", () => {
            const customUrl = qrInput.value.trim();
            if (customUrl) {
                updateQRCodeColors();
                showToast("QR Code updated successfully!");
            } else {
                showToast("Please enter a valid URL first.");
            }
        });
    }

    // Download QR Code Image
    if (downloadBtn && qrContainer) {
        downloadBtn.addEventListener("click", () => {
            const canvas = qrContainer.querySelector("canvas");
            const img = qrContainer.querySelector("img");
            
            let dataUrl = "";
            if (canvas) {
                dataUrl = canvas.toDataURL("image/png");
            } else if (img && img.src) {
                dataUrl = img.src;
            }

            if (dataUrl) {
                const downloadLink = document.createElement("a");
                downloadLink.href = dataUrl;
                downloadLink.download = "Kosgei_K_Alphas_CV_QRCode.png";
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                showToast("Downloading QR Code Image...");
            } else {
                showToast("Error generating download image. Please try again.");
            }
        });
    }

    // Contact Form Submission Handling via Web3Forms
    const contactForm = document.getElementById("contactForm");
    const btnSubmitForm = document.getElementById("btnSubmitForm");
    
    if (contactForm && btnSubmitForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const name = document.getElementById("formName").value.trim();
            const email = document.getElementById("formEmail").value.trim();
            const subject = document.getElementById("formSubject").value.trim();
            const message = document.getElementById("formMessage").value.trim();
            
            if (!name || !email || !subject || !message) {
                showToast("Please fill in all required fields.");
                return;
            }

            const btnText = btnSubmitForm.querySelector(".btn-text");
            const btnSpinner = btnSubmitForm.querySelector(".btn-spinner");
            
            if (btnText && btnSpinner) {
                btnText.textContent = "Sending...";
                btnSpinner.classList.remove("hidden");
            }
            btnSubmitForm.disabled = true;

            const payload = {
                access_key: "ddbb2a5c-0651-4633-97b9-acc39db85a60",
                name: name,
                email: email,
                subject: subject,
                message: message,
                from_name: "Kosgei Alphas Portfolio"
            };

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    showToast("Success! Your message has been sent directly to Gmail.");
                    contactForm.reset();
                } else {
                    console.error("Web3Forms error:", data);
                    showToast("Error: " + (data.message || "Failed to send message"));
                }
            } catch (error) {
                console.error("Network error:", error);
                showToast("Something went wrong. Please try again.");
            } finally {
                if (btnText && btnSpinner) {
                    btnText.textContent = "Send Message";
                    btnSpinner.classList.add("hidden");
                }
                btnSubmitForm.disabled = false;
            }
        });
    }
});
