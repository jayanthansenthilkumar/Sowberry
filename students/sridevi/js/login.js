document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.querySelector('input[type="password"]');
    const togglePassword = document.querySelector('.toggle-password');

    // Password visibility toggle
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        try {
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.textContent = 'Signing in...';
            loginBtn.disabled = true;

            // Simulate API call - Replace with actual API endpoint
            const response = await simulateLogin(email, password);
            
            if (response.success) {
                showNotification('Login successful!', 'success');
                // Redirect to dashboard after successful login
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            const loginBtn = document.querySelector('.login-btn');
            loginBtn.textContent = 'Sign In';
            loginBtn.disabled = false;
        }
    });

    // Social login handlers
    document.querySelector('.google-btn').addEventListener('click', () => {
        window.location.href = '/auth/google';
    });

    document.querySelector('.microsoft-btn').addEventListener('click', () => {
        window.location.href = '/auth/microsoft';
    });
});

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

async function simulateLogin(email, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email && password) {
                resolve({ success: true, message: 'Login successful' });
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 1500);
    });
}
