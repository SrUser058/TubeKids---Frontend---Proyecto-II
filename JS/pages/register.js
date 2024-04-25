
function backLogin() {
    location.href = "http://localhost:5500/login.html"
}

// Process to verify all data and send that to the API Rest.
async function registerProcess() {

    const name = document.getElementById('input_name').value;
    const lastname = document.getElementById('input_lastname').value;
    const email = document.getElementById('input_email').value;
    const phone = document.getElementById('input_phone').value;
    const password = document.getElementById('input_password').value;
    const confirmation = document.getElementById('input_confirmation').value;
    const age = document.getElementById('input_age').value;
    const pin = document.getElementById('input_pin').value;
    const birthdate = document.getElementById('input_birthdate').value;
    const country = document.getElementById('input_country').value;
    const avatar = 1;

    if (name && lastname && age && age > 18 && email && password && password === confirmation && pin && pin.length == 6 && phone) {
        await fetch(`http://localhost:3000/graphql`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({query:`query{
                    fathersGetEmail(email:"${email}"){
                        email
                      }
                }`})
            })
            .then(response => response.json())
            .then(answer => answer.data.fathersGetEmail)
            .then(data => {
                console.log(data);
                if (!data) {
                    let bodySend = {
                        "name": name,
                        "lastname": lastname,
                        "email": email,
                        "phone": phone,
                        "password": password,
                        "age": age,
                        "pin": pin,
                        "birthdate": birthdate,
                        "country": country,
                        "status": false,
                        "avatar": avatar
                    };
                    registerUser(bodySend);
                } else {
                    console.log('El correo ya existe en la base de datos.')
                }
            });
    } else {
        console.log('Datos invalidos.');
        alert('Wrong data in the field');
    }
}

async function registerUser(bodySend) {
    await fetch(`http://localhost:3001/api/father/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodySend)
    })
        .then(response => {
            if (!response.ok) {
                console.log("Error con la conexion");
                throw new Error("Error with the conection");
            }
            return response.json();
        })
        .then(data => {
            if (data)
                alert('Register completed, you are gonna be transfer to the login page')
            location.href = "http://localhost:5500/login.html"
        })
        .catch(error => {
            console.log(error);
            alert('Error while saving your account, please try later')

        });
};