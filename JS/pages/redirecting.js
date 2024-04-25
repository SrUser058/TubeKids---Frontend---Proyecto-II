
addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(document.location.search);
    console.log(params.get('id'));
    await fetch(`http://localhost:3000/graphql`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({query:`query{
            fathersGetEmail(email:"${params.get('id')}"){
                _id
              }
        }`})
    })
    .then(response => response.json())
    .then(answer => answer.data.fathersGetEmail)
    .then(data => {
        changeStatus(data._id)
    })
    .catch(e => console.log(e));
});

async function changeStatus(id) {

    await fetch(`http://localhost:3001/api/father/?id=${id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({status:true})
    })
    .then(response => response.json())    
    .then(data => {
        if (data) {
            document.getElementById('show_space').innerHTML += `<br><h3>You verify your account correctly!</h3>`; 
            document.getElementById('show_space').innerHTML += `<br><h4>You can start using our website!</h4>`; 
            alert('You are gonna be transfered to our login')
            location.href = "http://localhost:5500/login.html"
        }
        console.log('Something doesnt work');
    })
}