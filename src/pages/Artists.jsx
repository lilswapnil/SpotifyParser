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

export default function Artists() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [artists, setArtists] = useState([]);
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

  // Search Artists
  async function searchArtists() {
    setLoading(true);
    setError("");
    try {
      const searchParameters = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      const result = await fetch(
        "https://api.spotify.com/v1/search?q=" +
          searchInput +
          "&type=artist&limit=10",
        searchParameters
      );

      const data = await result.json();
      if (data.artists.items.length === 0) {
        throw new Error("No artists found.");
      }

      setArtists(data.artists.items);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="Artists">
      <Container>
        <div className="custom-search-bar mb-3">
          <span className="me-2">
            <i className="bi bi-search"></i>
          </span>
          <FormControl
            className="form-control"
            placeholder="Search for Artists"
            type="input"
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                searchArtists();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <Button onClick={searchArtists}>
            <i className="bi bi-folder2"></i>
          </Button>
        </div>
        {error && <p className="text-danger">{error}</p>}
      </Container>
      <Container>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            {artists.length > 0 && (
              <>
                <h3>Artists</h3>
                <Row className="mx-2 row row-cols-4 g-3">
                  {artists.map((artist) => (
                    <div key={artist.id} className="col">
                      <Card className="cards" style={{ margin: "10px" }}>
                        <Card.Img
                          variant="top"
                          src={
                            artist.images[0]?.url ||
                            "https://via.placeholder.com/150"
                          }
                          alt={artist.name}
                        />
                        <Card.Body>
                          <Card.Title>{artist.name}</Card.Title>
                          <Card.Text>
                            Followers: {artist.followers.total.toLocaleString()}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </Row>
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
