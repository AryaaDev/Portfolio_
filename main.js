document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".text") && window.Typed) {
        new Typed(".text", {
            strings: ["Full Stack Developer", "App Developer", "Software Engineer"],
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 1000,
            loop: true
        });
    }


    observeOnce(".about", "animate", 0.25);


    observeMultipleOnce(
        ".skills-title h2, .skills-title span, .skill",
        ["visible", "animate"],
        0.25
    );


    observeMultipleOnce(
        ".contact, .contact-text, .contact-info, .contact-list li, .contact-form",
        ["visible"],
        0.35
    );


    observeMultipleOnce(
        ".contact-text p, .contact-list li, .contact-form input, .contact-form textarea, .contact-form .send",
        ["show"],
        0.25
    );


    const footerText = document.querySelector(".footer-text");
    if (footerText) {
        const footerObserver = new IntersectionObserver(
            ([entry], obs) => {
                if (entry.isIntersecting) {
                    footerText.classList.add("show-text");
                    obs.unobserve(entry.target);
                }
            },
            { threshold: 0.4 }
        );
        footerObserver.observe(footerText);
    }


    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    if (filterButtons.length && portfolioItems.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filter = btn.dataset.filter;

                portfolioItems.forEach(item => {
                    const match = filter === "all" || item.dataset.category === filter;

                    if (match) {
                        item.style.display = "block";
                        requestAnimationFrame(() => {
                            item.style.opacity = "1";
                            item.style.transform = "translateY(0)";
                        });
                    } else {
                        item.style.opacity = "0";
                        item.style.transform = "translateY(20px)";
                        setTimeout(() => item.style.display = "none", 300);
                    }
                });
            });
        });
    }

    window.slidePortfolio = function (id, direction) {
        const slider = document.getElementById(`portfolio-slider-${id}`);
        if (!slider) return;

        const images = slider.querySelectorAll(".slider-img");
        if (!images.length) return;

        let current = [...images].findIndex(img => img.classList.contains("active"));
        if (current < 0) current = 0;

        images[current].classList.remove("active");
        const next = (current + direction + images.length) % images.length;

        images[next].classList.add("active");
    };


    observeMultipleOnce(
        ".portfolio-title h2, .portfolio-title p, .portfolio-filter, .portfolio-item",
        ["animate"],
        0.25
    );



    const softSection = document.querySelector("#SoftSkills");
    const softItems = document.querySelectorAll(".btn-box1");

    if (softSection && softItems.length) {
        const softObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    softItems.forEach((item, i) => {
                        setTimeout(() => {
                            item.classList.add("visible", "animate");
                        }, i * 120);
                    });
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        softObserver.observe(softSection);
    }


    initSkillsSlider();


    initLightbox({
        container: ".portfolio",
        modalId: "imageModal",
        imgId: "lightboxImg",
        captionId: "lightboxCaption"
    });


    initCertificateSlider();
    initLightbox({
        container: ".certificates",
        modalId: "certificateModal",
        imgId: "certificateImg",
        captionId: "certificateCaption"
    });


    observeMultipleOnce(".certificate-item", ["animate"], 0.25);


    observeOnce(".certificates-title h2", "animate", 0.5);


    const video = document.querySelector(".bg-video");
    if (video) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        video.muted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");

        const tryPlay = () => {
            const p = video.play();
            if (p) {
                p.catch(() => {
                    document.addEventListener("touchstart", () => video.play(), { once: true });
                });
            }
        };

        setTimeout(tryPlay, isIOS ? 500 : 0);

        document.addEventListener("visibilitychange", () => {
            document.hidden ? video.pause() : tryPlay();
        });
    }
});


function observeOnce(selector, className, threshold = 0.2) {
    const el = document.querySelector(selector);
    if (!el) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                el.classList.add(className);
                obs.unobserve(el);
            }
        });
    }, { threshold });

    obs.observe(el);
}

function observeMultipleOnce(selector, classes, threshold = 0.2) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                classes.forEach(c => e.target.classList.add(c));
                observer.unobserve(e.target);
            }
        });
    }, { threshold });
    elements.forEach(el => obs.observe(el));
}

function initCertificateSlider() {
    const state = {};

    document.querySelectorAll(".certificate-slider").forEach(slider => {
        const imgs = slider.querySelectorAll(".slider-img");
        if (!imgs.length) return;

        state[slider.id] = { index: 0, total: imgs.length };
        imgs.forEach((img, i) => img.classList.toggle("active", i === 0));
    });

    window.slideCertificate = function (id, dir) {
        const slider = document.getElementById(`certificate-slider-${id}`);
        if (!slider || !state[slider.id]) return;

        const imgs = slider.querySelectorAll(".slider-img");
        const s = state[slider.id];

        imgs[s.index].classList.remove("active");
        s.index = (s.index + dir + s.total) % s.total;
        imgs[s.index].classList.add("active");
    };
}


