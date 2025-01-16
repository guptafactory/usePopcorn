import { useEffect, useState } from "react";

import { KEY } from "./Constants";
function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("Error! Try after some time");
          const data = await res.json();
          if (data.Response === "False") throw new Error(data.Error);
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        // handleCloseMovie?.();
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return [movies, isLoading, error];
}

export default useMovies;
