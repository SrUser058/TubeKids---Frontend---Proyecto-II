
document.addEventListener('DOMContentLoaded', async () => {
    const adminUser = localStorage.getItem('currentUser');
    const query = `query{
            childsGetByFather(father:"${adminUser}"){
                _id
                name,
                avatar
            }
        }`;
    await fetch(`http://localhost:3000/graphql`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(answer => answer.data.childsGetByFather)
        .then(data => {
            if (data) {
                data.forEach(element => {
                    document.getElementById('user_list').innerHTML += `<div class="child_user">
                        <img src="${putImg(element.avatar)}" alt="user_img" style="height: 200px; width: 200px;">
                        <h5>${element.name}</h5>
                        <button class="login_button child ${element._id}" onclick="loginAction(this)">Login</button>
                        </div>`;
                });
            };
        })
        .catch(error => {
            alert("Error while loading the page")
            console.log(error);
        })
        .finally(() => {
            document.getElementById('user_list').innerHTML += `<div id="admin_user">
        <img src="${putImg(1)}" alt="user_img" style="height: 200px; width: 200px;">
        <h5>Administrador</h5>
        <button class="login_button admin ${localStorage.getItem("currentUser")}" onclick="loginAction(this)">Login</button>
        </div>`;
        });
    //}
});

function putImg(avatar) {
    switch (avatar) {
        case 1: { return 'http://localhost:5500/img/1.svg' }
        case 2: { return "http://localhost:5500/img/2.svg" }
        case 3: { return "http://localhost:5500/img/3.svg" }
        case 4: { return "http://localhost:5500/img/4.svg" }
        case 5: { return "http://localhost:5500/img/5.svg" }
    };
};

function loginAction(buttonClicked) {
    document.getElementsByClassName('modal_login')[0].style.display = 'block';
    if (buttonClicked.classList[1] == 'child') {
        localStorage.setItem("childUser", buttonClicked.classList[2]);
    };
};

function closeModal() {
    document.getElementsByClassName('modal_login')[0].style.display = "none";
    localStorage.removeItem("childUser");
};

window.onclick = function (event) {
    const modal = document.getElementsByClassName('modal_login')[0];
    if (event.target == modal) {
        modal.style.display = "none";
        localStorage.removeItem("childUser");
    }
};

function selectUser() {
    if (localStorage.getItem("childUser")) {
        loginUser()
    } else {
        loginAdmin()
    }
}

async function loginUser() {
    const query = `query{
        childsGetAll(_id:"${localStorage.getItem("childUser")}"){
            pin
        }
    }`;
    await fetch(`http://localhost:3000/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ query })
    })
        .then(response => response.json())
        .then(answer => answer.data.childsGetAll)
        .then(data => {
            let pin = document.getElementById('input_pin').value.toString();
            if (data && data.pin == pin) {
                location.href = 'http://localhost:5500/childPage.html';
            }
            else {
                alert('The pin is wrong, please try again');
            }
        })
        .catch(error => {
            console.log(error);
            alert('Something fails while try login, please try later.');
        });
};

async function loginAdmin() {
    
    const query = `query{
        fathersGetAll(_id:"${localStorage.getItem("currentUser")}"){
            pin
        }
    }`;
    await fetch(`http://localhost:3000/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({query})
    })
        .then(response => response.json())
        .then(answer => answer.data.fathersGetAll)
        .then(data => {
            console.log(data);
            const pin = document.getElementById('input_pin').value;
            if (data.pin && data.pin == pin) {
                location.href = 'http://localhost:5500/adminPage.html';
            }
        })
        .catch(error => {
            console.log(error);
            alert('Something fails while try login, please try later.');
        });
};