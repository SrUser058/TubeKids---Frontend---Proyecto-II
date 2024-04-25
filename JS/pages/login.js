
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
                console.log(email); console.log(password);console.log(data);  
                if(data && data.email == email && data.password == password && data.status == 'true'){
                    localStorage.setItem("currentUser", `${data._id}`);
                    location.href = "http://localhost:5500/authetication.html"
                } else {
                    alert('The email or password are avoid or dont verify your account yet!, please enter your email and password or check your email application')
                    console.log('Data invalid or you need verify your account first');
                }
                    
                /*if (data.verification == true) {
                    //console.log('Login sucess');
                    localStorage.setItem("currentUser", `${data.id}`);
                    location.href = "http://localhost:5500/usersPage.html"
                } else {
                    console.log('The email or passssword are incorrect');
                    alert('The email or password are wrong');
                }*/
            })
    } else {
        alert('The email or password are avoid, please enter your email and password')
        console.log('Data invalid');
    }
}