// Na začiatok súboru pridáme:
// Clear any existing access
localStorage.clear();

// Initialize PayPal Button
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
            // Hide PayPal button
            document.getElementById('paypal-button-container').style.display = 'none';
            
            // Show success message and Notion link
            document.getElementById('notion-link').style.display = 'block';
            
            // Save access to localStorage for future visits
            localStorage.setItem('strategyAccess', 'granted');
            
            // Show success message with clear instructions
            alert('Payment successful! The access link has appeared below the Trading Strategies section. You can bookmark it for future use.');
        });
    },
    onError: function(err) {
        console.error('PayPal payment error:', err);
        alert('An error occurred during the payment process. Please try again.');
    }
}).render('#paypal-button-container');

// Handle successful payment
function handleSuccessfulPayment(details) {
    // Save access to localStorage
    localStorage.setItem('strategyAccess', 'granted');
    localStorage.setItem('paymentDetails', JSON.stringify(details));
    
    // Show Notion link
    document.getElementById('paypal-button-container').style.display = 'none';
    document.getElementById('notion-link').style.display = 'block';
    
    // Show success message
    alert('Payment successful! Thank you for your purchase.');
}

// Auth functions
function register() {
    // Implement Google Auth here
    alert('Google registration will be implemented soon.');
}

// Login Functions
function login() {
    document.getElementById('login-modal').style.display = 'block';
    initializeGoogleSignIn(); // This will initialize Google login button
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

// Funkcia na kontrolu prihlásenia pri načítaní stránky
function checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        const user = JSON.parse(userData);
        handleSuccessfulLogin(user.username);
    }
}

// Upravená funkcia pre prihlásenie
function handleEmailLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Tu by mala byť validácia prihlásenia
    const username = email.split('@')[0];
    
    // Uložíme údaje do localStorage
    const userData = {
        username: username,
        email: email
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    handleSuccessfulLogin(username);
}

// Po úspešnom prihlásení
function handleSuccessfulLogin(username) {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-welcome').style.display = 'block';
    document.getElementById('username-display').textContent = username;
    closeModal('login-modal');
}

// Upravená funkcia pre odhlásenie
function logout() {
    localStorage.removeItem('userData');
    document.getElementById('auth-buttons').style.display = 'block';
    document.getElementById('user-welcome').style.display = 'none';
    document.getElementById('username-display').textContent = '';
    // Tu môžeš pridať ďalšiu logout logiku (vymazanie tokenu, session, atď.)
}

// Handle Google Login
function handleGoogleLogin(response) {
    const userProfile = response.getBasicProfile();
    const googleId = userProfile.getId();
    
    // Get saved user data
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (savedUser && savedUser.googleId === googleId) {
        closeLoginModal();
        
        // Check if user has access
        if (localStorage.getItem('strategyAccess') === 'granted') {
            document.getElementById('paypal-button-container').style.display = 'none';
            document.getElementById('notion-link').style.display = 'block';
            alert('Welcome back! You have access to all strategies.');
        } else {
            alert('Login successful! Please complete payment to access strategies.');
        }
    } else {
        alert('No account found with this Google account. Please register first.');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('login-modal');
    if (event.target === loginModal) {
        closeLoginModal();
    }
};

// Check access on page load
document.addEventListener('DOMContentLoaded', function() {
    const hasAccess = localStorage.getItem('strategyAccess') === 'granted';
    if (hasAccess) {
        document.getElementById('paypal-button-container').style.display = 'none';
        document.getElementById('notion-link').style.display = 'block';
    }
});

function openModal(card) {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!savedUser) {
        alert('Please register first to access strategies.');
        return;
    }
    
    if (!savedUser.accessGranted) {
        alert('Please complete payment to view strategy details.');
        return;
    }
    
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-image");
    const img = card.querySelector("img");
    modalImg.src = img.src;
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function checkAccess() {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    return savedUser && savedUser.accessGranted;
}

function checkPayPalAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    const paymentAmount = urlParams.get('payment_amount');
    
    if (paymentStatus === 'completed' && paymentAmount === '19') {
        grantAccess();
        return true;
    }
    return false;
}

function grantAccess(accessCode) {
    if (accessCode) {
        // Manual access code check
        if (accessCode === 'OWL-OF-PROFIT-2024') {
            localStorage.setItem('strategyAccess', 'granted');
            document.querySelector('.strategy-section').classList.add('access-granted');
            return true;
        }
        return false;
    } else {
        // Automatic access grant
        localStorage.setItem('strategyAccess', 'granted');
        document.querySelector('.strategy-section').classList.add('access-granted');
        return true;
    }
}

