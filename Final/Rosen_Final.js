const API_KEY = "495315f4";

const searchForm = document.getElementById("searchForm");
const exportBtn = document.getElementById("exportBtn");
const clearBtn = document.getElementById("clearBtn");

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  searchMovies();
});

exportBtn.addEventListener("click", exportFavorites);
clearBtn.addEventListener("click", clearFavorites);

function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();
  const message = document.getElementById("message");
  const results = document.getElementById("results");

  if (!query) {
    message.textContent = "Please enter a movie title.";
    return;
  }

  message.textContent = "Loading...";
  results.innerHTML = "";

  fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "False") {
        message.textContent = "No results found.";
        return;
      }

      message.textContent = "";
      data.Search.slice(0, 8).forEach(movie => {
        const div = document.createElement("div");
        div.className = "movie";
        div.innerHTML = `
          <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/100x150?text=No+Image"}"
               alt="${movie.Title} poster" width="100">
          <strong>${movie.Title}</strong> (${movie.Year})
          <button aria-label="Add ${movie.Title} to favorites">⭐ Favorite</button>
        `;
        const btn = div.querySelector("button");
        btn.addEventListener("click", () => addFavorite(movie));
        results.appendChild(div);
      });
    })
    .catch(() => {
      message.textContent = "Network or API error: Unable to reach OMDb.";
    });
}

function addFavorite(movie) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favs.some(f => f.imdbID === movie.imdbID)) {
    movie.tags = [];
    favs.push(movie);
    localStorage.setItem("favorites", JSON.stringify(favs));
  }
  displayFavorites();
}

function addTagToFavorite(id, tag) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  const movie = favs.find(f => f.imdbID === id);
  if (movie) {
    movie.tags = movie.tags || [];
    if (!movie.tags.includes(tag)) movie.tags.push(tag);
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
  displayFavorites();
}

function displayFavorites() {
  const favBox = document.getElementById("favorites");
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favBox.innerHTML = "";

  if (favs.length === 0) {
    favBox.innerHTML = "<p>No favorites yet. Search and add some!</p>";
    return;
  }

  favs.forEach(movie => {
    const div = document.createElement("div");
    div.className = "fav";

    const tagsHtml = (movie.tags || [])
      .map(t => `<span class="tag">${t}</span>`)
      .join(" ");

    div.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/100x150?text=No+Image"}"
           alt="${movie.Title} poster" width="100">
      <strong>${movie.Title}</strong> (${movie.Year})

      <div class="tag-box">${tagsHtml || "<em>No tags yet</em>"}</div>

      <div class="tag-input">
        <input placeholder="Add tag…" aria-label="Add tag to ${movie.Title}">
        <button class="addTagBtn">Add Tag</button>
      </div>

      <button aria-label="Remove ${movie.Title} from favorites">❌ Remove</button>
    `;

    div.querySelector(".addTagBtn").addEventListener("click", () => {
      const tagField = div.querySelector("input");
      const tag = tagField.value.trim();
      if (tag) {
        addTagToFavorite(movie.imdbID, tag);
        tagField.value = "";
      }
    });

    div.querySelector("button[aria-label^='Remove']").addEventListener("click", () => {
      removeFavorite(movie.imdbID);
    });

    favBox.appendChild(div);
  });
}

function removeFavorite(id) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favs = favs.filter(f => f.imdbID !== id);
  localStorage.setItem("favorites", JSON.stringify(favs));
  displayFavorites();
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
