// Na začiatok súboru pridáme:
// Clear any existing access
localStorage.clear();

// PayPal Button Initialization
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: '19.00',
                    currency_code: 'EUR'
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            const savedUser = JSON.parse(localStorage.getItem('currentUser'));
            if (savedUser) {
                savedUser.accessGranted = true;
                savedUser.paymentDate = new Date().toISOString();
                savedUser.paymentDetails = details;
                localStorage.setItem('currentUser', JSON.stringify(savedUser));
                
                // Aktivovať prístup
                document.querySelector('.strategy-section').classList.add('access-granted');
                
                // Skryť platobný formulár
                document.getElementById('user-content').style.display = 'none';
                
                alert('Payment successful! You now have access to all strategies.');
            }
        });
    }
}).render('#paypal-button-container');

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

function handleRegistration(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Create user object
    const user = {
        username,
        email,
        password, // V reálnej aplikácii by malo byť hashované
        accessGranted: false,
        registrationDate: new Date().toISOString()
    };
    
    // Uložiť používateľa do localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Skryť registračný formulár a zobraziť platobné možnosti
    document.getElementById('guest-content').style.display = 'none';
    document.getElementById('user-content').style.display = 'block';
    
    alert('Registration successful! You can now proceed with payment.');
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
