let currentUser = null, resetEmail = null, verificationCode = null;
let currentRow = null;

// Լոգիկա՝ page-ների ցուցադրման համար
function showPage(id) {
    document.querySelectorAll('.page, .pagee').forEach(p => 
        p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Էլ․փոստի վալիդացիա
function validateEmail(e) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// 6 թվանշանի կոդ ստեղծում
function genCode() {
    return Math.floor(100000 + Math.random() * 900000) + '';
}

// Օգտատերերի սկիզբ
let users = JSON.parse(localStorage.getItem('users')) || [];
if (!users.find(u => u.email === 'test@example.com')) {
    users.push({ name: 'Demo User', email: 'test@example.com', password: 'password123' });
    localStorage.setItem('users', JSON.stringify(users));
}

// Ցուցադրել error message
function showError(div, msg) {
    div.textContent = msg;
    if (msg) div.classList.add("show");
    else div.classList.remove("show");
}


document.addEventListener('DOMContentLoaded', () => {
    // Page navigation links
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

// Login
document.getElementById('loginForm').onsubmit = e => {
        e.preventDefault();
        const email = loginEmail.value.trim(), password = loginPassword.value;
        const user = users.find(u => u.email === email && u.password === password);
        const error = document.getElementById('loginError');
        if (user) {
            currentUser = user;
            showError(error, "");
            showPage('dashboardPage');

            // Dashboard-ը ցուցադրել, student section թաքցնել
            document.querySelector('.dashboard-content').style.display = 'block';
            document.querySelector('.cards').style.display = 'flex';
            document.querySelector('.activities').style.display = 'block';
            document.getElementById('studentpage').style.display = 'none';
        } else {
            showError(error, "⚠️ Incorrect email or password.");
        }
};

// Register
document.getElementById('registerForm').onsubmit = e => {
        e.preventDefault();
        const name = registerName.value.trim(), 
              email = registerEmail.value.trim(), 
              password = registerPassword.value, 
              confirm = confirmPassword.value;
        const error = document.getElementById('registerError');

        if (users.find(u => u.email === email)) {
            showError(error, "⚠️ A user with this email already exists");
        } else if (password !== confirm) {
            showError(error, "⚠️ Passwords do not match");
        } else if (password.length < 6) {
            showError(error, "⚠️ The password must be at least 6 characters long");
        } else if (!validateEmail(email)) {
            showError(error, "⚠️ Invalid email format");
        } else {
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            showError(error, "");
            showPage('loginPage');
            registerForm.reset();
        }
};

// Forgot password
document.getElementById('forgotPasswordForm').onsubmit = e => {
        e.preventDefault();
        const email = forgotEmail.value.trim();
        const error = document.getElementById('forgotError');

        if (!validateEmail(email)) {
            showError(error, "⚠️ Invalid email format");
        } else if (!users.find(u => u.email === email)) {
            showError(error, "⚠️ No user exists with this email");
        } else {
            resetEmail = email;
            verificationCode = genCode();
            showError(error, "");
            showPage('verificationPage');
            alert("Verification code: " + verificationCode); // test
        }
};

// Verification code
document.getElementById('verificationForm').onsubmit = e => {
        e.preventDefault();
        const codeInput = document.getElementById('verificationCode').value.trim();
        const error = document.getElementById('verificationError');
        if (codeInput === verificationCode) {
            showError(error, "");
            alert("✅ Verification success (reset password page is not implemented)");
            showPage('loginPage');
        } else {
            showError(error, "⚠️ Invalid verification code");
        }
};

// Dashboard menu click
document.querySelectorAll('.menu li').forEach((item, index) => {
    item.onclick = () => {
        document.querySelectorAll('.menu li').forEach(li => li.classList.remove('active'));
        item.classList.add('active');
    
        
        document.querySelectorAll('#dashboardPage .dashboard-content, #dashboardPage .cards, #dashboardPage .activities, #studentpage, #teacherspage, #classpage').forEach(sec => {
                sec.style.display = 'none';
        });
    
        if (index === 0) { // Dashboard
            document.querySelector('.dashboard-content').style.display = 'block';
            document.querySelector('.cards').style.display = 'flex';
            document.querySelector('.activities').style.display = 'block';
        } else if (index === 1) { // Students
            document.getElementById('studentpage').style.display = 'block';
        } else if (index === 2) { // Teachers
            document.getElementById('teacherspage').style.display = 'block';
        }else if (index === 3) { // Class
            document.getElementById('classpage').style.display = 'block';
        }
            
    };
});

    showPage('loginPage');
});

// Student modal functions
function openAddModal(){
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("city").value = "";
    document.getElementById("add").style.display = "flex";
}

function openEditModal(button){
    currentRow = button.closest("tr");
    document.getElementById("editname").value = currentRow.cells[0].innerText;
    document.getElementById("editemail").value = currentRow.cells[1].innerText;
    document.getElementById("editcity").value = currentRow.cells[2].innerText;
    document.getElementById("edit").style.display = "flex";
}

function openDeleteModal(button) {
    currentRow = button.closest("tr");
    document.getElementById("delete").style.display ="flex";
}

function saveAdd(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let city = document.getElementById("city").value;

    if(name && email && city){
        let table = document.getElementById("Table").getElementsByTagName("tbody")[0];
        let newRow  = table.insertRow();

        newRow.innerHTML = `
            <td>${name}</td>
            <td>${email}</td>
            <td>${city}</td> 
            <td>
                <button class="btn-edit" onclick="openEditModal(this)">✏️ Խմբագրել</button>
                <button class="btn-delete" onclick="openDeleteModal(this)">Ջնջել</button>
            </td>
        `;
        closeModal("add");
    } else{
        alert("Please fill all fields!");
    }
}

function saveEdit(){
    currentRow.cells[0].innerText = document.getElementById("editname").value;
    currentRow.cells[1].innerText = document.getElementById("editemail").value;
    currentRow.cells[2].innerText = document.getElementById("editcity").value;
    closeModal("edit");
}

function confirmDelete(){
    currentRow.remove();
    closeModal("delete");
}

function closeModal(id){
    document.getElementById(id).style.display = "none";
}

window.onclick = function(event){
    if(event.target.classList.contains("modal")){
        event.target.style.display = "none";
    }
}
