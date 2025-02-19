document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landingPage');
    const authPage = document.getElementById('authPage');
    const enterButton = document.getElementById('enterButton');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Backend and Frontend URLs
    const backendUrl = "https://escape-room-backend.vercel.app/api/auth";
    const frontendUrl = "https://escape-room-frontend-iota.vercel.app/";

    // 🔹 Transition from Landing Page to Auth Page
    enterButton.addEventListener('click', () => {
        landingPage.style.opacity = '0';
        setTimeout(() => {
            landingPage.classList.add('hidden');
            authPage.classList.remove('hidden');
            setTimeout(() => { authPage.style.opacity = '1'; }, 50);
        }, 500);
    });

    // 🔹 Fade effect for pages
    landingPage.style.transition = 'opacity 0.5s ease';
    authPage.style.transition = 'opacity 0.5s ease';
    authPage.style.opacity = '0';

    // 🔹 Tab Switching (Login / Signup)
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.dataset.tab === 'login') {
                loginForm.classList.remove('hidden');
                signupForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
            }
        });
    });

    // 🔹 Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;

        try {
            const res = await fetch(`${backendUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                alert("Login successful! Redirecting...");
                window.location.href = frontendUrl; // ✅ Redirect to Game Frontend
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Login failed! Please try again.");
        }
    });

    // 🔹 Handle Signup
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = e.target.querySelector('input[type="text"]').value;
        const email = e.target.querySelector('input[type="email"]').value;
        const password = e.target.querySelector('input[type="password"]').value;
        const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Signup successful! Redirecting to game...");
                window.location.href = frontendUrl; // ✅ Redirect to Game Frontend after Signup
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error("Signup error:", err);
            alert("Signup failed! Please try again.");
        }
    });
});