function initLightbox({ container, modalId, imgId, captionId }) {
    const scope = document.querySelector(container);
    const modal = document.getElementById(modalId);
    if (!scope || !modal) return;

    const img = modal.querySelector(`#${imgId}`);
    const caption = modal.querySelector(`#${captionId}`);
    const closeBtn = modal.querySelector(".close-lightbox");

    scope.querySelectorAll(".slider-img").forEach(el => {
        el.addEventListener("click", () => {
            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");
            img.src = el.src;
            caption.textContent = el.alt || "";
            document.body.style.overflow = "hidden";
        });
    });

    const close = () => {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    };

    closeBtn?.addEventListener("click", close);

    if (!document._lightboxEscapeBound) {
        document.addEventListener("keydown", e => e.key === "Escape" && close());
        document._lightboxEscapeBound = true;
    }
}

(function lightboxPerBoxSlider() {

    const modal = document.getElementById("imageModal");
    if (!modal) return;

    const img = modal.querySelector("#lightboxImg");
    const caption = modal.querySelector("#lightboxCaption");

    let images = [];
    let index = 0;

    const prev = document.createElement("button");
    const next = document.createElement("button");

    prev.className = "lb-nav lb-prev";
    next.className = "lb-nav lb-next";
    prev.innerHTML = "&#10094;";
    next.innerHTML = "&#10095;";

    modal.append(prev, next);

    const show = i => {
        if (i < 0 || i >= images.length) return;

        index = i;
        img.style.opacity = "0";

        requestAnimationFrame(() => {
            img.src = images[index].src;
            caption.textContent = images[index].alt || "";
            img.onload = () => img.style.opacity = "1";
        });

        prev.classList.toggle("hidden", index === 0);
        next.classList.toggle("hidden", index === images.length - 1);
    };

    document.addEventListener("click", e => {
        const clickedImg = e.target.closest(".slider-img");
        if (!clickedImg) return;

        const box = clickedImg.closest(".portfolio-item");
        if (!box) return;

        images = [...box.querySelectorAll(".slider-img")];
        index = images.indexOf(clickedImg);
        show(index);
    });

    prev.onclick = e => {
        e.stopPropagation();
        show(index - 1);
    };

    next.onclick = e => {
        e.stopPropagation();
        show(index + 1);
    };

    document.addEventListener("keydown", e => {
        if (!modal.classList.contains("show")) return;
        if (e.key === "ArrowLeft") show(index - 1);
        if (e.key === "ArrowRight") show(index + 1);
    });

})();

(() => {
    const buttons = document.querySelectorAll(".btn-cv-duotone");
    if (!buttons.length) return;

    buttons.forEach(btn => {
        const icon = btn.querySelector("i");
        if (!icon) return;

        let rafId = null;

        const animateIn = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                btn.classList.remove("icon-reset");
                btn.classList.add("icon-animate");
            });
        };

        const animateOut = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                btn.classList.remove("icon-animate");
                btn.classList.add("icon-reset");
            });
        };

const enter = "onpointerenter" in window ? "pointerenter" : "mouseenter";
const leave = "onpointerleave" in window ? "pointerleave" : "mouseleave";

btn.addEventListener(enter, animateIn, { passive: true });
btn.addEventListener(leave, animateOut, { passive: true });

btn.addEventListener("focus", animateIn, { passive: true });
btn.addEventListener("blur", animateOut, { passive: true });

        btn.addEventListener("click", () => {
            btn.classList.add("icon-press");
            requestAnimationFrame(() => {
                btn.classList.remove("icon-press");

            });
        });
    });
})();

document.addEventListener("contextmenu", e => e.preventDefault());

function enableSimpleZoom(modalId, imgId) {
    const modal = document.getElementById(modalId);
    const img = modal?.querySelector(`#${imgId}`);
    if (!modal || !img) return;

    let scale = 1;
    let lastScale = 1;
    let startDistance = null;
    let originX = 0, originY = 0;

    let translateX = 0, translateY = 0;
    let lastTranslateX = 0, lastTranslateY = 0;
    let isDragging = false;
    let startX = 0, startY = 0;

    let lastTap = 0;

    img.style.transformOrigin = "center center";
    img.style.transition = "transform 0.2s ease-out";
    img.style.touchAction = "none";

    const getDistance = touches => Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
    );

    const getMidpoint = touches => ({
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2
    });

    const applyTransform = () => {
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    modal.addEventListener("touchstart", e => {
        if (e.touches.length > 2) return;

        const now = Date.now();
        if (now - lastTap < 400) {
            scale = 1;
            lastScale = 1;
            translateX = translateY = lastTranslateX = lastTranslateY = 0;
            img.style.transformOrigin = "center center";
            applyTransform();
        }
        lastTap = now;

        if (e.touches.length === 2) {
            startDistance = getDistance(e.touches);
            const mid = getMidpoint(e.touches);
            const rect = img.getBoundingClientRect();
            originX = mid.x - rect.left;
            originY = mid.y - rect.top;
            img.style.transformOrigin = `${originX}px ${originY}px`;
        } else if (e.touches.length === 1 && scale > 1) {
            isDragging = true;
            startX = e.touches[0].clientX - lastTranslateX;
            startY = e.touches[0].clientY - lastTranslateY;
        }
    }, { passive: false });

    modal.addEventListener("touchmove", e => {
        if (e.touches.length > 2) return;

        if (e.touches.length === 2 && startDistance) {
            const currentDistance = getDistance(e.touches);
            scale = lastScale * (currentDistance / startDistance);
            scale = Math.max(1, Math.min(3, scale)); 
            applyTransform();
            e.preventDefault();
        } else if (e.touches.length === 1 && isDragging) {
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;

            const maxX = (img.offsetWidth * (scale - 1)) / 2;
            const maxY = (img.offsetHeight * (scale - 1)) / 2;

            translateX = Math.max(-maxX, Math.min(maxX, translateX));
            translateY = Math.max(-maxY, Math.min(maxY, translateY));

            applyTransform();
            e.preventDefault();
        }
    }, { passive: false });

    modal.addEventListener("touchend", e => {
        lastScale = scale;
        lastTranslateX = translateX;
        lastTranslateY = translateY;
        if (e.touches.length < 2) startDistance = null;
        if (e.touches.length === 0) isDragging = false;
    });
}

