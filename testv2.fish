#! /usr/local/bin/fish

set routes \
        movies \
        moviesFeed \
        movieCinema \
        movieCinemaAvailable \
        movieCinemaTheater \
        cinemas \
        cinemaMovies

set hostname http://localhost:3000/api/v2
set movies $hostname/movies
set moviesFeed $hostname/movies/feed
set movieCinema $hostname/movies/995/cinemas
set movieCinemaAvailable $hostname/movies/995/cinemas/available
set movieCinemaTheater $hostname/movies/995/cinemas/196/theaters
set cinemas $hostname/cinemas
set cinemaMovies $hostname/cinemas/196/movies

for i in (seq (count $$routes))
    echo curl '-->' $$routes[$i]
    echo (command curl -sb -H $$routes[$i])
    echo
end