function handleAccessCode() {
    const code = prompt('Please enter your access code:');
    if (code) {
        if (grantAccess(code)) {
            alert('Access granted! You can now view all strategies.');
        } else {
            alert('Invalid access code. Please try again or contact support.');
        }
    }
}

// Check access status on page load
document.addEventListener('DOMContentLoaded', function() {
    if (checkAccess()) {
        document.querySelector('.strategy-section').classList.add('access-granted');
    }
});

// Upravená funkcia pre registráciu
function handleEmailRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    // Tu by mala byť validácia registrácie
    
    // Uložíme údaje do localStorage
    const userData = {
        username: username,
        email: email
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    handleSuccessfulLogin(username);
    closeModal('registration-modal');
}

function handleLogin() {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    
    // Získať uloženého používateľa
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (savedUser && savedUser.email === email && savedUser.password === password) {
        // Skryť registračný formulár
        document.getElementById('guest-content').style.display = 'none';
        
        if (savedUser.accessGranted) {
            // Ak už má prístup, aktivovať ho
            localStorage.setItem('strategyAccess', 'granted');
            document.querySelector('.strategy-section').classList.add('access-granted');
            alert('Login successful! Access granted.');
        } else {
            // Ak nemá prístup, zobraziť platobné možnosti
            document.getElementById('user-content').style.display = 'block';
            alert('Login successful! Please complete payment to access strategies.');
        }
    } else {
        alert('Invalid credentials. Please try again.');
    }
}

function handlePaypalClick() {
    // Uložiť informáciu o začatí platby
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
        savedUser.paymentInitiated = true;
        savedUser.paymentInitiatedDate = new Date().toISOString();
        localStorage.setItem('currentUser', JSON.stringify(savedUser));
    }
}

function handlePaymentConfirmation() {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (savedUser) {
        // Kontrola či bola platba iniciovaná
        if (!savedUser.paymentInitiated) {
            alert('Please complete the PayPal payment first before confirming.');
            return;
        }
        
        // Aktualizovať používateľa
        savedUser.accessGranted = true;
        savedUser.paymentDate = new Date().toISOString();
        localStorage.setItem('currentUser', JSON.stringify(savedUser));
        
        // Aktivovať prístup
        localStorage.setItem('strategyAccess', 'granted');
        document.querySelector('.strategy-section').classList.add('access-granted');
        
        // Skryť platobný formulár
        document.getElementById('user-content').style.display = 'none';
        
        alert('Payment confirmed! You now have access to all strategies.');
    } else {
        alert('Please register or login first.');
    }
}

// Kontrola stavu pri načítaní stránky
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
        // Skryť registračný formulár
        document.getElementById('guest-content').style.display = 'none';
        
        if (savedUser.accessGranted) {
            // Ak má prístup, aktivovať ho
            document.querySelector('.strategy-section').classList.add('access-granted');
        } else {
            // Ak nemá prístup, zobraziť platobné možnosti
            document.getElementById('user-content').style.display = 'block';
        }
    }
});

// Initialize Google Sign-In
function startApp() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
        }).then(function() {
            // Attach sign-in to buttons after Google API is ready
            attachSignin(document.getElementById('google-register'));
            attachSignin(document.getElementById('google-login'));
        });
    });
}

// Attach Google Sign-In to button
function attachSignin(element) {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.attachClickHandler(element, {},
        function(googleUser) {
            const profile = googleUser.getBasicProfile();
            handleGoogleSuccess(profile);
        },
        function(error) {
            console.error('Google Sign-In Error:', error);
        }
    );
}

// Handle successful Google Sign-In
function handleGoogleSuccess(profile) {
    const user = {
        username: profile.getName(),
        email: profile.getEmail(),
        googleId: profile.getId(),
        profilePic: profile.getImageUrl(),
        registrationDate: new Date().toISOString()
    };
    
    // Store user data
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Close modals
    closeModal('registration-modal');
    closeModal('login-modal');
    
    // Show success message
    alert('Successfully signed in! You can now proceed with payment.');
}

// Show registration modal
function showRegistrationOptions() {
    document.getElementById('registration-modal').style.display = 'block';
    
    // Render Google button
    google.accounts.id.renderButton(
        document.getElementById('google-register'),
        { theme: 'outline', size: 'large' }
    );
}

