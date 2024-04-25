
let code = [];

addEventListener('DOMContentLoaded', async () => {
    await fetch(`http://localhost:3001/api/auth/?number=${userNumber}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            code = data.code;
        })
})

function authUser() {
    const inputList = new Array(document.getElementsByClassName('input_number'));
    const numberInput = [];
    for (let x = 0; x < inputList.length; x++) {
        numberInput.push(inputList[x].value)
    }
    let auth = true;
    if (code.length == numberInput.length) {
        for (let x = 0; x < inputList.length; x++) {
            if (inputList[x] != code[x]) {
                auth = false;
            }

        }
    }
    if (auth == true) {
        alert('Success Authentication!')
        location.href = "http://localhost:5500/usersPage.html"
    } else {
        alert('Something was wrong, please try later')
        location.href = "http://localhost:5500/login.html"
    }

}

async function userNumber() {
    await fetch(`http://localhost:3000/graphql`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "query": `query{
            fathersGetAll(_id:"${localStorage.getItem("currentUser")}"){
                phone
              }
        }`})
        })
        .then(response => response.json())
        .then(answer => answer.data.fathersGetAll)
        .then(data => { return data.phone })
}