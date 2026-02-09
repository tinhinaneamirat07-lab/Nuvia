import React, { useEffect, useState } from "react";
import "./Recipes.css";

const API = "http://localhost:5000/api/saved-recipes"; 

export default function Recipes() {
  const [saved, setSaved] = useState([]);  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [drinkActiveIndex, setDrinkActiveIndex] = useState(0);
  const [drinkPaused, setDrinkPaused] = useState(false);
  const [savedDrinks, setSavedDrinks] = useState([]);
  const token = localStorage.getItem("token"); 
  const recipes = [
    {
      _id: "1",
      title: "Golden Banana Bread",
      mood: "Soft & comforting",
      img: "/Pics/Banana Loaf with Walnuts.jpg",
      ingredients: ["Ripe bananas", "Flour", "Butter", "Brown sugar", "Walnuts"],
      steps: ["Mash bananas", "Mix wet + dry", "Fold in walnuts", "Bake until golden"],
    },
    {
      _id: "2",
      title: "Silk Tiramisu",
      mood: "Slow & indulgent",
      img: "/Pics/Tiramisú Clásico .jpg",
      ingredients: ["Mascarpone", "Espresso", "Ladyfingers", "Cocoa", "Eggs"],
      steps: ["Whisk cream", "Dip ladyfingers", "Layer & chill", "Dust cocoa"],
    },
    {
      _id: "3",
      title: "Butter Croissant",
      mood: "Warm morning ritual",
      img: "/Pics/Best Bread In France In 2025.jpg",
      ingredients: ["Flour", "Butter", "Milk", "Yeast", "Sugar"],
      steps: ["Make dough", "Laminate with butter", "Shape crescents", "Bake"],
    },
    {
      _id: "4",
      title: "Chourba Frik",
      mood: "Deep & nostalgic",
      img: "/Pics/chourba frik  copy.jpg",
      ingredients: ["Frik", "Tomato", "Onion", "Lamb", "Spices"],
      steps: ["Sauté aromatics", "Add broth", "Simmer frik", "Finish herbs"],
    },
    {
      _id: "5",
      title: "Mushroom Risotto",
      mood: "Earthy & calm",
      img: "/Pics/Velouté de Champignons Onctueux.jpg",
      ingredients: ["Arborio rice", "Mushrooms", "Stock", "Parmesan", "Butter"],
      steps: ["Toast rice", "Add stock gradually", "Stir in mushrooms", "Finish cheese"],
    },
    {
      _id: "6",
      title: "Apple Crumble",
      mood: "Golden & familiar",
      img: "/Mini Apple Crumbles with Cinnamon _ Elegant Fall Dessert.jpg",
      ingredients: ["Apples", "Cinnamon", "Flour", "Butter", "Sugar"],
      steps: ["Slice apples", "Mix crumble", "Top apples", "Bake"],
    },
    {
      _id: "7",
      title: "Honey Roasted Carrots",
      mood: "Gentle & warm",
      img: "/Roasted Honey Glazed Carrots Recipe - MushroomSalus.jpg",
      ingredients: ["Carrots", "Honey", "Olive oil", "Thyme", "Salt"],
      steps: ["Coat carrots", "Roast", "Glaze with honey", "Finish herbs"],
    },
    {
      _id: "8",
      title: "Evening Soup",
      mood: "Quiet & grounding",
      img: "/Grain-free coconut flour muffins perfect for winter mornings.jpg",
      ingredients: ["Onion", "Garlic", "Vegetable stock", "Cream", "Herbs"],
      steps: ["Sauté base", "Simmer stock", "Blend smooth", "Finish cream"],
    },
    {
      _id: "9",
      title: "Dark Chocolate Cake",
      mood: "Deep indulgence",
      img: "/Pics/Blackout Cake.jpg",
      ingredients: ["Cocoa", "Flour", "Eggs", "Sugar", "Butter"],
      steps: ["Mix batter", "Bake layers", "Cool", "Frost generously"],
    },
  ];
  const drinks = [
    {
      _id: "d1",
      title: "Citrus Spark",
      mood: "Bright & refreshing",
      img: "/Pics/Tangerine Light Mocktail _ Jeju Tangerine, Barley Tea & Yuzu.jpg",
      ingredients: ["Orange", "Lemon", "Sparkling water", "Mint", "Ice"],
      steps: ["Slice citrus", "Muddle mint", "Add ice", "Top with sparkle"],
    },
    {
      _id: "d2",
      title: "Velvet Mocha",
      mood: "Deep & cozy",
      img: "/télécharger (24).jpg",
      ingredients: ["Espresso", "Cocoa", "Milk", "Vanilla", "Sugar"],
      steps: ["Brew espresso", "Whisk cocoa", "Steam milk", "Combine & pour"],
    },
    {
      _id: "d3",
      title: "Garden Tonic",
      mood: "Herbal & crisp",
      img: "/Moxito.jpg",
      ingredients: ["Cucumber", "Lime", "Tonic", "Basil", "Ice"],
      steps: ["Slice cucumber", "Squeeze lime", "Add ice", "Top with tonic"],
    },
    {
      _id: "d4",
      title: "Spiced Chai",
      mood: "Warm & calming",
      img: "/Cozy Masala Chai Latte.jpg",
      ingredients: ["Black tea", "Milk", "Cinnamon", "Cardamom", "Honey"],
      steps: ["Simmer spices", "Brew tea", "Add milk", "Sweeten & serve"],
    },
    {
      _id: "d5",
      title: "Berry Cloud",
      mood: "Soft & sweet",
      img: "/Blue Matcha Latte_ Caffeine-Free Beauty You Can Sip.jpg",
      ingredients: ["Berries", "Yogurt", "Milk", "Honey", "Ice"],
      steps: ["Blend berries", "Add yogurt", "Add milk", "Blend smooth"],
    },
    {
      _id: "d6",
      title: "Matcha Bloom",
      mood: "Clean & earthy",
      img: "/Matcha-Infused Cold Brew with Black Sesame Foam.jpg",
      ingredients: ["Matcha", "Hot water", "Oat milk", "Honey"],
      steps: ["Whisk matcha", "Warm milk", "Combine", "Sweeten"],
    },
    {
      _id: "d7",
      title: "Rose Lemonade",
      mood: "Floral & light",
      img: "/télécharger (25).jpg",
      ingredients: ["Lemon", "Rose water", "Water", "Sugar", "Ice"],
      steps: ["Juice lemons", "Add sugar", "Mix water", "Add rose"],
    },
    {
      _id: "d8",
      title: "Cold Brew Noir",
      mood: "Bold & smooth",
      img: "/Nitro CaffÃ¨ White_ Creamy Cold Brew Coffee with Whipped Cream  Chocolate Syrup.jpg",
      ingredients: ["Coffee grounds", "Water", "Ice", "Cream"],
      steps: ["Steep overnight", "Strain", "Add ice", "Finish with cream"],
    },
    {
      _id: "d9",
      title: "Golden Latte",
      mood: "Glow & comfort",
      img: "/How to Make Golden Milk Turmeric Tea - Masala Haldi Doodh.jpg",
      ingredients: ["Turmeric", "Milk", "Ginger", "Honey", "Cinnamon"],
      steps: ["Warm milk", "Whisk spices", "Sweeten", "Serve warm"],
    },
  ];

  
  useEffect(() => {
    if (!token) return;  

    fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map((r) => r.recipeId); 
        setSaved(ids); 
      })
      .catch(console.error);  
  }, [token]); 
  
  const total = recipes.length;
  const drinkTotal = drinks.length;
  const wrapIndex = (index, length) => (index + length) % length;
  const getOffset = (index, currentIndex, length) => {
    let diff = index - currentIndex;
    if (diff > length / 2) diff -= length;
    if (diff < -length / 2) diff += length;
    return diff;
  };

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => wrapIndex(i + 1, total));
    }, 4000);
    return () => clearInterval(id);
  }, [isPaused, total]);

  useEffect(() => {
    if (drinkPaused) return;
    const id = setInterval(() => {
      setDrinkActiveIndex((i) => wrapIndex(i + 1, drinkTotal));
    }, 4000);
    return () => clearInterval(id);
  }, [drinkPaused, drinkTotal]);

  
  const toggleSave = async (recipe) => {
    if (!token) {
      alert("Please login first");
      return;
    }

    // UNSAVE the recipe
    if (saved.includes(recipe._id)) {
      
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const found = data.find((r) => r.recipeId === recipe._id);

      if (found) {
        // DELETE saved recipe from the backend
        await fetch(`${API}/${found._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
      }

     
      setSaved((prev) => prev.filter((id) => id !== recipe._id));
    }
    // SAVE the recipe
    else {
      // Send POST request to save the recipe
      await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,  
        },
        body: JSON.stringify({
          recipeId: recipe._id,
          title: recipe.title,
          image: recipe.img,
        }),
      });

     
      setSaved((prev) => [...prev, recipe._id]);
    }
  };

  const toggleDrinkSave = (drinkId) => {
    setSavedDrinks((prev) =>
      prev.includes(drinkId) ? prev.filter((id) => id !== drinkId) : [...prev, drinkId]
    );
  };

  return (
    <section className="recipes-habit" id="recipes">
      <div className="recipes-head">
        <span>RECIPES AS RITUALS</span>
        <h2>Choose a moment</h2>
      </div>

      <div className="habit-carousel">
        <div className="habit-viewport">
          {recipes.map((r, index) => {
            const offset = getOffset(index, activeIndex, total);
            return (
              <div
                key={r._id}
                className="habit-card"
                style={{
                  "--offset": offset,
                  "--abs": Math.abs(offset),
                }}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="habit-front">
                  <img src={r.img} alt={r.title} />

                  <div className="habit-overlay">
                  <div className="habit-text">
                    <h3>{r.title}</h3>
                    <p>{r.mood}</p>
                  </div>
                </div>
              </div>

                <div className="habit-back">
                  <div className="habit-back-content">
                    <h3>Ingredients</h3>
                    <ul>
                      {r.ingredients.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <h3>Steps</h3>
                    <ol>
                      {r.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>

                    <button
                      className={`habit-save habit-save-back ${saved.includes(r._id) ? "saved" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSave(r);
                      }}
                    >
                      {saved.includes(r._id) ? "\u2665 Saved" : "\u2661 Save"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <div className="recipes-head recipes-head-alt">
        <span>DRINKS AS RITUALS</span>
        <h2>Choose a sip</h2>
      </div>

      <div className="habit-carousel">
        <div className="habit-viewport">
          {drinks.map((d, index) => {
            const offset = getOffset(index, drinkActiveIndex, drinkTotal);
            return (
              <div
                key={d._id}
                className="habit-card"
                style={{
                  "--offset": offset,
                  "--abs": Math.abs(offset),
                }}
                onClick={() => setDrinkActiveIndex(index)}
                onMouseEnter={() => setDrinkPaused(true)}
                onMouseLeave={() => setDrinkPaused(false)}
              >
                <div className="habit-front">
                  <img src={d.img} alt={d.title} />

                  <div className="habit-overlay">
                    <div className="habit-text">
                      <h3>{d.title}</h3>
                      <p>{d.mood}</p>
                    </div>
                  </div>
                </div>

                <div className="habit-back">
                  <div className="habit-back-content">
                    <h3>Ingredients</h3>
                    <ul>
                      {d.ingredients.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <h3>Steps</h3>
                    <ol>
                      {d.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>

                    <button
                      className={`habit-save habit-save-back ${savedDrinks.includes(d._id) ? "saved" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDrinkSave(d._id);
                      }}
                    >
                      {savedDrinks.includes(d._id) ? "\u2665 Saved" : "\u2661 Save"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => window.location.href = "/planner"}
        className="explore-btn"
      >
        Start planning your meals
      </button>
    </section>
  );
}