// Show login modal
function login() {
    document.getElementById('login-modal').style.display = 'block';
    
    // Render Google button
    google.accounts.id.renderButton(
        document.getElementById('google-login'),
        { theme: 'outline', size: 'large' }
    );
}

// Close modal function
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle email registration
function handleEmailRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    const user = {
        username,
        email,
        password,
        registrationDate: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    closeModal('registration-modal');
    alert('Registration successful! You can now proceed with payment.');
}

// Handle email login
function handleEmailLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (savedUser && savedUser.email === email && savedUser.password === password) {
        closeModal('login-modal');
        alert('Login successful!');
    } else {
        alert('Invalid email or password');
    }
}

// Initialize Google Sign-In when page loads
window.onload = function() {
    google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: handleGoogleSignIn
    });
};

// Google Sign-In Handler
function handleGoogleSignIn(response) {
    const responsePayload = jwt_decode(response.credential);
    
    const user = {
        username: responsePayload.name,
        email: responsePayload.email,
        profilePic: responsePayload.picture,
        googleId: responsePayload.sub,
        registrationDate: new Date().toISOString()
    };

    // Store user data
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Close modals
    closeModal('registration-modal');
    closeModal('login-modal');
    
    // Show success message
    alert('Successfully signed in! You can now proceed with payment.');
}

function subscribeToBotAccess() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please register or login first.');
        showRegistrationOptions();
        return;
    }

    // Create PayPal payment for bot access
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
                        value: '29.00',
                        currency_code: 'EUR'
                    },
                    description: 'SAR Bot Monthly Access'
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Store bot access
                const user = JSON.parse(localStorage.getItem('currentUser'));
                user.botAccess = {
                    type: 'SAR',
                    startDate: new Date().toISOString(),
                    expiryDate: new Date(Date.now() + 30*24*60*60*1000).toISOString()
                };
                localStorage.setItem('currentUser', JSON.stringify(user));

                // Show success message and download link
                showBotAccess();
            });
        }
    }).render('#paypal-button-container');
}

function showBotAccess() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.botAccess) {
        document.getElementById('bot-access').style.display = 'block';
        document.getElementById('bot-download').href = 'path/to/your/bot.zip';
    }
}

function showBotInterface() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please register or login first');
        showRegistrationOptions();
        return;
    }
    
    if (!user.botAccess) {
        initiateBotPayment();
        return;
    }
    
    document.getElementById('bot-interface-modal').style.display = 'block';
}

function initiateBotPayment() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '29.00',
                        currency_code: 'EUR'
                    },
                    description: 'SAR Bot Monthly Access'
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                const user = JSON.parse(localStorage.getItem('currentUser'));
                user.botAccess = {
                    type: 'SAR',
                    startDate: new Date().toISOString(),
                    expiryDate: new Date(Date.now() + 30*24*60*60*1000).toISOString()
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
                document.getElementById('bot-interface-modal').style.display = 'block';
            });
        }
    }).render('#paypal-button-container');
}

let botRunning = false;

function startBot() {
    const apiKey = document.getElementById('api-key').value;
    const apiSecret = document.getElementById('api-secret').value;
    const pairs = document.getElementById('trading-pairs').value;
    
    if (!apiKey || !apiSecret || !pairs) {
        alert('Please fill in all fields');
        return;
    }
    
    botRunning = true;
    document.getElementById('status-display').innerHTML = 'Bot is running';
    document.getElementById('status-display').style.color = '#00ff00';
    
    // Start logging dummy trades for demo
    startTradeLogging();
}

function stopBot() {
    botRunning = false;
    document.getElementById('status-display').innerHTML = 'Bot is stopped';
    document.getElementById('status-display').style.color = '#ff4444';
}

function startTradeLogging() {
    if (!botRunning) return;
    
    const logBox = document.getElementById('trade-log');
    const pairs = document.getElementById('trading-pairs').value.split(',');
    
    setInterval(() => {
        if (botRunning) {
            const pair = pairs[Math.floor(Math.random() * pairs.length)];
            const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
            const price = (Math.random() * 1000).toFixed(2);
            
            const log = `${new Date().toLocaleTimeString()} - ${pair.trim()}: ${action} at $${price}`;
            const logEntry = document.createElement('div');
            logEntry.textContent = log;
            logBox.appendChild(logEntry);
            logBox.scrollTop = logBox.scrollHeight;
        }
    }, 5000);
}

function sendEmail(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Using EmailJS service
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        to_email: 'owlofprofit@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message
    })
    .then(function(response) {
        alert('Message sent successfully!');
        document.getElementById('contact-form').reset();
    })
    .catch(function(error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again.');
    });
}

