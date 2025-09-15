let currentUser = null, resetEmail = null, verificationCode = null;

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => 
        p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function genCode() {
    return Math.floor(100000 + Math.random() * 900000) + '';
}

let users = JSON.parse(localStorage.getItem('users')) || [];
if (!users.find(u => u.email === 'test@example.com')) {
    users.push({ name: 'Demo User', email: 'test@example.com', password: 'password123' });
    localStorage.setItem('users', JSON.stringify(users));
}

function updateDashboardCredentials() {
    if (currentUser) {
        const emailEl = document.getElementById('dashboardEmail');
        const nameEl = document.getElementById('dashboardName');
        if (emailEl) emailEl.textContent = currentUser.email;
        if (nameEl) nameEl.textContent = currentUser.name;
    }
}

function showError(div, msg) {
    div.textContent = msg;
    if (msg) {
        div.classList.add("show");
    } else {
        div.classList.remove("show");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ['registerLink','loginLink','forgotPasswordLink','backToLoginLink'].forEach(id => {
        document.getElementById(id).onclick = e => {
            e.preventDefault();
            showPage(
                id === 'registerLink' ? 'registerPage' :
                id === 'loginLink' || id === 'backToLoginLink' ? 'loginPage' : 'forgotPasswordPage'
            );
        };
    });

    document.getElementById('resendCodeLink').onclick = e => {
        e.preventDefault();
        if (resetEmail) {
            verificationCode = genCode();
            alert("Նոր կոդը ուղարկվել է․ " + verificationCode); // test
        }
    };

    document.getElementById('logoutBtn').onclick = e => {
        e.preventDefault();
        currentUser = null;
        showPage('loginPage');
        document.getElementById('loginForm').reset();
    };

    document.getElementById('loginForm').onsubmit = e => {
        e.preventDefault();
        const email = loginEmail.value.trim(), password = loginPassword.value;
        const user = users.find(u => u.email === email && u.password === password);
        const error = document.getElementById('loginError');
        if (user) {
            currentUser = user;
            showError(error, "");
            showPage('dashboardPage');
            updateDashboardCredentials();
        } else {
            showError(error, "⚠️ Սխալ email կամ գաղտնաբառ");
        }
    };


    document.getElementById('registerForm').onsubmit = e => {
        e.preventDefault();
        const name = registerName.value.trim(), 
              email = registerEmail.value.trim(), 
              password = registerPassword.value, 
              confirm = confirmPassword.value;
        const error = document.getElementById('registerError');

        if (users.find(u => u.email === email)) {
            showError(error, "⚠️ Այս email-ով օգտատեր արդեն կա");
        } else if (password !== confirm) {
            showError(error, "⚠️ Գաղտնաբառերը չեն համընկնում");
        } else if (password.length < 6) {
            showError(error, "⚠️ Գաղտնաբառը պետք է լինի առնվազն 6 նիշ");
        } else if (!validateEmail(email)) {
            showError(error, "⚠️ Սխալ email ձևաչափ");
        } else {
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            showError(error, "");
            showPage('loginPage');
            registerForm.reset();
        }
    };


    document.getElementById('forgotPasswordForm').onsubmit = e => {
        e.preventDefault();
        const email = forgotEmail.value.trim();
        const error = document.getElementById('forgotError');

        if (!validateEmail(email)) {
            showError(error, "⚠️ Սխալ email ձևաչափ");
        } else if (!users.find(u => u.email === email)) {
            showError(error, "⚠️ Այս email-ով օգտատեր գոյություն չունի");
        } else {
            resetEmail = email;
            verificationCode = genCode();
            showError(error, "");
            showPage('verificationPage');
            alert("Verification code: " + verificationCode); // test
        }
    };

    document.getElementById('verificationForm').onsubmit = e => {
        e.preventDefault();
        const codeInput = document.getElementById('verificationCode').value.trim();
        const error = document.getElementById('verificationError');
        if (codeInput === verificationCode) {
            showError(error, "");
            showPage('resetPasswordPage');
        } else {
            showError(error, "⚠️ Սխալ verification code");
        }
    };


    document.getElementById('resetPasswordForm').onsubmit = e => {
        e.preventDefault();
        const np = newPassword.value, cp = confirmNewPassword.value;
        const idx = users.findIndex(u => u.email === resetEmail);
        const error = document.getElementById('resetError');

        if (np !== cp) {
            showError(error, "⚠️ Գաղտնաբառերը չեն համընկնում");
        } else if (np.length < 6) {
            showError(error, "⚠️ Գաղտնաբառը պետք է լինի առնվազն 6 նիշ");
        } else if (idx === -1) {
            showError(error, "⚠️ Սխալ գործողություն");
        } else {
            users[idx].password = np;
            localStorage.setItem('users', JSON.stringify(users));
            resetEmail = null; verificationCode = null;
            showError(error, "");
            showPage('loginPage');
            resetPasswordForm.reset();
        }
    };

    showPage('loginPage');
});



