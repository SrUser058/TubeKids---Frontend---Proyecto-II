
function navEditPlaylist() {
    location.href = 'http://localhost:5500/editPlaylistPage.html';
}
function navEditUsers() {
    location.href = 'http://localhost:5500/editUsersPage.html';
}
function backPage() {
    if(localStorage.getItem("childUser")) {
        localStorage.removeItem("childUser")}
        location.href = 'http://localhost:5500/usersPage.html';
}
function logOut() {
    localStorage.clear();
    location.href = 'http://localhost:5500/login.html';
}

function navAdmin() {
    location.href = 'http://localhost:5500/adminPage.html';
}
