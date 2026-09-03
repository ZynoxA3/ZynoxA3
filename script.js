/* ==========================================================
   NAVBAR
========================================================== */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});


/* ==========================================================
   MOBILE MENU
========================================================== */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");

menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
});

const mobileLinks = document.querySelectorAll(".mobile-menu a");

mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });
});


/* ==========================================================
   SCROLL REVEAL
========================================================== */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* ==========================================================
   FAQ
========================================================== */

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(question => {
    question.addEventListener("click", () => {

        const item = question.parentElement;
        const answer = item.querySelector(".faq-answer");

        document.querySelectorAll(".faq-item").forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove("active");
                const otherAnswer = otherItem.querySelector(".faq-answer");
                otherAnswer.style.maxHeight = null;
            }
        });

        item.classList.toggle("active");

        if (item.classList.contains("active")) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = null;
        }
    });
});


/* ==========================================================
   CUSTOM CURSOR
========================================================== */

const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function animateCursor() {
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";

    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;

    follower.style.left = followerX + "px";
    follower.style.top = followerY + "px";

    requestAnimationFrame(animateCursor);
}

animateCursor();

const interactiveElements = document.querySelectorAll("a, button");

interactiveElements.forEach(element => {
    element.addEventListener("mouseenter", () => {
        follower.style.width = "50px";
        follower.style.height = "50px";
        follower.style.background = "rgba(242, 13, 59, 0.08)";
    });

    element.addEventListener("mouseleave", () => {
        follower.style.width = "30px";
        follower.style.height = "30px";
        follower.style.background = "transparent";
    });
});


/* ==========================================================
   DIGITAL GLOBE
========================================================== */

const canvas = document.getElementById("globeCanvas");
const ctx = canvas.getContext("2d");

let globeSize = 800;
let rotation = 0;

/* Resize */

function resizeGlobe() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale
    ctx.scale(dpr, dpr);

    globeSize = Math.min(rect.width, rect.height);
}

resizeGlobe();
window.addEventListener("resize", resizeGlobe);
const nodes = [];

// Generate random nodes on globe
for (let i = 0; i < 40; i++) {
    nodes.push({
        lat: (Math.random() * 180 - 90) * Math.PI / 180,
        lon: (Math.random() * 360) * Math.PI / 180
    });
}

/* ==========================================================
   DRAW GLOBE
========================================================== */

function drawGlobe() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const radius = globeSize * 0.39;

    /* Glow */
    const glow = ctx.createRadialGradient(
        centerX, centerY, radius * 0.4,
        centerX, centerY, radius * 1.2
    );

    glow.addColorStop(0, "rgba(80,90,160,.16)");
    glow.addColorStop(.7, "rgba(30,40,80,.04)");
    glow.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
    ctx.fill();

    /* ❌ REMOVED SOLID GLOBE BODY */

    /* Border */
    ctx.strokeStyle = "rgba(120,150,220,.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    /* Latitude */
    ctx.strokeStyle = "rgba(110,130,180,.16)";
    ctx.lineWidth = 1;

    for (let latitude = -60; latitude <= 60; latitude += 20) {

        const lat = latitude * Math.PI / 180;
        const y = centerY + Math.sin(lat) * radius;
        const widthAtLatitude = Math.cos(lat) * radius;

        ctx.beginPath();
        ctx.ellipse(
            centerX,
            y,
            widthAtLatitude,
            radius * Math.abs(Math.cos(lat)) * 0.25,
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    /* Longitude */
    for (let longitude = 0; longitude < 360; longitude += 20) {

        const angle = longitude * Math.PI / 180 + rotation;

        ctx.beginPath();
        ctx.ellipse(
            centerX,
            centerY,
            Math.abs(Math.cos(angle)) * radius,
            radius,
            0,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }

    /* Rotation */
    rotation += 0.0018;

    requestAnimationFrame(drawGlobe);
}

drawGlobe();
/* ==========================================
   AI NEURAL NODES + CONNECTIONS
========================================== */

const projected = [];

nodes.forEach(node => {

    const lat = node.lat;
    const lon = node.lon + rotation;

    const x = centerX + radius * Math.cos(lat) * Math.sin(lon);
    const y = centerY - radius * Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon);

    // Only front side
    if (z > 0) {
        projected.push({ x, y, z });
    }
});


/* ---------- DRAW CONNECTION LINES ---------- */

for (let i = 0; i < projected.length; i++) {
    for (let j = i + 1; j < projected.length; j++) {

        const dx = projected[i].x - projected[j].x;
        const dy = projected[i].y - projected[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius * 0.4) {

            ctx.strokeStyle = "rgba(255, 200, 80, 0.15)";
            ctx.lineWidth = 0.8;

            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
        }
    }
}
    

/* ---------- DRAW NODES ---------- */

projected.forEach(point => {

    const glow = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, 10
    );

    glow.addColorStop(0, "rgba(255, 230, 120, 1)");
    glow.addColorStop(0.4, "rgba(255, 180, 50, 0.6)");
    glow.addColorStop(1, "rgba(255, 150, 0, 0)");

    ctx.fillStyle = glow;

    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();

    // core dot
    ctx.fillStyle = "rgba(255, 220, 120, 0.9)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
    ctx.fill();

});

/* ==========================================================
   PARALLAX
========================================================== */

let targetRotation = 0;

document.addEventListener("mousemove", event => {
    const mousePercent = (event.clientX / window.innerWidth) - 0.5;
    targetRotation = mousePercent * 0.25;
});



/* ==========================================================
   CONSOLE MESSAGE
========================================================== */

console.log(
    "%c FORGE TECHNOLOGY ",
    "background:#f20d3b;color:white;font-size:20px;font-weight:bold;padding:10px;"
);

console.log("Where ideas are forged.");