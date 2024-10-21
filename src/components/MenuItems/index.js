/* import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import Header from '../Header';
import "./index.css";

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');
  const [itemAvailable, setItemAvailable] = useState(true); // State to hold availability

  useEffect(() => {
    const fetchRestaurantId = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const restaurantsCollection = collection(db, 'restaurants');
        const q = query(restaurantsCollection, where("owner_id", "==", user.uid));
        const restaurantSnapshot = await getDocs(q);

        if (!restaurantSnapshot.empty) {
          const restaurantDoc = restaurantSnapshot.docs[0];
          setRestaurantId(restaurantDoc.id);
          setRestaurantName(restaurantDoc.data().name);
          fetchMenuItems(restaurantDoc.id);
        }
      } catch (error) {
        console.error("Error fetching restaurant ID:", error);
      }
    };

    const fetchMenuItems = async (id) => {
      if (!id) return;

      try {
        const menuItemsCollection = collection(db, 'menu_items');
        const q = query(menuItemsCollection, where("restaurant_id", "==", id));
        const menuSnapshot = await getDocs(q);
        const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(menuList);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchRestaurantId();
  }, []);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setItemName(item.item_name);
    setItemPrice(item.price);
    setItemImageUrl(item.image_url);
    setItemAvailable(item.available); // Set availability for editing
    setEditMode(true);
    setAddMode(false); // Ensure add mode is off when editing
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      try {
        const menuItemDoc = doc(db, 'menu_items', id);
        await deleteDoc(menuItemDoc);
        setMenuItems(menuItems.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!selectedItem.id) return;

    try {
      const menuItemDoc = doc(db, 'menu_items', selectedItem.id);
      await updateDoc(menuItemDoc, {
        item_name: itemName,
        price: itemPrice,
        image_url: itemImageUrl,
        available: itemAvailable // Update availability
      });

      setMenuItems(menuItems.map(item => 
        item.id === selectedItem.id ? { ...item, item_name: itemName, price: itemPrice, image_url: itemImageUrl, available: itemAvailable } : item
      ));

      setEditMode(false);
      resetForm(); // Reset form state
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    if (!restaurantId) return;

    try {
      const docRef = await addDoc(collection(db, 'menu_items'), {
        item_name: itemName,
        price: itemPrice,
        image_url: itemImageUrl,
        restaurant_id: restaurantId,
        available: itemAvailable // Set availability for new item
      });

      setMenuItems([...menuItems, { id: docRef.id, item_name: itemName, price: itemPrice, image_url: itemImageUrl, available: itemAvailable }]);
      resetForm(); // Reset form state
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const resetForm = () => {
    setItemName('');
    setItemPrice('');
    setItemImageUrl('');
    setItemAvailable(true);
    setEditMode(false);
    setAddMode(false); // Reset add mode when form is reset
    setSelectedItem({});
  };

  return (
    <>
      <Header />
      <div className="menu-list">
        <h2>Menu Items for Restaurant Name: {restaurantName}</h2>

        {// Show add form if not in edit mode //}
        {!editMode && (
          <>
            <h3>Add New Menu Item</h3>
            <form onSubmit={handleAddNewItem}>
              <input 
                type="text" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)} 
                placeholder="Item Name" 
                required 
              />
              <input 
                type="text" 
                value={itemPrice} 
                onChange={(e) => setItemPrice(e.target.value)} 
                placeholder="Price" 
                required 
              />
              <input 
                type="text" 
                value={itemImageUrl} 
                onChange={(e) => setItemImageUrl(e.target.value)} 
                placeholder="Image URL" 
                required 
              />
              <label>
                <input 
                  type="checkbox" 
                  checked={itemAvailable} 
                  onChange={(e) => setItemAvailable(e.target.checked)} 
                />
                Available
              </label>
              <button type="submit">Add Item</button>
            </form>
          </>
        )}

        {menuItems.length === 0 ? (
          <p>No menu items found.</p>
        ) : (
          <>
            <ul>
              {menuItems.map((menuItem) => (
                <li key={menuItem.id} className="menu-item">
                  <img src={menuItem.image_url} alt={menuItem.item_name} className="menu-image" />
                  <h3>{menuItem.item_name}</h3>
                  <p>Price: {menuItem.price}</p>
                  <p>Status: {menuItem.available ? "Available" : "Not Available"}</p>
                  <button onClick={() => handleEditClick(menuItem)}>Edit</button>
                  <button onClick={() => handleDeleteClick(menuItem.id)}>Delete</button>
                </li>
              ))}
            </ul>
            {editMode && (
              <form onSubmit={handleUpdateItem}>
                <h3>Edit Menu Item</h3>
                <input 
                  type="text" 
                  value={itemName} 
                  onChange={(e) => setItemName(e.target.value)} 
                  placeholder="Item Name" 
                  required 
                />
                <input 
                  type="text" 
                  value={itemPrice} 
                  onChange={(e) => setItemPrice(e.target.value)} 
                  placeholder="Price" 
                  required 
                />
                <input 
                  type="text" 
                  value={itemImageUrl} 
                  onChange={(e) => setItemImageUrl(e.target.value)} 
                  placeholder="Image URL" 
                  required 
                />
                <label>
                  <input 
                    type="checkbox" 
                    checked={itemAvailable} 
                    onChange={(e) => setItemAvailable(e.target.checked)} 
                  />
                  Available
                </label>
                <button type="submit">Update Item</button>
                <button type="button" onClick={() => resetForm()}>Cancel</button>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MenuItems; */
