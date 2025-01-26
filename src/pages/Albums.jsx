import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  FormControl,
  Button,
  Row,
  Card,
  Spinner,
} from "react-bootstrap";

const CLIENT_ID = "777c571d7da6439aaf522a3c54cbef52";
const CLIENT_SECRET = "854ab52143794b74a136f7b1396662fc";

export default function Albums() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get API access token
    const authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token))
      .catch(() => setError("Failed to authenticate with Spotify."));
  }, []);

  async function search() {
    setLoading(true);
    setError("");
    try {
      // Search for the artist ID
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const artistID = await fetch(
        "https://api.spotify.com/v1/search?q=" +
          searchInput +
          "&type=artist",
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.artists.items.length === 0) {
            throw new Error("Artist not found");
          }
          return data.artists.items[0].id;
        });

      // Fetch albums for the artist
      await fetch(
        `https://api.spotify.com/v1/artists/${artistID}/albums?include_groups=album&market=US&limit=50`,
        searchParameters
      )
        .then((response) => response.json())
        .then((data) => setAlbums(data.items));
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="Albums">
      <Container>
        <div className="custom-search-bar mb-3">
          <span className="me-2">
            <i className="bi bi-search"></i>
          </span>
          <FormControl
            className="form-control"
            placeholder="Search for Albums"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={search}>
            <i className="bi bi-folder2"></i>
          </Button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </Container>
      <Container>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Row className="mx-2 row row-cols-4 g-3">
            {albums.map((album) => (
              <Card key={album.id} className="cards">
                <Card.Img
                  variant="top"
                  src={album.images[0]?.url}
                  alt={album.name}
                />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
