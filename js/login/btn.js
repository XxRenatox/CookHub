document.addEventListener('DOMContentLoaded', function() {
    // Obtener los botones y formularios
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Mostrar formulario de Login al hacer clic en "Login"
    loginBtn.addEventListener('click', function() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    // Mostrar formulario de Register al hacer clic en "Register"
    registerBtn.addEventListener('click', function() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
});