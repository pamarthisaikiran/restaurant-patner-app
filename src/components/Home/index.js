import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase'; 
import { collection, query, where, updateDoc, doc, deleteDoc, addDoc, onSnapshot } from 'firebase/firestore'; 
import Header from '../Header';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import "./index.css";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    city: '',
    area: '',
    location: '',
    latitude: null,
    longitude: null,
    open: true,
    imageUrl: '',  // New field for image URL
    category: '',   // New field for category
  });
  const [editId, setEditId] = useState(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // New loading state for authentication check
  const navigate = useNavigate();
  
  const user = auth.currentUser;

  const fetchRestaurants = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, 'restaurants'), where("owner_id", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRestaurants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); 
      setLoading(false);
    }, (error) => {
      console.error("Error fetching restaurants:", error);
      setLoading(false);
    });

    return unsubscribe;
  };

  useEffect(() => {
    // Check for user authentication
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/login');
      }
      setIsAuthChecked(true); // Mark that the authentication check is complete
    });

    const unsubscribe = fetchRestaurants();
    
    return () => {
      unsubscribeAuth();
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [navigate]);

  useEffect(() => {
    setIsLoadingMap(false);
  }, [restaurantData.latitude, restaurantData.longitude]);

  const handleToggleOpen = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await updateDoc(doc(db, 'restaurants', id), { open: updatedStatus });
    } catch (error) {
      console.error("Error updating restaurant status:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      try {
        await updateDoc(doc(db, 'restaurants', editId), { ...restaurantData });
        setEditId(null);
        setRestaurantData({ name: '', city: '', area: '', location: '', latitude: null, longitude: null, open: true, imageUrl: '', category: '' });
      } catch (error) {
        console.error("Error updating restaurant:", error);
      }
    } else {
      if (restaurants.length === 0) {
        try {
          await addDoc(collection(db, 'restaurants'), { ...restaurantData, owner_id: user.uid });
          setRestaurantData({ name: '', city: '', area: '', location: '', latitude: null, longitude: null, open: true, imageUrl: '', category: '' });
        } catch (error) {
          console.error("Error adding restaurant:", error);
        }
      } else {
        alert("You can only manage one restaurant. Please edit the existing one.");
      }
    }
  };

  const handleEditRestaurant = (restaurant) => {
    setRestaurantData(restaurant);
    setEditId(restaurant.id);
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      await deleteDoc(doc(db, 'restaurants', id));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const handleCancel = () => {
    setRestaurantData({ name: '', city: '', area: '', location: '', latitude: null, longitude: null, open: true, imageUrl: '', category: '' });
    setEditId(null);
  };

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setRestaurantData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: `${lat}, ${lng}`,
    }));
    setIsLoadingMap(true);
  };

  if (!isAuthChecked) {
    return <div className="loading-spinner"><p>Loading...</p></div>; // Show loading spinner until auth is checked
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="home-content">
        <h1>Welcome to Your Restaurant Dashboard</h1>
        <p>Manage your restaurant here.</p>
      </div>

      <div className="flex-container">
        <div className="restaurant-list">
          {restaurants.length > 0 ? (
            <>
              <h2>Your Restaurant</h2>
              <ul>
                {restaurants.map((restaurant) => (
                  <li key={restaurant.id} className="restaurant-item">
                    <h3>{restaurant.name}</h3>
                    <img src={restaurant.imageUrl} alt="Restaurant" width="100" /> {/* Display restaurant image */}
                    <p>City: {restaurant.city}</p>
                    <p>Area: {restaurant.area}</p>
                    <p>Location: {restaurant.location}</p>
                    <p>Latitude: {restaurant.latitude}</p>
                    <p>Longitude: {restaurant.longitude}</p>
                    <p>Status: {restaurant.open ? 'Open' : 'Closed'}</p>
                    <button onClick={() => handleToggleOpen(restaurant.id, restaurant.open)}>
                      {restaurant.open ? 'Close Restaurant' : 'Open Restaurant'}
                    </button>
                    <button onClick={() => handleEditRestaurant(restaurant)}>Edit</button>
                    <button onClick={() => handleDeleteRestaurant(restaurant.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div>
              <p>No restaurant found.</p>
              <button onClick={() => setEditId(null)}>Add Restaurant</button>
            </div>
          )}
        </div>

        <div className="edit-restaurant">
          <h2>{editId ? 'Edit Restaurant' : 'Add Restaurant'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={restaurantData.name}
              onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
              placeholder="Restaurant Name"
              required
            />
            <input
              type="text"
              name="city"
              value={restaurantData.city}
              onChange={(e) => setRestaurantData({ ...restaurantData, city: e.target.value })}
              placeholder="City"
              required
            />
            <input
              type="text"
              name="area"
              value={restaurantData.area}
              onChange={(e) => setRestaurantData({ ...restaurantData, area: e.target.value })}
              placeholder="Area"
              required
            />
            <input
              type="text"
              name="location"
              value={restaurantData.location}
              onChange={(e) => setRestaurantData({ ...restaurantData, location: e.target.value })}
              placeholder="Location"
              required
            />
            <input
              type="url"
              name="imageUrl"
              value={restaurantData.imageUrl}  // New input for restaurant image URL
              onChange={(e) => setRestaurantData({ ...restaurantData, imageUrl: e.target.value })}
              placeholder="Restaurant Image URL"
            />
            <input
              type="text"
              name="category"
              value={restaurantData.category}  // New input for restaurant category
              onChange={(e) => setRestaurantData({ ...restaurantData, category: e.target.value })}
              placeholder="Category"
            />
            <div style={{ height: '400px', width: '100%' }}>
              <LoadScript googleMapsApiKey="AIzaSyB9h-k-OL3pA1g0IGAJ9tfdX0w0H3g1orA">
                <GoogleMap
                  onClick={onMapClick}
                  mapContainerStyle={{ height: '400px', width: '100%' }}
                  center={{
                    lat: restaurantData.latitude || 0,
                    lng: restaurantData.longitude || 0
                  }}
                  zoom={15}
                  onLoad={() => setIsLoadingMap(false)}
                >
                  {restaurantData.latitude && restaurantData.longitude && (
                    <Marker position={{ lat: restaurantData.latitude, lng: restaurantData.longitude }} />
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
            <button type="submit">{editId ? 'Update' : 'Add'}</button>
            {editId && <button onClick={handleCancel}>Cancel</button>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
