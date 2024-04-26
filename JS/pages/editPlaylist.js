
document.addEventListener('DOMContentLoaded', async () => {
    const query = `query{
        playlistGetByFather(father:"${localStorage.getItem("currentUser")}"){
            _id,name,father,
            linked{child},
            videos{_id,name,URL,description}
          }
    }`;
    await fetch(`http://localhost:3000/graphql`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query })
        })
        .then(response => response.json())
        .then(answer => answer.data.playlistGetByFather)
        .then(data => {
            if (!data[0]) {
                createPlaylist();
                document.getElementById("videos_list").innerHTML = `<h2>Void</h2>
                <h3>Yet you don't have a playlist to edit, this can be a error in the website, try late this page</h3>`;
            } else {
                data.forEach(playlist => {
                    let videosList = '';
                    console.log(playlist);
                    playlist.videos.forEach(video => {
                        videosList += `<br>
                        <label>
                            Name
                            <input class="video_name video_input ${playlist._id} ${video._id}" type="text" value="${video.name}">
                        </label>
                        <label> 
                            URL
                            <input class="video_URL video_input ${playlist._id} ${video._id}" type="text" value="${video.URL}">
                        </label>
                        <button class="video ${playlist._id} ${video._id}" onclick="deleteVideoAction(this.classList[1],this.classList[2])">Delete Video</button>
                        <br>
                        <label>
                            Description
                            <br><textarea class="video_text video_input ${playlist._id} ${video._id}" cols="55" rows="5">${video.description}</textarea>
                        </label>
                        `;
                    });

                    document.getElementById("videos_list").innerHTML += `<h3>${playlist.name}</h3>
                        <label> Playlist Name
                            <input class="playlist_name playlist_input ${playlist._id}" type="text" value="${playlist.name}">
                        </label>

                        <br> <br>
                        <select class="linked_list ${playlist._id}" ></select>
                        <button id="detele_child" class="${playlist._id}" onclick="deleteChild(this.classList[0])">Delete</button>

                        <select class="unlinked_list ${playlist._id}" ></select>
                        <button id="add_child" class="${playlist._id}" onclick="addChild(this.classList[0])">Add</button>

                        <div class="video_content"> <br> ${videosList}
                        <br>
                            <button id="playlist_update" class="playlist ${playlist._id}"
                            onclick="editPlaylistAction(this.classList[1])">Update Playlist</button> 
                            <button id="playlist_delete" class="playlist ${playlist._id}"
                            onclick="deletePlaylistAction(this.classList[1])">Delete Playlist</button> 
                         </div>`;

                    playlist.linked.forEach(element => {
                        getChildsInList(element.child,playlist._id)
                    });
                    getChildsOutList(playlist.father,playlist._id);
                    loadCreateVideo(playlist._id);
                })
            };
        })
        .catch(error => {
            console.log(error);
            alert('Error while loading the users list')
        });
});

// <-------------------------------------------------------->

// <------------Loaded Fetchs and Functions----------------->

// <-------------------------------------------------------->

async function getChildsInList(childID,playlistId) {
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
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query })
        })
        .then(async response => response.json())
        .then(answer => answer.data.childsGetAll.name)
        .then(data => {
            let linkedList = `<option class="linked ${playlistId} ${childID}">${data}</option>`;
            document.getElementsByClassName(`linked_list ${playlistId}`)[0].innerHTML += linkedList;
        })
};

async function getChildsOutList(fatherID, playlistId) {
    const query = `query{
        childsGetByFather(father:"${fatherID}"){
            _id,
            name
          }
    }`;
    await fetch(`http://localhost:3000/graphql`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ query })
        })
        .then(async response => response.json())
        .then(answer => answer.data.childsGetByFather)
        .then(data => {
            let unlinkedList = '';
            const linkedList = Array.from(document.getElementsByClassName("linked"));
            data.forEach(child => {
                const verif = linkedList.some(x=>x.text == child.name);
                if(verif === false){
                    unlinkedList = `<option class="unlinked ${playlistId} ${child._id}">${child.name}</option>`;
                    document.getElementsByClassName(`unlinked_list ${playlistId}`)[0].innerHTML += unlinkedList;
                }
            });
        })
}; 

