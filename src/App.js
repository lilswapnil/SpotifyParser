
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = "777c571d7da6439aaf522a3c54cbef52";
const CLIENT_SECRET = "854ab52143794b74a136f7b1396662fc";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    //API access token
    var authParameters = {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body : 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' +CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  //Search
    async function search() {
      console.log("Search for " + searchInput)

    //GET req using search tp set the Artist ID
      var searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      }
      var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
        .then(response => response.json())
        .then(data => {return data.artists.items[0].id})

      console.log("ArtistId is" + artistID);
    //GET req with Artist to grab the album from that artist
      var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          setAlbums(data.items);
        });
    //Display those albums
    }
  console.log(albums)

  return (
    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg' >
          <FormControl
          placeholder='Search for Artist'
          type='input'
          onKeyPress={event => {
            if(event.key === "Enter") {
              search();
            }
          }}
          onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mx-2 row row-cols-4'>
          {albums.map( (album, i) => {
            console.log(album)
            return(
              <Card className='p-2'>
                <Card.Img src={album.images[0].url} />
                <Card.Title>{album.name}</Card.Title>
                <Card.Body></Card.Body>
              </Card>  
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
