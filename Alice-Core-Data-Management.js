/**
 * Alice Core Data Management (ACDM)
 * A minimalist, sovereign local-first data storage system using IndexedDB.
 * Aesthetic: Gold Standard Minimalist / Gothic-Industrial
 */
const AliceCore = {
  db: null,
  dbName: 'AliceLocalData',
  version: 1,

  // Initialize and create object stores (e.g., for localSq, Shop Oahu, etc.)
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = (e) => reject(`IndexedDB connection failed: ${e.target.errorCode}`);

      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(true);
      };

      // Create the object stores only once, upon first connection or version change
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        
        // --- Store Definitions for localSq, Shop Oahu, Phoenix Valley ---
        
        // Define 'settings' store for user preferences and application configs
        db.createObjectStore('settings', { keyPath: 'id' });
        
        // Define 'geodata' store for geospatial mapping features (localSq)
        db.createObjectStore('geodata', { keyPath: 'featureId' });
        
        // Define 'products' store for a product catalog (Shop Oahu)
        const productsStore = db.createObjectStore('products', { keyPath: 'itemId', autoIncrement: true });
        productsStore.createIndex('name', 'name', { unique: false });
        productsStore.createIndex('category', 'category', { unique: false });
        
        // Define 'assets' store for design resources and VTuber assets (Ejected Media)
        db.createObjectStore('assets', { keyPath: 'assetId' });

        console.log(`Initialized sovereign object stores for ${this.dbName}`);
      };
    });
  },

  // --- CRUD Operations ---

  // Add or update an item in a specific store
  async putItem(storeName, item) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(`Failed to put item in ${storeName}: ${e.target.error}`);
    });
  },

  // Retrieve an item by its key
  async getItem(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(`Failed to get item from ${storeName}: ${e.target.error}`);
    });
  },

  // --- Example Initialization and Usage ---
};

// Initial setup to build the local state
(async () => {
  try {
    await AliceCore.init(); // Initialize the data management unit
    
    // Example: Storing a product for Shop Oahu
    await AliceCore.putItem('products', { name: 'Artisanal Sourdough', category: 'Baking', price: 8.50 });
    
    // Example: Storing user information
    await AliceCore.putItem('settings', { id: 'userProfile', name: 'Kyle Koski', age: 39, location: 'Phoenix, Arizona' });

    console.log('Initial data persisted locally in the sovereign node.');
    
  } catch (error) {
    console.error(`Initialization or operation error: ${error}`);
  }
})();