function loadCreateVideo(valueId) {
    document.getElementById("videos_list").innerHTML += `<p>Add a New Video in This Playlist</p>
                        <label> Name
                            <input class="video_name create_video" type="text"></label>
                        <label> URL
                            <input class="video_URL create_video" type="text"></label> <br>
                        <label> Description <br>
                           <textarea class="video description create_text" cols="55" rows="5"></textarea> </label>
                           <br><button class="video ${valueId}" onclick="createVideoAction(this.classList[1])">Create</button>`
};

async function createPlaylist() {
    const bodySended = {
        "name": 'Default Playlist',
        "videos": {
            "name": "Enter a youtube URL",
            "URL": "The URL must be like: https://www.youtube.com/watch?v={Here the code of the video}",
            "description": "You can add a description about this video"
        },
        "father": localStorage.getItem("currentUser"),
        "linked": []
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
};

// <-------------------------------------------------------->

// <---------------------Button Actions--------------------->

// <-------------------------------------------------------->

function modifyURL(url) {
    try {
        let oldURL = new String(url);
        let newURL = oldURL.replace('watch?v=', 'embed/')
        return newURL;
    } catch {
        alert('The URL isnt of Youtube');
        throw new Error("Something had wrong while update the playlist");
    };
};

async function patchFetch(bodySended,valueId) {
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
            if (data.status != 422) {
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
};

function addChild(valueId) {
    const unlinkedSelect = document.getElementsByClassName(`unlinked_list ${valueId}`)[0];
    const childAdd = unlinkedSelect.options[unlinkedSelect.selectedIndex].classList[2];
    let childs = [];
    childs.push({"child":childAdd});
    const amoung = document.getElementsByClassName(`linked ${valueId}`);

    for (let x = 0; x < amoung.length; x++) {
        childs.push({"child":amoung[x].classList[2]});
    }

    let videosList = [];
    const amountV = document.getElementsByClassName(`video_input ${valueId}`).length - 3;
    for (let x = 0; x <= amountV; x = x + 2) {
        let oldV = {
            "name": document.getElementsByClassName(`video_input ${valueId}`)[x].value,
            "URL": document.getElementsByClassName(`video_input ${valueId}`)[x + 1].value,
            "description": document.getElementsByClassName(`video_input ${valueId}`)[x + 2].value
        };
        videosList.push(oldV);
    };

    const bodySended = {
        name: document.getElementsByClassName(`playlist_input ${valueId}`)[0].value,
        "videos": videosList,
        "father": localStorage.getItem("currentUser"),
        "linked": childs
    };
    
    patchFetch(bodySended,valueId);
}

function deleteChild(valueId){
    const linkedTag = document.getElementsByClassName(`linked_list ${valueId}`)[0];
    const childDelete = linkedTag.options[linkedTag.selectedIndex].value;
    let childs = [];
    // 
    const amoung = document.getElementsByClassName(`linked ${valueId}`);
    for (let x = 0; x < amoung.length; x++) {
        if (amoung[x].value != childDelete) {
            childs.push({"child":amoung[x].classList[2]});
        };
    }
    let videosList = [];
    const amountV = document.getElementsByClassName(`video_input ${valueId}`).length - 3;
    for (let x = 0; x <= amountV; x = x + 2) {
        let oldV = {
            "name": document.getElementsByClassName(`video_input ${valueId}`)[x].value,
            "URL": document.getElementsByClassName(`video_input ${valueId}`)[x + 1].value,
            "description": document.getElementsByClassName(`video_input ${valueId}`)[x + 2].value
        };
        videosList.push(oldV);
    };

    const bodySended = {
        name: document.getElementsByClassName(`playlist_input ${valueId}`)[0].value,
        "videos": videosList,
        "father": localStorage.getItem("currentUser"),
        "linked": childs
    };

    patchFetch(bodySended,valueId);
}

async function createVideoAction(valueId) {

    let videosList = [];
    const createVideo = {
        "name": document.getElementsByClassName('create_video')[0].value,
        "URL": modifyURL(document.getElementsByClassName('create_video')[1].value),
        "description": document.getElementsByClassName('create_video')[1].value
    };
    videosList.push(createVideo);

    const amountV = document.getElementsByClassName(`video_input ${valueId}`).length - 3;
    for (let x = 0; x <= amountV; x = x + 2) {
        let oldV = {
            "name": document.getElementsByClassName(`video_input ${valueId}`)[x].value,
            "URL": document.getElementsByClassName(`video_input ${valueId}`)[x + 1].value,
            "description": document.getElementsByClassName(`video_input ${valueId}`)[x + 2].value
        };
        videosList.push(oldV);
    };

    let childs = [];
    const amoung = document.getElementsByClassName(`linked ${valueId}`);

    for (let x = 0; x < amoung.length; x++) {
        childs.push({"child":amoung[x].classList[2]});
    }
    console.log(valueId);
    const bodySended = {
        name: document.getElementsByClassName(`playlist_input ${valueId}`)[0].value,
        "videos": videosList,
        "father": localStorage.getItem("currentUser"),
        "linked": childs
    };
    
    patchFetch(bodySended,valueId);
}

function editPlaylistAction(valueId) {
    let videosList = [];
    const amountV = document.getElementsByClassName(`video_input ${valueId}`).length - 3;
    for (let x = 0; x <= amountV; x = x + 3) {

        let oldV = {
            "name": document.getElementsByClassName(`video_input ${valueId}`)[x].value,
            "URL": modifyURL(document.getElementsByClassName(`video_input ${valueId}`)[x + 1].value),
            "description": document.getElementsByClassName(`video_input ${valueId}`)[x + 2].value
        };
        videosList.push(oldV);
    };

    let childs = [];
    const amoung = document.getElementsByClassName(`linked ${valueId}`);

    for (let x = 0; x < amoung.length; x++) {
        childs.push({"child":amoung[x].classList[2]});
    }

    const bodySended = {
        name: document.getElementsByClassName(`playlist_input ${valueId}`)[0].value,
        "videos": videosList,
        "father": localStorage.getItem("currentUser"),
        "linked": childs
    };
    patchFetch(bodySended,valueId);
}

function deleteVideoAction(valueId,videoId) {

    let videosList = [];
    const amountV = document.getElementsByClassName(`video_input ${valueId}`).length - 3;
    for (let x = 0; x <= amountV; x = x + 3) {
        if (document.getElementsByClassName(`video_input ${valueId}`)[x + 1].classList[2] != videoId) {
            let oldV = {
                "name": document.getElementsByClassName(`video_input ${valueId}`)[x].value,
                "URL": modifyURL(document.getElementsByClassName(`video_input ${valueId}`)[x + 1].value),
                "description": document.getElementsByClassName(`video_input ${valueId}`)[x + 2].value
            };
            videosList.push(oldV);
        };
    };
    let childs = [];
    const amoung = document.getElementsByClassName(`linked ${valueId}`);

    for (let x = 0; x < amoung.length; x++) {
        childs.push({"child":amoung[x].classList[2]});
    }
    const bodySended = {
        name: document.getElementsByClassName(`playlist_input ${valueId}`)[0].value,
        "videos": videosList,
        "father": localStorage.getItem("currentUser"),
        "linked": childs
    };
    patchFetch(bodySended,valueId);
};

async function deletePlaylistAction(valueId) {
    await fetch(`http://localhost:3001/api/playlists/?id=${valueId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status != 422) {
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
};
