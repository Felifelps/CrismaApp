const icon = document.getElementById('icon');
const password = document.getElementById('password');

function changePasswordVisibility() {
    if (icon.classList.contains('fa-eye')) {
        password.setAttribute('type', 'text');
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        password.setAttribute('type', 'password');
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}