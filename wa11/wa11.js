const API_KEY = "495315f4";

const searchBtn = document.getElementById("searchBtn");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

searchBtn.addEventListener("click", searchMovies);
exportBtn.addEventListener("click", exportFavorites);
clearBtn.addEventListener("click", clearFavorites);

function searchMovies() {
  const query = document.getElementById("searchInput").value;
  const message = document.getElementById("message");
  const results = document.getElementById("results");

  if (!query) return;
  
  message.textContent = "Loading...";
  results.innerHTML = "";

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "False") {
        message.textContent = "No results.";
        return;
      }
      message.textContent = "";
      data.Search.slice(0, 8).forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie";
        div.textContent = `${movie.Title} (${movie.Year})`;
        const btn = document.createElement("button");
        btn.textContent = "⭐ Favorite";
        btn.onclick = () => addFavorite(movie);
        div.appendChild(btn);
        results.appendChild(div);
      });
    })
    .catch(() => {
      message.textContent = "Error fetching movies.";
    });
}

function addFavorite(movie) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favs.some(f => f.imdbID === movie.imdbID)) {
    favs.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favs));
  }
  displayFavorites();
}

function displayFavorites() {
  const favBox = document.getElementById("favorites");
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favBox.innerHTML = "";

  favs.forEach(movie => {
    const div = document.createElement("div");
    div.className = "fav";
    div.textContent = `${movie.Title} (${movie.Year})`;
    favBox.appendChild(div);
  });
}

function exportFavorites() {
  const favs = localStorage.getItem("favorites") || "[]";
  const blob = new Blob([favs], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "favorites.json";
  a.click();
}

function clearFavorites() {
  localStorage.removeItem("favorites");
  displayFavorites();
}

window.onload = displayFavorites;
