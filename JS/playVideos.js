
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
            if (!data[0]) {
                document.getElementById('iframe_space').innerHTML = `<h2>Void</h2>
                <h3>Yet you don't have a playlist to show, go to the button "Edit PlayList" or click <a href="http://localhost:5500/editPlaylistPage.html">here</a> to go</h3>`;
                loadSelect(undefined)
            } else {
                document.getElementById('iframe_space').innerHTML = `<h2>${data[0].name}</h2>
                <iframe id="video_iframe" style="pointer-events: none;"  width="1000" height="500"
                src="${data[0].videos[0].URL}?rel=0?version=3&autoplay=1&controls=0&&showinfo=0&&loop=1"
                frameborder="0"
                allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                ></iframe>`;
                loadSelect(data[0].videos)
            };
        })
        .catch(error => {
            alert('Error while loading the video on the screen')
            console.log(error);
        })
});

function selectQuery() {
    const query = `query{
        playlistGetByFather(father:"${localStorage.getItem("currentUser")}"){
            name,
            videos{
              name,
              URL
            }
          }
          }`;
    if (localStorage.getItem("childUser")) {
        const query = `query{
            playlistGetByChild(child:"${localStorage.getItem("childUser")}"){
                name,
                videos{
                  name,
                  URL
                }
              }
        }`;
        return query;
    }
    return query
}

function loadSelect(playlist) {
    if(!playlist){
        document.getElementById('playlist_select').innerHTML +=
         `<option value="None selected">Void</option>`;
    }
    else{
        playlist.forEach(element => {
            document.getElementById('playlist_select').innerHTML +=
             `<option value="${element.URL}">${element.name}</option>`;
        });
    }
};

function loadVideo(selectTag) {
    try {
        const URL = selectTag.options[selectTag.selectedIndex].value;
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