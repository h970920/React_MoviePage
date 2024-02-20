import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../css/detail.css"; // CSS 파일 import

function Detail() {
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoSlide, setAutoSlide] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const sliderRef = useRef(null);

  const getMovies = async () => {
    const response = await fetch("https://yts.mx/api/v2/list_movies.json");
    const json = await response.json();
    setMovies(json.data.movies);
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    if (autoSlide) {
      const id = setInterval(() => {
        handleSlide("right");
      }, 7000);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [currentSlide, autoSlide]);

  const handleSlide = (direction) => {
    if (direction === "left") {
      setCurrentSlide((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    } else {
      setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleAutoSlideToggle = () => {
    setAutoSlide((prev) => !prev);
  };

  return (
    <div className="container">
      {movies.length > 0 ? (
        <div className="movie-slider" ref={sliderRef}>
          <div
            className="movie-slider-container"
            style={{
              transform: `translateX(-${
                currentSlide * (100 / movies.length)
              }%)`,
              width: `${movies.length * 100}%`,
            }}
          >
            {movies.map((movie, index) => (
              <div
                key={index}
                className="movie-slide"
                style={{ width: `${100 / movies.length}%` }}
              >
                <h1 className="movie-title">{movie.title}</h1>
                <img
                  className="movie-image"
                  src={movie.medium_cover_image}
                  alt={movie.title}
                />
                <div className="movie-info">
                  <p>Rating: {movie.rating}</p>
                  <p>Year: {movie.year}</p>
                </div>
                <p className="movie-summary">Summary: {movie.summary}</p>
              </div>
            ))}
          </div>
          <button
            className="movie-slider-button movie-slider-button-left"
            onClick={() => handleSlide("left")}
          >
            &lt;
          </button>
          <button
            className="movie-slider-button movie-slider-button-right"
            onClick={() => handleSlide("right")}
          >
            &gt;
          </button>
          <div className="dot-container">
            {movies.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => handleDotClick(index)}
              ></span>
            ))}
          </div>
          <button className="auto-slide-toggle" onClick={handleAutoSlideToggle}>
            {autoSlide ? "Stop Auto Slide" : "Start Auto Slide"}
          </button>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
}

export default Detail;
