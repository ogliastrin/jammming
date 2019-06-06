const client_id = 'e1a5480daaa74aaab69706f6b5c5d2bb';
const redirect_uri = 'http://localhost:3000/';

let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const spotifyAuthorizeUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
      window.location = spotifyAuthorizeUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    const spotifySearchAPI = "https://api.spotify.com/v1/search";
    return fetch(`${spotifySearchAPI}?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("API request failed");
        }
      })
      .then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          cover: track.album.images[2].url
        }));
      });
  },

  savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) {
      return;
    }

    //Setting accessToken to current user access token
    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let usersId;

    //fetch request converting to JSON
    const userUrl = "https://api.spotify.com/v1/me";

    return fetch(userUrl, { headers: headers })
      .then(response => response.json())
      .then(jsonResponse => {
        usersId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${usersId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name })
        })
          .then(response => response.json())
          .then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${usersId}/playlists/${playlistId}/tracks`,
              {
                headers: headers,
                method: "POST",
                body: JSON.stringify({ uris: trackURIs })
              }
            );
          });
      });
  }
};

export default Spotify;
