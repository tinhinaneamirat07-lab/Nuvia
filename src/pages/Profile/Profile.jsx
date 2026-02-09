import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ recipes: 0, saved: 0, planned: 0 });
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);
  const [tagline, setTagline] = useState("");
  const [favoriteCuisine, setFavoriteCuisine] = useState("");
  const [kitchenCity, setKitchenCity] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [statusSaved, setStatusSaved] = useState(false);
  const PLANNER_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPhoto = localStorage.getItem("profilePhoto");
    const storedTagline = localStorage.getItem("profileTagline");
    const storedCuisine = localStorage.getItem("profileCuisine");
    const storedCity = localStorage.getItem("profileCity");
    const storedBio = localStorage.getItem("profileBio");
    const storedPhone = localStorage.getItem("profilePhone");
    const storedWebsite = localStorage.getItem("profileWebsite");
    const storedInstagram = localStorage.getItem("profileInstagram");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedPhoto) setPhoto(storedPhoto);
    if (storedTagline) setTagline(storedTagline);
    if (storedCuisine) setFavoriteCuisine(storedCuisine);
    if (storedCity) setKitchenCity(storedCity);
    if (storedBio) setBio(storedBio);
    if (storedPhone) setPhoneNumber(storedPhone);
    if (storedWebsite) setWebsite(storedWebsite);
    if (storedInstagram) setInstagram(storedInstagram);
  }, []);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    let isMounted = true;
    setStatsLoading(true);
    setStatsError(null);

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:5000/api/recipes", { headers }),
      fetch("http://localhost:5000/api/saved-recipes", { headers }),
    ])
      .then(async ([recipesRes, savedRes]) => {
        const recipesData = recipesRes.ok ? await recipesRes.json() : [];
        const savedData = savedRes.ok ? await savedRes.json() : [];

        const recipesCount = Array.isArray(recipesData) ? recipesData.length : 0;
        const savedCount = Array.isArray(savedData) ? savedData.length : 0;
        const plannedCount = Array.isArray(recipesData)
          ? recipesData.filter((r) => PLANNER_DAYS.includes(r.category)).length
          : 0;

        if (isMounted) {
          setStats({
            recipes: recipesCount,
            saved: savedCount,
            planned: plannedCount,
          });
        }
      })
      .catch(() => {
        if (isMounted) setStatsError("Failed to load your stats.");
      })
      .finally(() => {
        if (isMounted) setStatsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("Image size should be less than 5MB.");
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
      localStorage.setItem("profilePhoto", reader.result);
      setLoading(false);
    };
    reader.onerror = () => {
      setLoading(false);
      setError("Failed to upload photo. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    localStorage.setItem("profileTagline", tagline);
    localStorage.setItem("profileCuisine", favoriteCuisine);
    localStorage.setItem("profileCity", kitchenCity);
    localStorage.setItem("profileBio", bio);
    localStorage.setItem("profilePhone", phoneNumber);
    localStorage.setItem("profileWebsite", website);
    localStorage.setItem("profileInstagram", instagram);
    
    setStatusSaved(true);

    setTimeout(() => {
      setStatusSaved(false);
    }, 3000);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    localStorage.removeItem("profilePhoto");
  };

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-empty-state">
          <div className="empty-icon">🔐</div>
          <h2>Welcome to Your Kitchen</h2>
          <p>Please log in to access your personal culinary space and manage your profile.</p>
          <a href="/login" className="empty-cta">
            Log In to Continue
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      {/* Hero Section */}
      <section className="profile-hero">
        <div className="profile-hero-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {photo ? (
                <img src={photo} alt={`${user.name}'s profile`} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="avatar-actions">
              <label className="upload-photo-btn">
                {loading ? (
                  <>
                    <span className="loader"></span>
                    Uploading...
                  </>
                ) : (
                  <>📷 {photo ? "Change Photo" : "Upload Photo"}</>
                )}
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg, image/webp"
                  hidden
                  onChange={handlePhotoChange}
                  disabled={loading}
                />
              </label>

              {photo && (
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={handleRemovePhoto}
                >
                  Remove
                </button>
              )}
            </div>

            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="profile-identity">
            <h1>{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-tagline">
              {tagline || "Crafting cozy moments, one recipe at a time."}
            </p>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{statsLoading ? "..." : stats.recipes}</span>
                <span className="stat-label">Recipes</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{statsLoading ? "..." : stats.saved}</span>
                <span className="stat-label">Saved</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">{statsLoading ? "..." : stats.planned}</span>
                <span className="stat-label">Planned</span>
              </div>
            </div>
            {statsError && <p className="error-message">{statsError}</p>}
          </div>
        </div>
      </section>

      {/* Profile Details Section */}
      <section className="profile-content">
        <div className="profile-details-card">
          <div className="card-header">
            <div className="header-content">
              <h2>Profile Details</h2>
              <p className="card-subtitle">Personalize your culinary identity and share your story</p>
            </div>
            <div className="header-icon">👤</div>
          </div>

          <div className="profile-form">
            {/* Personal Information Section */}
            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              
              <div className="form-row">
                <label className="profile-field">
                  <span className="field-label">
                    <span className="label-icon">✨</span>
                    Tagline
                  </span>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => {
                      setTagline(e.target.value);
                      setStatusSaved(false);
                    }}
                    placeholder="Your culinary motto or signature style"
                    maxLength={100}
                  />
                  <span className="field-hint">{tagline.length}/100 characters</span>
                </label>

                <label className="profile-field">
                  <span className="field-label">
                    <span className="label-icon">📍</span>
                    Kitchen Location
                  </span>
                  <input
                    type="text"
                    value={kitchenCity}
                    onChange={(e) => {
                      setKitchenCity(e.target.value);
                      setStatusSaved(false);
                    }}
                    placeholder="e.g., Paris, Tokyo, New York"
                    maxLength={50}
                  />
                </label>
              </div>

              <label className="profile-field">
                <span className="field-label">
                  <span className="label-icon">🍽️</span>
                  Favorite Cuisine
                </span>
                <input
                  type="text"
                  value={favoriteCuisine}
                  onChange={(e) => {
                    setFavoriteCuisine(e.target.value);
                    setStatusSaved(false);
                  }}
                  placeholder="e.g., Mediterranean, Asian Fusion, Italian"
                  maxLength={50}
                />
              </label>

              <label className="profile-field">
                <span className="field-label">
                  <span className="label-icon">📝</span>
                  About Me
                </span>
                <textarea
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    setStatusSaved(false);
                  }}
                  placeholder="Share your cooking journey, favorite ingredients, and what inspires you in the kitchen..."
                  maxLength={500}
                  rows={5}
                />
                <span className="field-hint">{bio.length}/500 characters</span>
              </label>
            </div>

            {/* Contact Information Section */}
            <div className="form-section">
              <h3 className="section-title">Contact & Social</h3>
              
              <div className="form-row">
                <label className="profile-field">
                  <span className="field-label">
                    <span className="label-icon">📞</span>
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setStatusSaved(false);
                    }}
                    placeholder="+1 (555) 123-4567"
                    maxLength={20}
                  />
                </label>

                <label className="profile-field">
                  <span className="field-label">
                    <span className="label-icon">🌐</span>
                    Website
                  </span>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => {
                      setWebsite(e.target.value);
                      setStatusSaved(false);
                    }}
                    placeholder="https://yourwebsite.com"
                    maxLength={100}
                  />
                </label>
              </div>

              <label className="profile-field">
                <span className="field-label">
                  <span className="label-icon">📸</span>
                  Instagram Handle
                </span>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => {
                    setInstagram(e.target.value);
                    setStatusSaved(false);
                  }}
                  placeholder="@yourusername"
                  maxLength={50}
                />
              </label>
            </div>

            {/* Save Actions */}
            <div className="profile-actions">
              <button
                type="button"
                className="save-btn"
                onClick={handleSaveProfile}
              >
                <span className="btn-icon">💾</span>
                Save All Changes
              </button>
              {statusSaved && (
                <div className="profile-saved">
                  <span className="check-icon">✓</span>
                  <span>Profile saved successfully!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
