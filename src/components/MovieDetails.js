import React, { useEffect, useState, useRef } from "react";
import { KEY } from "./Constants";
import StarRating from "./StarRating";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";
import useKeyPress from "./useKeyPress";
function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const countRef = useRef(0);
  const isWatched = watched.map((movie) => movie.imdbId).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbId === selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  function handleAddWatched() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      runtime: runtime !== "N/A" ? Number(runtime.split(" ").at(0)) : 0,
      imdbRating: imdbRating !== "N/A" ? Number(imdbRating) : 0,
      userRating: Number(userRating),
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  useKeyPress("escape", onCloseMovie);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("Error! Try after some time");
          const data = await res.json();
          if (data.Response === "False") throw new Error(data.Error);
          setMovie(data);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );
  return (
    <>
      {error ? (
        <ErrorMessage />
      ) : isLoading ? (
        <Loader />
      ) : (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetMovieRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAddWatched}>
                      + Add to Watchlist
                    </button>
                  )}
                </>
              ) : (
                <p>You already rated this movie {watchedUserRating} ⭐</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            {director !== "N/A" && <p>Directed by {director}</p>}
          </section>
        </div>
      )}
    </>
  );
}

export default MovieDetails;