import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import Header from '../Header';
import "./index.css";

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');
  const [itemAvailable, setItemAvailable] = useState(true); // State to hold availability

  useEffect(() => {
    const fetchRestaurantId = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const restaurantsCollection = collection(db, 'restaurants');
        const q = query(restaurantsCollection, where("owner_id", "==", user.uid));
        const restaurantSnapshot = await getDocs(q);

        if (!restaurantSnapshot.empty) {
          const restaurantDoc = restaurantSnapshot.docs[0];
          setRestaurantId(restaurantDoc.id);
          setRestaurantName(restaurantDoc.data().name);
          fetchMenuItems(restaurantDoc.id);
        }
      } catch (error) {
        console.error("Error fetching restaurant ID:", error);
      }
    };

    const fetchMenuItems = async (id) => {
      if (!id) return;

      try {
        const menuItemsCollection = collection(db, 'menu_items');
        const q = query(menuItemsCollection, where("restaurant_id", "==", id));
        const menuSnapshot = await getDocs(q);
        const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(menuList);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchRestaurantId();
  }, []);

  const handleToggleAvailability = async (menuItem) => {
    try {
      const menuItemDoc = doc(db, 'menu_items', menuItem.id);
      const newAvailability = !menuItem.available; // Toggle the availability

      await updateDoc(menuItemDoc, {
        available: newAvailability
      });

      // Update the state with the new availability status
      setMenuItems(menuItems.map(item =>
        item.id === menuItem.id ? { ...item, available: newAvailability } : item
      ));
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      try {
        const menuItemDoc = doc(db, 'menu_items', id);
        await deleteDoc(menuItemDoc);
        setMenuItems(menuItems.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    }
  };

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    if (!restaurantId) return;

    try {
      const docRef = await addDoc(collection(db, 'menu_items'), {
        item_name: itemName,
        price: itemPrice,
        image_url: itemImageUrl,
        restaurant_id: restaurantId,
        available: itemAvailable
      });

      setMenuItems([...menuItems, { id: docRef.id, item_name: itemName, price: itemPrice, image_url: itemImageUrl, available: itemAvailable }]);
      resetForm(); // Reset form state
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const handleEditClick = (menuItem) => {
    setEditMode(true);
    setSelectedItem(menuItem);
    setItemName(menuItem.item_name);
    setItemPrice(menuItem.price);
    setItemImageUrl(menuItem.image_url);
    setItemAvailable(menuItem.available);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const menuItemDoc = doc(db, 'menu_items', selectedItem.id);
      await updateDoc(menuItemDoc, {
        item_name: itemName,
        price: itemPrice,
        image_url: itemImageUrl,
        available: itemAvailable
      });

      setMenuItems(menuItems.map(item =>
        item.id === selectedItem.id
          ? { ...item, item_name: itemName, price: itemPrice, image_url: itemImageUrl, available: itemAvailable }
          : item
      ));

      resetForm(); // Reset form after updating
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const resetForm = () => {
    setItemName('');
    setItemPrice('');
    setItemImageUrl('');
    setItemAvailable(true);
    setEditMode(false);
    setAddMode(false); // Reset add mode when form is reset
    setSelectedItem(null);
  };

  return (
    <>
      <Header />
      <div className="menu-list">
        <h2>Menu Items for Restaurant Name: {restaurantName}</h2>

        {/* Show add/edit form */}
        <h3>{editMode ? "Edit Menu Item" : "Add New Menu Item"}</h3>
        <form onSubmit={editMode ? handleUpdateItem : handleAddNewItem}>
          <input 
            type="text" 
            value={itemName} 
            onChange={(e) => setItemName(e.target.value)} 
            placeholder="Item Name" 
            required 
          />
          <input 
            type="text" 
            value={itemPrice} 
            onChange={(e) => setItemPrice(e.target.value)} 
            placeholder="Price" 
            required 
          />
          <input 
            type="text" 
            value={itemImageUrl} 
            onChange={(e) => setItemImageUrl(e.target.value)} 
            placeholder="Image URL" 
            required 
          />
          
          <button type="submit">{editMode ? "Update Item" : "Add Item"}</button>
        </form>

        {menuItems.length === 0 ? (
          <p>No menu items found.</p>
        ) : (
          <ul>
            {menuItems.map((menuItem) => (
              <li key={menuItem.id} className="menu-item">
                <img src={menuItem.image_url} alt={menuItem.item_name} className="menu-image" />
                <h3>{menuItem.item_name}</h3>
                <p>Price: {menuItem.price}</p>
                <p>Status: {menuItem.available ? "Available" : "Not Available"}</p>

                {/* Availability toggle button */}
                <button onClick={() => handleToggleAvailability(menuItem)}>
                  {menuItem.available ? "Mark Unavailable" : "Mark Available"}
                </button>

                {/* Edit button */}
                <button onClick={() => handleEditClick(menuItem)}>Edit</button>

                {/* Delete button */}
                <button onClick={() => handleDeleteClick(menuItem.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MenuItems;