enableSimpleZoom("imageModal", "lightboxImg");
enableSimpleZoom("certificateModal", "certificateImg");

/* =====================================================
   SKILLS SLIDER USER FRIENDLY DESKTOP + TABLET + MOBILE + SWIPE
===================================================== */
function initSkillsSlider() {
    const viewport = document.querySelector(".skills-viewport");
    const track = document.querySelector(".skills-track");
    const pages = document.querySelectorAll(".skills-page");
    const left = document.querySelector(".skill-btn.left");
    const right = document.querySelector(".skill-btn.right");
    const indicators = document.querySelector(".skills-indicators");
    const skillsSection = document.querySelector(".skills");

    if (!viewport || !track || !pages.length || !left || !right || !indicators) return;

    const duration = 800;
    const autoDelay = 3500;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let index = 0;
    let anim = false;
    let auto = null;
    let resizeRAF = null;

    let pointerDown = false;
    let startX = 0;
    let currentX = 0;

    track.style.willChange = "transform";
    viewport.style.touchAction = "pan-y";

    track.style.transition = "none";
    track.style.transform = "translateX(0px)";

    requestAnimationFrame(() => {
        if (!reduceMotion) {
            track.style.transition =
                `transform ${duration}ms cubic-bezier(0.16,1,0.3,1)`;
        }
    });

    const slideW = () => viewport.offsetWidth;

    const go = (i) => {
        if (anim || reduceMotion) return;
        anim = true;

        index = (i + pages.length) % pages.length;
        track.style.transform = `translateX(${-index * slideW()}px)`;

        [...indicators.children].forEach((dot, n) =>
            dot.setAttribute("aria-selected", n === index)
        );

        setTimeout(() => anim = false, duration);
    };

    indicators.innerHTML = "";
    pages.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.setAttribute("aria-selected", i === 0);
        dot.addEventListener("click", () => {
            go(i);
            startAuto();
        });
        indicators.appendChild(dot);
    });

    const startAuto = () => {
        if (reduceMotion) return;
        clearInterval(auto);
        auto = setInterval(() => go(index + 1), autoDelay);
    };

    const stopAuto = () => clearInterval(auto);

    left.onclick = () => {
        go(index - 1);
        startAuto();
    };

    right.onclick = () => {
        go(index + 1);
        startAuto();
    };

    if (skillsSection && !reduceMotion) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                startAuto();
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        observer.observe(skillsSection);
    }

    viewport.addEventListener("mouseenter", stopAuto);
    viewport.addEventListener("mouseleave", startAuto);
    viewport.addEventListener("pointerdown", stopAuto);

    viewport.addEventListener("pointerdown", e => {
        if (anim) return;

        pointerDown = true;
        startX = e.clientX;
        currentX = startX;

        track.style.transition = "none";
        viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener("pointermove", e => {
        if (!pointerDown) return;

        currentX = e.clientX;
        const delta = currentX - startX;

        track.style.transform =
            `translateX(${-index * slideW() + delta}px)`;
    });

    const endSwipe = () => {
        if (!pointerDown) return;
        pointerDown = false;

        const diff = currentX - startX;
        const threshold = slideW() * 0.15;

        track.style.transition =
            reduceMotion ? "none" :
                `transform ${duration}ms cubic-bezier(0.16,1,0.3,1)`;

        if (Math.abs(diff) > threshold) {
            diff < 0 ? go(index + 1) : go(index - 1);
        } else {
            go(index);
        }

        startAuto();
    };

    viewport.addEventListener("pointerup", endSwipe);
    viewport.addEventListener("pointercancel", endSwipe);
    viewport.addEventListener("pointerleave", endSwipe);

    window.addEventListener("resize", () => {
        cancelAnimationFrame(resizeRAF);
        resizeRAF = requestAnimationFrame(() => {
            track.style.transition = "none";
            track.style.transform = `translateX(${-index * slideW()}px)`;
            requestAnimationFrame(() => {
                if (!reduceMotion) {
                    track.style.transition =
                        `transform ${duration}ms cubic-bezier(0.16,1,0.3,1)`;
                }
            });
        });
    });

    window.addEventListener("beforeunload", () => {
        clearInterval(auto);
    });
}