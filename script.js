document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landingPage');
    const authPage = document.getElementById('authPage');
    const enterButton = document.getElementById('enterButton');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginButton = loginForm.querySelector('.submit-btn');
    const signupButton = signupForm.querySelector('.submit-btn');
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

    // 🔹 New Code for Button Movement and Disabling
    // Function to check if all inputs in a form are filled
    const isFormComplete = (form) => {
        const inputs = form.querySelectorAll('input[required]');
        return Array.from(inputs).every(input => input.value.trim() !== '');
    };

    // Function to enable/disable buttons based on form completion
    const updateButtonState = (form, button) => {
        if (isFormComplete(form)) {
            button.disabled = false;
            button.classList.remove('disabled');
        } else {
            button.disabled = true;
            button.classList.add('disabled');
        }
    };

    // Add input event listeners to login form
    loginForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            updateButtonState(loginForm, loginButton);
        });
    });

    // Add input event listeners to signup form
    signupForm.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            updateButtonState(signupForm, signupButton);
        });
    });

    // Function to move the button randomly on the page
    const moveButtonRandomly = (button) => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const buttonWidth = button.offsetWidth;
        const buttonHeight = button.offsetHeight;

        // Generate random positions within the window bounds
        const randomX = Math.floor(Math.random() * (windowWidth - buttonWidth));
        const randomY = Math.floor(Math.random() * (windowHeight - buttonHeight));

        // Move the button to the random position
        button.style.position = 'absolute';
        button.style.left = `${randomX}px`;
        button.style.top = `${randomY}px`;
    };

    // Add click event listener to disabled buttons for random movement
    const addButtonMovementEffect = (button) => {
        button.addEventListener('click', (e) => {
            if (button.disabled) {
                e.preventDefault(); // Prevent form submission
                moveButtonRandomly(button); // Move the button randomly
            }
        });
    };

    addButtonMovementEffect(loginButton);
    addButtonMovementEffect(signupButton);

    // Initialize button states
    updateButtonState(loginForm, loginButton);
    updateButtonState(signupForm, signupButton);
});