
document.addEventListener('DOMContentLoaded', async () => {

    const query = selectQuery();

    await fetch(`http://localhost:3000/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({ query })
    })
        .then(response => response.json())
        .then(answer => {
            if (localStorage.getItem("childUser")) {
                return answer.data.playlistGetByChild
            } else {
                return answer.data.playlistGetByFather
            }
        })
        .then(data => {
            deleteSelect('playlist_select');
            document.getElementById('playlist_space').innerHTML += '<select id="playlist_select" onchange="loadSelectVideos()"></select>';
            const playlistSelect = document.getElementById('playlist_select');
            if (!data[0]) {
                document.getElementById('iframe_space').innerHTML = `<h2>Void</h2>
                <h3>Yet you don't have a playlist to show, go to the button "Edit PlayList" or click <a href="http://localhost:5500/editPlaylistPage.html">here</a> to go</h3>`;
                loadSelectVideos(undefined)
            } else {
                data.forEach(playlist => {
                    playlistSelect.innerHTML +=
                        `<option class="playlist_options ${playlist._id}">${playlist.name}</option>`;
                });
                document.getElementsByClassName(`playlist_options`)[0].selected = true;
                loadSelectVideos();
            }
        })
        .catch(error => {
            alert('Error while loading the video on the screen')
            console.log(error);
        })
});

function selectQuery() {
    const query = `query{
            playlistGetByFather(father:"${localStorage.getItem("currentUser")}"){
                _id,
                name,
                videos{name,URL,description}
            }
          }`;
    if (localStorage.getItem("childUser")) {
        const query = `query{
            playlistGetByChild(child:"${localStorage.getItem("childUser")}"){
                _id,
                name,
                videos{name,URL,description}
            }
        }`;
        return query;
    }
    return query
}

async function loadSelectVideos() {

    const select = document.getElementById('playlist_select');

    if (!select.options[select.selectedIndex].classList[1]) {
        deleteSelect('video_select');
        document.getElementById('video_space').innerHTML += '<select id="video_select" onchange="loadVideo(this.id)"></select>';
        document.getElementById('video_select').innerHTML +=
            `<option selected>Void</option>`;
    }
    else {
        const playlistId = select.options[select.selectedIndex].classList[1];
        const query = `query{
            playlistGetAll(_id:"${playlistId}"){
                videos{name,URL}
            }
        }`;

        await fetch(`http://localhost:3000/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ query })
        })
            .then(response => response.json())
            .then(answer => answer.data.playlistGetAll)
            .then(data => {
                deleteSelect('video_select');
                document.getElementById('video_space').innerHTML += '<select id="video_select" onchange="loadVideo(this.id)"></select>';
                data.videos.forEach(element => {
                    document.getElementById('video_select').innerHTML +=
                        `<option class="loaded_videos" value="${element.URL}">${element.name}</option>`;
                });
                document.getElementsByClassName('loaded_videos')[0].setAttribute('selected', true);
            })
        loadVideo('video_select');
    }
};

function loadVideo(selectId) {
    try {
        const select = document.getElementById(selectId);
        let URL = select.options[select.selectedIndex].value;
        if (document.getElementById("video_iframe") != undefined) {
            document.getElementById("video_iframe").remove();
        }
        document.getElementById('iframe_space').innerHTML = `
                <iframe id="video_iframe" style="pointer-events: none;"  width="1000" height="500"
                src="${URL}?rel=0?version=3&autoplay=1&controls=0&&showinfo=0&&loop=1"
                frameborder="0"
                allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                ></iframe>`;
    } catch (error) {
        console.log(error);
    }
};

function deleteSelect(selectId) {
    if (document.getElementById(selectId) != undefined) {
        document.getElementById(selectId).remove();
    }

}

// <-------------------------------------------------------->

// <--------------------Search Videos----------------------->

// <-------------------------------------------------------->

async function searchPlaylist() {
    const query = selectQuery();

    await fetch(`http://localhost:3000/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({ query })
    })
        .then(response => response.json())
        .then(answer => {
            if (localStorage.getItem("childUser")) {
                return answer.data.playlistGetByChild
            } else {
                return answer.data.playlistGetByFather
            }
        }).then(data => {
            if (!data) {
                alert('Not found videos with the writed word')
            } else {
                let foundList = [];
                const searchText = document.getElementById('search_input').value.toLowerCase();
                let name = "";
                let description = "";
                data.forEach(playlist => {
                    playlist.videos.forEach(video => {
                        name = video.name;
                        description = video.description;
                        if (name.includes(searchText) || description.includes(searchText)) {
                            foundList.push({ "name": video.name, "URL": video.URL });
                        }
                    });
                })
                deleteSelect('found_select');
                document.getElementById('search_space').innerHTML += '<select id="found_select" onchange="loadVideo(this.id)" hidden></select>';
                foundList.forEach(element => {
                    document.getElementById('found_select').innerHTML +=
                        `<option class="found_videos" value="${element.URL}">${element.name}</option>`;
                });
                document.getElementsByClassName('found_videos')[0].setAttribute('selected', true);
                document.getElementById('found_select').removeAttribute('hidden');
            }
        })
}