function saveAPIKeys() {
    const apiKey = document.getElementById('api-key').value;
    const apiSecret = document.getElementById('api-secret').value;

    if (!apiKey || !apiSecret) {
        alert('Please enter both API Key and Secret');
        return;
    }

    // Store API keys securely (consider encryption in production)
    localStorage.setItem('bybit_api_key', apiKey);
    localStorage.setItem('bybit_api_secret', apiSecret);
    
    updateStatusDisplay('API Keys saved successfully');
}

function startSelectedBots() {
    const selectedBots = document.querySelectorAll('input[name="bot-selection"]:checked');
    
    if (selectedBots.length === 0) {
        alert('Please select at least one bot to start');
        return;
    }

    if (!localStorage.getItem('bybit_api_key') || !localStorage.getItem('bybit_api_secret')) {
        alert('Please save your API keys first');
        return;
    }

    selectedBots.forEach(bot => {
        startBot(bot.id);
    });
}

function startBot(botId) {
    const statusDisplay = document.getElementById('status-display');
    statusDisplay.innerHTML = `${botId} is running`;
    statusDisplay.style.color = '#00ff00';
    
    // Start logging dummy trades for demo
    startTradeLogging();
}

function stopAllBots() {
    const statusDisplay = document.getElementById('status-display');
    statusDisplay.innerHTML = 'All bots stopped';
    statusDisplay.style.color = '#ff4444';
    
    stopTradeLogging();
}

function updateStatusDisplay(message) {
    const statusDisplay = document.getElementById('status-display');
    statusDisplay.innerHTML = message;
}

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

// Funkcie pre modálne okná
function showRegistrationOptions() {
    document.getElementById('registration-modal').style.display = 'block';
}

function login() {
    document.getElementById('login-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Funkcie pre autentifikáciu
function checkLoginStatus() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        const user = JSON.parse(userData);
        handleSuccessfulLogin(user.username);
    }
}

function handleEmailLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Kontrola či užívateľ existuje
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('userData', JSON.stringify({
            username: user.username,
            email: user.email
        }));
        handleSuccessfulLogin(user.username);
        closeModal('login-modal');
    } else {
        alert('Invalid email or password');
    }
}

function handleEmailRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    // Načítanie existujúcich užívateľov
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Kontrola či užívateľ už existuje
    if (users.some(user => user.email === email)) {
        alert('User with this email already exists');
        return;
    }

    // Pridanie nového užívateľa
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    // Uloženie aktuálne prihláseného užívateľa
    localStorage.setItem('userData', JSON.stringify({
        username: username,
        email: email
    }));

    handleSuccessfulLogin(username);
    closeModal('registration-modal');
}

function handleSuccessfulLogin(username) {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-welcome').style.display = 'block';
    document.getElementById('username-display').textContent = username;
}

function logout() {
    localStorage.removeItem('userData');
    document.getElementById('auth-buttons').style.display = 'block';
    document.getElementById('user-welcome').style.display = 'none';
    document.getElementById('username-display').textContent = '';
}

// Pridanie event listenerov keď sa dokument načíta
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();

    // Zatvorenie modálneho okna keď užívateľ klikne mimo neho
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    }
});

// Utility funkcie pre prácu s localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Event listener pre načítanie stránky
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

// Kontrola prihlásenia pri načítaní stránky
function checkLoginStatus() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser) {
        updateUIForLoggedUser(loggedUser.username);
    }
}

// Aktualizácia UI po prihlásení
function updateUIForLoggedUser(username) {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-welcome').style.display = 'block';
    document.getElementById('username-display').textContent = username;
}

// Registrácia nového užívateľa
function handleEmailRegistration(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const users = getUsers();
    
    // Kontrola či užívateľ už existuje
    if (users.some(user => user.email === email)) {
        alert('User with this email already exists');
        return;
    }

    // Pridanie nového užívateľa
    const newUser = { username, email, password };
    users.push(newUser);
    saveUsers(users);

    // Automatické prihlásenie po registrácii
    localStorage.setItem('loggedUser', JSON.stringify(newUser));
    updateUIForLoggedUser(username);
    closeModal('registration-modal');
}

// Prihlásenie užívateľa
function handleEmailLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('loggedUser', JSON.stringify(user));
        updateUIForLoggedUser(user.username);
        closeModal('login-modal');
    } else {
        alert('Invalid email or password');
    }
}

