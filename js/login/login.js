import { register, login } from "../supabase.js";

document.addEventListener('DOMContentLoaded', () => {
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
    
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('emailInput2');
        const password1 = document.getElementById('passwordInput2');
        const password2 = document.getElementById('confirmationPassword');
        const emailTest = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

        let isValid = true;

        if (email.value.trim() === "" || !emailTest.test(email.value.trim())) {
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            email.classList.remove('is-invalid');
            email.classList.add('is-valid');
        }

        if (password1.value.trim() == "" || password2.value.trim()){
            password1.classList.add('is-invalid')
            password2.classList.add('is-invalid')
        } else {
            password1.classList.add('is-valid')
            password2.classList.add('is-valid')
        }

        if (password1.value.trim().length < 8) {
            password1.classList.add('is-invalid');
            document.getElementById('passwordHelpInline').textContent = 'La contraseña debe tener al menos 8 caracteres.';
            isValid = false;
        } else {
            password1.classList.remove('is-invalid');
            password1.classList.add('is-valid');
            document.getElementById('passwordHelpInline').textContent = 'Contraseña válida';
        }

        if (password1.value.trim() !== password2.value.trim()) {
            password2.classList.add('is-invalid');
            isValid = false;
        } else {
            password2.classList.remove('is-invalid');
            password2.classList.add('is-valid');
        }

        if (isValid) {
            try {
                const isRegistered = await register(email.value.trim(), password1.value.trim());
                if (isRegistered) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ese correo ya está registrado!",
                    });
                } else {
                    Swal.fire({
                        title: "Registro",
                        text: "¡Registro completado con éxito!",
                        icon: "success"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.href = '../../templates/panels/userPanel.html';
                        }
                    });
                }
            } catch (error) {
                console.error('Error registering user:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.",
                });
            }
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault(); // Evita que el formulario se envíe por defecto
        const emailInput = document.getElementById('emailInput1');
        const passwordInput = document.getElementById('passwordInput1');
        const email = emailInput.value.trim();
        const password1 = passwordInput.value;

        if (email === "") {
            emailInput.classList.add('is-invalid');
            return; // Detener el proceso si el campo de correo está vacío
        } else {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        }

        // Realiza la verificación del login
        try {
            const isLoggedIn = await login(email, password1);

            if (isLoggedIn) {
                Swal.fire({
                    title: "Login Exitoso",
                    text: "¡Bienvenido!",
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '../../templates/panels/userPanel.html';
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Correo o contraseña incorrectos.",
                });
            }
        } catch (error) {
            console.error('Error logging in:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error durante el inicio de sesión. Por favor, inténtelo de nuevo.",
            });
        }
    });

    // Remover clases de validación al modificar los campos
    document.querySelectorAll('.form-control').forEach(function (field) {
        field.addEventListener('input', function () {
            this.classList.remove('is-invalid', 'is-valid'); // Remover clases de validación
        });
    });
});
