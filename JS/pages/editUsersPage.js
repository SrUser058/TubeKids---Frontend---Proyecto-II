
document.addEventListener('DOMContentLoaded', async () => {
    loadAdmin();
    await fetch(`http://localhost:3001/api/childs/father/?father=${localStorage.getItem("currentUser")}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.childs != 'void') {
                data.forEach(element => {
                    document.getElementById("user_list").innerHTML += `<div class="child_user">
                <img src="${putImg(element.avatar)}" alt="user_img" style="height: 50px; width: 50px;">
                <h5>${element.name}</h5>

                <label >Name
                <input type="text" class="child_name ${element._id}" value="${element.name}"></label>

                <label>Age
                <input type="number" class="child_age ${element._id}" value="${element.age}"></label>

                <label>Pin
                <input type="text" pattern="[0-9]{6}" class="child_pin ${element._id}" maxlenght="6" value="${element.pin}"></label>

                <label>Avatar
                <select class="child_select ${element._id}">
                    <option value="1">Eagle</option>
                    <option value="2">Seal</option>
                    <option value="3">Rhinoceros</option>
                    <option value="4">Gorilla</option>
                    <option value="5">Hippo</option>
                </select></label>
                <button value="${element._id}" class="child" onclick="editChildAction(this.value)">Edit</button>
                <button value="${element._id}" class="child" onclick="deleteChildAction(this.value)">Delete</button>
                </div>`;
                });
            };
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the users list')
        });
    loadCreateChild();
});

async function loadAdmin() {
    await fetch(`http://localhost:3001/api/father/?id=${localStorage.getItem("currentUser")}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("user_list").innerHTML += `<div class="admin_user">
                <img src="${putImg(data.avatar)}" alt="user_img" style="height: 80px; width: 80px;">
                <h5>${data.name + " " + data.lastname}</h5>
                <label>Name
                <input type="text" id="admin_name" value="${data.name}"></label>

                <label >Lastname
                <input type="text" id="admin_lastname" value="${data.lastname}"></label>

                <label >Email
                <input type="text" id="admin_email" value="${data.email}"></label>

                <label >Age
                <input type="text" id="admin_age" value="${data.age}"></label>

                <label>Password
                <input type="password" id="admin_password" value="${data.password}"></label>
                <input type="checkbox" value="show1" onclick="showPassword(this.value)">

                <label>Confirm password
                <input type="password" id="admin_confirmation"></label>
                <input type="checkbox" value="show2" onclick="showPassword(this.value)">

                <label>Pin
                <input type="number" id="admin_pin" step="6" value="${data.pin}"></label>

                <label>Country
                <input type="text" id="admin_country" value="${data.country}"></label>

                <label>Birthdate
                <input type="text" id="admin_birthdate" value="${data.birthdate}"></label>

                <label>Avatar
                <select id="admin_select">
                    <option value="1">Eagle</option>
                    <option value="2">Seal</option>
                    <option value="3">Rhinoceros</option>
                    <option value="4">Gorilla</option>
                    <option value="5">Hippo</option>
                </select></label>
                <button value="${data._id}" onclick="editAdminAction()">Edit</button>
            </div>`;
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the users list')
        });
};

function loadCreateChild() {
    document.getElementById("user_list").innerHTML += `<div class="child_user">
                <img src="${putImg(1)}" alt="user_img" style="height: 50px; width: 50px;">
                <h5>Create New User</h5>

                <label >Name
                <input type="text" class="create_input"></label>

                <label>Age
                <input type="number" class="create_input"></label>

                <label>Pin
                <input type="text" pattern="[0-9]{6}" class="create_input" maxlenght="6"></label>

                <label>Avatar
                <select class="create_select">
                    <option value="1">Eagle</option>
                    <option value="2">Seal</option>
                    <option value="3">Rhinoceros</option>
                    <option value="4">Gorilla</option>
                    <option value="5">Hippo</option>
                </select></label>
                <button class="create" onclick="createChildAction()">Create</button>
                </div>`;
}

function putImg(avatar) {
    switch (avatar) {
        case 1: { return "http://localhost:5500/img/1.svg" }
        case 2: { return "http://localhost:5500/img/2.svg" }
        case 3: { return "http://localhost:5500/img/3.svg" }
        case 4: { return "http://localhost:5500/img/4.svg" }
        case 5: { return "http://localhost:5500/img/5.svg" }
    };
};

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

async function editAdminAction() {

    const select = document.getElementById('admin_select');
    const bodySended = {
        "name": document.getElementById('admin_name').value,
        "lastname": document.getElementById('admin_lastname').value,
        "email": document.getElementById('admin_email').value,
        "age": document.getElementById('admin_age').value,
        "password": document.getElementById('admin_password').value,
        "pin": document.getElementById('admin_pin').value,
        "country": document.getElementById('admin_country').value,
        "birthdate": document.getElementById('admin_birthdate').value,
        "avatar": select.options[select.selectedIndex].value
    };
    await fetch(`http://localhost:3001/api/father/?id=${localStorage.getItem("currentUser")}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodySended)
        })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                location.href = 'http://localhost:5500/editUsersPage.html';
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the changes in the server')
        });
};

async function createChildAction(){
    const select = document.getElementsByClassName('create_select')[0];
    const bodySended = {
        //document.getElementsByClassName('65f89e93fa844f75887a33b6')
        "name": document.getElementsByClassName('create_input')[0].value,
        "age": document.getElementsByClassName('create_input')[1].value,
        "pin": document.getElementsByClassName('create_input')[2].value,
        "father":localStorage.getItem("currentUser"),
        "avatar": select.options[select.selectedIndex].value
    };

    await fetch(`http://localhost:3001/api/childs/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodySended)
        })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                location.href = 'http://localhost:5500/editUsersPage.html';
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the changes in the server');
        });
};

async function editChildAction(childId) {
    const select = document.getElementsByClassName(childId)[3];
    const bodySended = {
        //document.getElementsByClassName('65f89e93fa844f75887a33b6')
        "name": document.getElementsByClassName(childId)[0].value,
        "age": document.getElementsByClassName(childId)[1].value,
        "pin": document.getElementsByClassName(childId)[2].value,
        "avatar": select.options[select.selectedIndex].value
    };

    await fetch(`http://localhost:3001/api/childs/?id=${childId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodySended)
        })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                location.href = 'http://localhost:5500/editUsersPage.html';
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the changes in the server');
        });
};

async function deleteChildAction(childId) {
    await fetch(`http://localhost:3001/api/childs/?id=${childId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data != undefined) {
                location.href = 'http://localhost:5500/editUsersPage.html';
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the changes in the server');
        });
}