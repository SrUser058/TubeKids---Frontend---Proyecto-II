
// Function to show and hide the password on register and user's edit places.
function showPassword(value) {
    if (value == 'show1') {
        if (document.getElementById('admin_password').type === "password") {
            document.getElementById('admin_password').type = "text";
        } else {
            document.getElementById('admin_password').type = "password";
        }
    } else {
        if (document.getElementById('admin_confirmation').type === "password") {
            document.getElementById('admin_confirmation').type = "text";
        } else {
            document.getElementById('admin_confirmation').type = "password";
        }
    }
};

function showPasswordRegister(value) {
    if (value == 'show1') {
        if (document.getElementById('input_password').type === "password") {
            document.getElementById('input_password').type = "text";
        } else {
            document.getElementById('input_password').type = "password";
        }
    } else {
        if (document.getElementById('input_confirmation').type === "password") {
            document.getElementById('input_confirmation').type = "text";
        } else {
            document.getElementById('input_confirmation').type = "password";
        }
    }
};