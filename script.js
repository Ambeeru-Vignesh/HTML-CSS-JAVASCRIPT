const form = document.getElementById('form');
const search = document.getElementById('search')
const result = document.getElementById('result')
const more = document.getElementById('more')

var apiURL = "https://api.lyrics.ovh"

async function searchsong(songname) {
    //without asynchronous await
    // fetch(`${apiURL}/suggest/${songname}`).then(res => res.json()).then(data => console.log(data))
    const res = await fetch(`${apiURL}/suggest/${songname}`);
    const data = await res.json();
    showdata(data);
    console.log(data)
}

function showdata(data) {

    let suggest = ''
    data.data.forEach(song => {
        suggest += `
        <li>
        <span><strong>${song.artist.name}</strong>- ${song.album.title}</span>
        <button class="btn2" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
        `
    });


    result.innerHTML = `<ul class="songs">
    ${suggest}</ul>`

    if (data.prev || data.next) {
        more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn2" onclick="getmoresongs('${data.prev}')">Prev</button>`
          : ''
      }
      ${
        data.next
          ? `<button class="btn2" onclick="getmoresongs('${data.next}')">Next</button>`
          : ''
      }
    `;
    } else {
        more.innerHTML = '';
    }
}



async function getmoresongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    showdata(data);
}


//event listeners
form.addEventListener('submit', e => {
    e.preventDefault();
    const searchterm = search.value.trim()

    if (!searchterm) {
        alert("Please type in Search bar!")
    } else {
        searchsong(searchterm)
    }
})


// Accesing lyrics

result.addEventListener("click", e => {
    const clicked = e.target;

    if (clicked.tagName === 'BUTTON') {
        const artist_name = clicked.getAttribute("data-artist")
        const artist_song_name = clicked.getAttribute("data-songtitle")


        getLyrics(artist_name, artist_song_name);
    }
})

//function to display lyrics

async function getLyrics(artist_name, artist_song_name) {
    const res = await fetch(`${apiURL}/v1/${artist_name}/${artist_song_name}`)
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    result.innerHTML = `<h2 class="title_lyric"><strong>${artist_name}</strong> - ${artist_song_name}</h2><br>
    <span>${lyrics}</span>`;
    more.innerHTML = ''
}