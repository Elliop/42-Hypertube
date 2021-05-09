function popcornResToMyObject(movie, response) {
    
    for (let j = 0; j < response.data.MovieList.length; j++) {
        var items = [];
        var big_image = "";
        var med_image = "";
        if (response.data.MovieList[j].items.length > 0) {
            for (let i = 0; i < response.data.MovieList[j].items.length; i++) {
                items.push({
                    "hash": response.data.MovieList[j].items[i].id,
                    "quality": response.data.MovieList[j].items[i].quality
                });
            }

        }

        String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };

        if (typeof response.data.MovieList[j].poster_med !== "undefined" && response.data.MovieList[j].poster_med.length > 5) {
            if (response.data.MovieList[j].poster_med[4] !== "s")
                med_image = response.data.MovieList[j].poster_med.splice(4, 0, "s");
            else
                med_image = response.data.MovieList[j].poster_med;
        }

        if (typeof response.data.MovieList[j].poster_big !== "undefined" && response.data.MovieList[j].poster_big.length > 5) {
            if (response.data.MovieList[j].poster_big[4] !== "s")
                big_image = response.data.MovieList[j].poster_big.splice(4, 0, "s");
            else
                big_image = response.data.MovieList[j].poster_big;
        }

        if (big_image !== null && med_image !== null && big_image !== "" && med_image !== "") {
            movie.push({
                "id": response.data.MovieList[j].id.toString(),
                "imdb": response.data.MovieList[j].imdb,
                "description": response.data.MovieList[j].description,
                "actors": response.data.MovieList[j].actors ? response.data.MovieList[j].actors : "",
                "genres": response.data.MovieList[j].genres,
                "title": response.data.MovieList[j].title,
                "trailer": response.data.MovieList[j].trailer ? response.data.MovieList[j].trailer : "",
                "items": items,
                "rating": response.data.MovieList[j].rating,
                "year": response.data.MovieList[j].year,
                "big_image": big_image,
                "med_image": med_image,
                "runtime": response.data.MovieList[j].runtime,
                "directors": typeof response.data.MovieList[j].directors !== "undefined" ? response.data.MovieList[j].directors : "",
                "writers": typeof response.data.MovieList[j].writers !== "undefined" ? response.data.MovieList[j].writers : "",
                "api": "pc"
            });
        }
    }
    return movie;
}

function ytsResToMyObject(movie, response) {
    for (let j = 0; j < response.data.movies.length; j++) {
        var items = [];
        if (response.data.movies[j].torrents.length > 0) {
            for (let i = 0; i < response.data.movies[j].torrents.length; i++) {
                items.push({
                    "hash": response.data.movies[j].torrents[i].hash,
                    "quality": response.data.movies[j].torrents[i].quality
                });
            }

        }
        String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
        movie.push({
            "id": response.data.movies[j].id.toString(),
            "imdb": response.data.movies[j].imdb_code,
            "description": response.data.movies[j].description_full,
            "actors": response.data.movies[j].actors ? response.data.movies[j].actors : "",
            "genres": response.data.movies[j].genres,
            "title": response.data.movies[j].title,
            "trailer": response.data.movies[j].trailer ? response.data.movies[j].trailer : "",
            "items": items,
            "rating": response.data.movies[j].rating,
            "year": response.data.movies[j].year,
            "big_image": response.data.movies[j].large_cover_image.splice(8, 0, "img."),
            "med_image": response.data.movies[j].medium_cover_image.splice(8, 0, "img."),
            "runtime": response.data.movies[j].runtime,
            "directors": typeof response.data.movies[j].directors !== "undefined" ? response.data.movies[j].directors : "",
            "writers": typeof response.data.movies[j].writers !== "undefined" ? response.data.movies[j].writers : "",
            "api": "yts"
        });
    }
    return movie;
}

function movieYtsResToMyObject(movie, response) {
    if (typeof response.data.movie.torrents !== "undefined" && typeof response.data.movie.torrents.length !== "undefined") {
        var items = [];
        if (response.data.movie.torrents.length > 0) {
            for (let i = 0; i < response.data.movie.torrents.length; i++) {
                items.push({
                    "hash": response.data.movie.torrents[i].hash,
                    "quality": response.data.movie.torrents[i].quality
                });
            }

        }
        String.prototype.splice = function (idx, rem, str) {
            return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
        };
        movie.push({
            "id": response.data.movie.id.toString(),
            "imdb": response.data.movie.imdb_code,
            "description": response.data.movie.description_full,
            "actors": response.data.movie.actors ? response.data.movie.actors : "",
            "genres": response.data.movie.genres,
            "title": response.data.movie.title,
            "trailer": response.data.movie.trailer ? response.data.movie.trailer : "",
            "items": items,
            "rating": response.data.movie.rating,
            "year": response.data.movie.year,
            "big_image": response.data.movie.large_cover_image.splice(8, 0, "img."),
            "med_image": response.data.movie.medium_cover_image.splice(8, 0, "img."),
            "runtime": response.data.movie.runtime,
            "directors": typeof response.data.movie.directors !== "undefined" ? response.data.movie.directors : "",
            "writers": typeof response.data.movie.writers !== "undefined" ? response.data.movie.writers : "",
            "api": "yts"
        });
    }

    return movie;
}

module.exports = {
    ytsResToMyObject,
    popcornResToMyObject,
    movieYtsResToMyObject
}