
async function loginAction() {
    const email = document.getElementById('input_email').value;
    const password = document.getElementById('input_password').value;
    if (email && password) {
        // Query format to GraphQL API
        const query = `
        query{
            fathersGetEmail(email:"${email}"){
                _id,
                email,
                password,
                status
            }
      }`;
        await fetch(`http://localhost:3000/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify({query})
        })
            .then(response => response.json())
            .then(answer => answer.data.fathersGetEmail) //To do easy the way to read the json
            .then(data => {

                if(data && data.email == email && data.password == password && data.status == 'true'){
                    createToken({"_id":data._id,"email":data.email,"password":data.password});
                    localStorage.setItem("currentUser", `${data._id}`);
                    location.href = "http://localhost:5500/authetication.html"
                } else {
                    alert('The email or password are avoid or dont verify your account yet!, please enter your email and password or check your email application')
                    console.log('Data invalid or you need verify your account first');
                }
            })
    } else {
        alert('The email or password are avoid, please enter your email and password')
        console.log('Data invalid');
    }
};

async function createToken(bodySend){
    fetch(`http://localhost:3001/api/session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodySend)
    })
        .then(response => response.json())
        .then(data => {
            if (data.status != 422){
                localStorage.setItem("token",data.token)
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error while saving your account, please try later')

        });
}