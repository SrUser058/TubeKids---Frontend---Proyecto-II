
document.addEventListener('DOMContentLoaded', async () => {
    const query = `query{
        playlistGetByFather(father:"${localStorage.getItem("currentUser")}"){
            _id,name,
            linked{child},
            videos{name,URL,description}
          }
    }`;
    await fetch(`http://localhost:3000/graphql`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(answer => answer.data.playlistGetByFather)
        .then(data => {
            //console.log(data[0].videos[0]);
            if (!data[0]) {
                createPlaylist();
                document.getElementById("videos_list").innerHTML = `<h2>Void</h2>
                <h3>Yet you don't have a playlist to edit, this can be a error in the website, try late this page</h3>`;
            } else {
                data.forEach(playlist => {
                    let videosList = '';
                    let linkedList = '';
                    playlist.videos.forEach(element => {
                        videosList += `
                        <label>
                            Name
                            <input class="video_name video_input ${element._id}" type="text" value="${element.name}">
                        </label>
                        <label> 
                            URL
                            <input class="video_URL video_input ${element._id}" type="text" value="${element.URL}">
                        </label>
                        <button value="${element._id}" class="video" onclick="deleteVideoAction(this.value)">Delete</button>
                        `;
                    });
                    playlist.linked.forEach(element => {
                        linkedList += `
                        <option class="linked" value="${element.child}">${getChildName(element.child)}</option>
                        `;
                    });
                    
                    
                    
                    document.getElementById("videos_list").innerHTML += `<h2>${playlist.name}</h2>
                        <label> Playlist Name
                            <input class="playlist_name playlist_input ${playlist._id}" type="text" value="${playlist.name}">
                        </label>
                        <select class="linked_list ${playlist._id}" id=""></select>
                        <div class="video_content"> ${videosList}
                            <button value="${playlist._id}" id="video_update" class="video"
                            onclick="editVideoAction(this.value)">Update</button> 
                         </div>`;
                })
                loadCreateVideo(playlist._id);
            };
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the users list')
        });
});

async function getChildName(childID) {
    const query = `query{
        childsGetAll(_id:"${childID}"){
            name
          }
    }`;
    await fetch(`http://localhost:3000/graphql`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(answer => {return answer.data.childsGetAll.name})
}

function loadCreateVideo(valueId) {
    document.getElementById("videos_list").innerHTML += `<label> Name
                        <input class="video_name create_video" type="text"></label>
                        <label> URL
                        <input class="video_URL create_video" type="text"></label>
                        <button value="${valueId}" class="video" onclick="createVideoAction(this.value)">Create</button>`
};

async function createPlaylist() {
    const bodySended = {
        "name": 'Default Playlist',
        "videos": {
            "name": "Enter a youtube URL",
            URL: "The URL must be like: https://www.youtube.com/watch?v={Here the code of the video}"
        },
        "father": localStorage.getItem("currentUser")
    };

    await fetch(`http://localhost:3001/api/playlists/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodySended)
        })
        .then(response => response.json())
        .then(data => {
            if (data.errorSend != 422) {
                location.href = 'http://localhost:5500/editPlaylistPage.html';
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading a change in the server');
        });
}

async function createVideoAction(valueId) {

    let videosList = [];
    const createVideo = {
        "name": document.getElementsByClassName('create_video')[0].value,
        "URL": modifyURL(document.getElementsByClassName('create_video')[1].value)
    };
    videosList.push(createVideo);

    const amountV = document.getElementsByClassName('video_input').length - 2;
    for (let x = 0; x <= amountV; x = x + 2) {
        let oldV = {
            "name": document.getElementsByClassName('video_input')[x].value,
            "URL": document.getElementsByClassName('video_input')[x + 1].value
        };
        videosList.push(oldV);
    };


    const bodySended = {
        name: document.getElementsByClassName('playlist_input')[0].value,
        "videos": videosList,
        "father": localStorage.getItem("currentUser")
    };
    //console.log(valueId);
    await fetch(`http://localhost:3001/api/playlists/?id=${valueId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodySended)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result != 422) {
                location.href = 'http://localhost:5500/editPlaylistPage.html';
            } else {
                alert('Error while loading the changes in the server');
                throw new Error("Something had wrong while update the playlist");
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the changes in the server');
        });
}

async function editVideoAction(videoId) {
    let videosList = [];
    const amountV = document.getElementsByClassName('video_input').length - 2;
    for (let x = 0; x <= amountV; x = x + 2) {

        let oldV = {
            "name": document.getElementsByClassName('video_input')[x].value,
            "URL": modifyURL(document.getElementsByClassName('video_input')[x + 1].value)
        };
        videosList.push(oldV);
    };

    const bodySended = {
        name: document.getElementsByClassName('playlist_input')[0].value,
        "videos": videosList,
        "father": localStorage.getItem("currentUser")
    };
    //console.log(valueId);
    await fetch(`http://localhost:3001/api/playlists/?id=${valueId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodySended)
        })
        .then(response => response.json())
        .then(data => {

            if (data.result != 422) {
                location.href = 'http://localhost:5500/editPlaylistPage.html';
            } else {
                alert('Error while loading the changes in the server');
                throw new Error("Something had wrong while update the playlist");
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the changes in the server');
        });
}

async function deleteVideoAction(videoId) {

    let videosList = [];
    const valueId = document.getElementById('video_update').value;
    const amountV = document.getElementsByClassName('video_input').length - 2;
    for (let x = 0; x <= amountV; x = x + 2) {
        if (document.getElementsByClassName('video_input')[x + 1].classList[2] != videoId) {
            let oldV = {
                "name": document.getElementsByClassName('video_input')[x].value,
                "URL": modifyURL(document.getElementsByClassName('video_input')[x + 1].value)
            };
            videosList.push(oldV);
        };
    };
    console.log(videosList);
    const bodySended = {
        name: document.getElementsByClassName('playlist_input')[0].value,
        "videos": videosList,
        "father": localStorage.getItem("currentUser")
    };
    //console.log(valueId);
    await fetch(`http://localhost:3001/api/playlists/?id=${valueId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodySended)
        })
        .then(response => response.json())
        .then(data => {
            if (data.result != 422) {
                location.href = 'http://localhost:5500/editPlaylistPage.html';
            } else {
                alert('Error while loading the changes in the server');
                throw new Error("Something had wrong while update the playlist");
            }
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the changes in the server');
        });
}

function modifyURL(url) {
    try {
        let oldURL = new String(url);
        let newURL = oldURL.replace('watch?v=', 'embed/')
        return newURL;
    } catch {
        alert('The URL isnt of Youtube');
        throw new Error("Something had wrong while update the playlist");
    };
}
