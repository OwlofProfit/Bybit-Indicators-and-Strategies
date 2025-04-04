// -----------------------------
// PayPal Button Configuration
// -----------------------------
// PayPal integrácia
paypal.Buttons({
    style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
    },
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: { 
                    value: '19.00',
                    currency_code: 'EUR'
                },
                description: 'Access to Trading Strategies'
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            // Uložíme informáciu o platbe
            localStorage.setItem('strategyAccess', 'granted');
            
            // Skryjeme PayPal tlačidlo
            document.getElementById('paypal-button-container').style.display = 'none';
            
            // Zobrazíme Notion link
            document.getElementById('notion-link').style.display = 'block';
            
            // Oznámime úspešnú platbu
            alert('Payment successful! You now have lifetime access to the strategies.');
        });
    },
    onError: function(err) {
        console.error('PayPal error:', err);
        alert('Payment error. Please try again or contact support.');
    }
}).render('#paypal-button-container');

// -----------------------------
// Server Authentication
// -----------------------------
async function handleRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            updateUI(data.user);
            closeModal('registration-modal');
            alert('Registration successful!');
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            updateUI(data.user);
            closeModal('login-modal');
            alert('Login successful!');
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
}

async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        updateUI(null);
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// -----------------------------
// UI Updates
// -----------------------------
function updateUI(user) {
    const authButtons = document.getElementById('auth-buttons');
    const userWelcome = document.getElementById('user-welcome');
    const usernameDisplay = document.getElementById('username-display');

    if (user) {
        authButtons.style.display = 'none';
        userWelcome.style.display = 'flex';
        usernameDisplay.textContent = user.username;
    } else {
        authButtons.style.display = 'flex';
        userWelcome.style.display = 'none';
        usernameDisplay.textContent = '';
    }
}

// -----------------------------
// Modal Functions
// -----------------------------
function showRegistrationOptions() {
    document.getElementById('registration-modal').style.display = 'block';
}

function showLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// -----------------------------
// Session Check
// -----------------------------
async function checkLoginStatus() {
    try {
        const response = await fetch('/api/check-session');
        const data = await response.json();
        if (response.ok && data.user) {
            updateUI(data.user);
        } else {
            updateUI(null);
        }
    } catch (error) {
        console.error('Session check error:', error);
        updateUI(null);
    }
}

// -----------------------------
// Event Listeners
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    
    // Close modal when clicking outside
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // Kontrola prístupu pri načítaní stránky
    if (localStorage.getItem('strategyAccess') === 'granted') {
        document.getElementById('paypal-button-container').style.display = 'none';
        document.getElementById('notion-link').style.display = 'block';
    }
});
