import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero-wrapper">
      <div className="hero-content">
        <div className="hero-text">
          <div className="the-text">
            <span className="eyebrow">Nuvia EXPERIENCE</span>
            <h1>
              Cook <span className="accent">with intent</span>
              <br />
              Eat beautifully
            </h1>
            <p className="subtitle">
              A refined way to discover recipes, plan meals, and transform everyday cooking into an experience.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