// Odhlásenie užívateľa
function logout() {
    localStorage.removeItem('loggedUser');
    document.getElementById('auth-buttons').style.display = 'block';
    document.getElementById('user-welcome').style.display = 'none';
    document.getElementById('username-display').textContent = '';
}

// Modálne okná
function showRegistrationOptions() {
    document.getElementById('registration-modal').style.display = 'block';
}

function login() {
    document.getElementById('login-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Zatvorenie modálneho okna pri kliknutí mimo neho
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Globálne premenné pre správu stavu
let currentUser = null;

// Základné funkcie pre správu užívateľov
function saveUser(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
}

function findUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.email === email && user.password === password);
}

function setCurrentUser(user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUIForLoggedUser();
}

// UI funkcie
function updateUIForLoggedUser() {
    if (currentUser) {
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-welcome').style.display = 'flex';
        document.getElementById('username-display').textContent = currentUser.username;
    } else {
        document.getElementById('auth-buttons').style.display = 'flex';
        document.getElementById('user-welcome').style.display = 'none';
        document.getElementById('username-display').textContent = '';
    }
}

// Event handlery
function handleEmailRegistration(event) {
    event.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        alert('User with this email already exists');
        return;
    }
    
    const newUser = { username, email, password };
    saveUser(newUser);
    setCurrentUser(newUser);
    closeModal('registration-modal');
}

function handleEmailLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = findUser(email, password);
    if (user) {
        setCurrentUser(user);
        closeModal('login-modal');
    } else {
        alert('Invalid email or password');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedUser();
}

// Modal funkcie
function showRegistrationOptions() {
    document.getElementById('registration-modal').style.display = 'block';
}

function login() {
    document.getElementById('login-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Kontrola prihlásenia pri načítaní stránky
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedUser();
    }
}

// Event listener pre kliknutie mimo modálneho okna
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Inicializácia pri načítaní stránky
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

// Funkcie pre správu užívateľov v localStorage
function saveUserToLocalStorage(userData) {
    // Uloženie do users array
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Uloženie aktuálne prihláseného užívateľa
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

// Kontrola prihlásenia pri načítaní stránky
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        updateUIAfterLogin(user);
        console.log('User logged in:', user); // Pre debugging
    }
}

// Aktualizácia UI po prihlásení
function updateUIAfterLogin(user) {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-welcome').style.display = 'block';
    document.getElementById('username-display').textContent = user.username;
}

// Prihlásenie užívateľa
function handleEmailLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIAfterLogin(user);
        closeModal('login-modal');
        console.log('Login successful:', user); // Pre debugging
    } else {
        alert('Invalid email or password');
    }
}

// Odhlásenie užívateľa
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('auth-buttons').style.display = 'block';
    document.getElementById('user-welcome').style.display = 'none';
    document.getElementById('username-display').textContent = '';
    console.log('User logged out'); // Pre debugging
}

// Event listener pre načítanie stránky
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    console.log('Page loaded, checking login status'); // Pre debugging
});

// Pomocné funkcie pre prácu s localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Registrácia užívateľa
function handleEmailRegistration(event) {
    event.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    let users = getUsers();
    
    // Kontrola či užívateľ už existuje
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }

    // Pridanie nového užívateľa
    const newUser = { username, email, password };
    users.push(newUser);
    saveUsers(users);

    // Automatické prihlásenie po registrácii
    setLoggedInUser(newUser);
    closeModal('registration-modal');
}

// Prihlásenie užívateľa
function handleEmailLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        setLoggedInUser(user);
        closeModal('login-modal');
    } else {
        alert('Invalid email or password');
    }
}

// Nastavenie prihláseného užívateľa
function setLoggedInUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUIAfterLogin(user);
}

// Aktualizácia UI po prihlásení
function updateUIAfterLogin(user) {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-welcome').style.display = 'block';
    document.getElementById('username-display').textContent = user.username;
}

// Kontrola prihlásenia pri načítaní stránky
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        updateUIAfterLogin(JSON.parse(currentUser));
    }
}

// Odhlásenie
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('auth-buttons').style.display = 'block';
    document.getElementById('user-welcome').style.display = 'none';
    document.getElementById('username-display').textContent = '';
}

// Modal funkcie
function showRegistrationOptions() {
    document.getElementById('registration-modal').style.display = 'block';
}

function login() {
    document.getElementById('login-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Event listener pre zatvorenie modalu pri kliknutí mimo neho
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Inicializácia pri načítaní stránky
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});
