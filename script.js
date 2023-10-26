const clientId = "d16765439d515cb";
var defaultAlbumId = 'Jfni3';

function requestAlbum() {
    let albumId = document.getElementById("albumIdField").innerText;
    if(!albumId) {
        albumId = defaultAlbumId;
    }
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            processAlbumRequest(req.responseText);
        }
        else if (req.readyState == 4 && req.status != 200) {
            console.log(req.status + " Error with the imgur API: ", req.responseText);
        }
    }
    req.open('GET', 'https://api.imgur.com/3/album/' + albumId + '/images', true); // true for asynchronous     
    req.setRequestHeader('Authorization', 'Client-ID ' + clientId);
    req.send();
}

function processAlbumRequest(response_text) {
    var respObj = JSON.parse(response_text);
    for (item of respObj.data.slice(0, 10)){
        console.log(item)
        requestImage(item.id);
    }
}

function requestImage(imageHash) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            processImageRequest(req.responseText);
        }
        else if (req.readyState == 4 && req.status != 200) {
            console.log("Error with the imgur API");
        }
    }
    req.open("GET", "https://api.imgur.com/3/image/" + imageHash, true); // true for asynchronous     
    req.setRequestHeader('Authorization', 'Client-ID ' + clientId);
    req.send();
}

function processImageRequest(response_text) {
    var respObj = JSON.parse(response_text);
    let imgElem = document.createElement("img");
    imgElem.src = respObj.data.link;
    //imgElem.referrerpolicy="no-referrer";
    document.body.appendChild(imgElem);
}

function viewImagesWithPromises() {
    let albumId = document.getElementById("albumIdField").value; // Use .value to get input value

    if (!albumId) {
        albumId = defaultAlbumId;
    }

    fetch('https://api.imgur.com/3/album/' + albumId + '/images', {
        method: 'GET',
        headers: {
            'Authorization': 'Client-ID ' + clientId,
        }
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                console.log(response.status + " Error with the imgur API");
            }
        })
        .then(data => {
            for (let item of data.data.slice(0, 10)) {
                requestImage(item.id);
            }
        })
        .catch(error => {
            console.error("Error fetching album data:", error);
        });
}

// Function to fetch images using async/await
async function viewImagesWithAsyncAwait() {
    let albumId = document.getElementById("albumIdField").value;

    if (!albumId) {
        albumId = defaultAlbumId;
    }

    try {
        const response = await fetch('https://api.imgur.com/3/album/' + albumId + '/images', {
            method: 'GET',
            headers: {
                'Authorization': 'Client-ID ' + clientId,
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            for (let item of data.data.slice(0, 10)) {
                requestImage(item.id);
            }
        } else {
            console.log(response.status + " Error with the imgur API");
        }
    } catch (error) {
        console.error("Error fetching album data:", error);
    }
}
