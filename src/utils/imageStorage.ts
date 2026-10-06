// Robust, high-capacity image persistence using browser IndexedDB with Colorway Support.
// Allows uploading separate sets of high-definition photos for each colorway (e.g. Royal Blue vs Mustard Ochre #e5a13c).

const DB_NAME = 'kalli_sneaker_db';
const DB_VERSION = 1;
const STORE_NAME = 'sneaker_images';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Compress image if needed so it renders quickly while preserving sharp detail
export async function optimizeImageDataUrl(file: File, maxDimension = 2000, quality = 0.92): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) {
        resolve('');
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // If image is already reasonable size (under maxDimension), preserve original data URL
        if (width <= maxDimension && height <= maxDimension && file.size < 3 * 1024 * 1024) {
          resolve(rawDataUrl);
          return;
        }

        // Scale down proportionally if excessively large
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const optimized = canvas.toDataURL(mimeType, quality);
        resolve(optimized);
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// Helper to get key for colorway + slot
function getKey(slotId: string, colorwayId: string = 'blue'): string {
  return `kalli_attached_${colorwayId}_${slotId}_image`;
}

function getLegacyKey(slotId: string): string {
  return `kalli_attached_${slotId}_image`;
}

// Save image to IndexedDB and fallback
export async function saveShoeImage(slotId: string, dataUrl: string, colorwayId: string = 'blue'): Promise<boolean> {
  if (!slotId || !dataUrl) return false;

  const key = getKey(slotId, colorwayId);
  const legacyKey = colorwayId === 'blue' ? getLegacyKey(slotId) : null;

  // 1. Save to IndexedDB (unlimited quota)
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(dataUrl, key);
      if (legacyKey) store.put(dataUrl, legacyKey);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (err) {
    console.warn('Failed saving to IndexedDB:', err);
  }

  // 2. Also attempt localStorage as secondary backup (ignoring quota errors)
  try {
    localStorage.setItem(key, dataUrl);
    if (legacyKey) localStorage.setItem(legacyKey, dataUrl);
  } catch {}

  // 3. Notify application listeners
  window.dispatchEvent(new CustomEvent('kalli_image_updated', { detail: { slotId, colorwayId } }));
  return true;
}

// Get image from IndexedDB or localStorage
export async function getShoeImage(slotId: string, colorwayId: string = 'blue'): Promise<string | null> {
  const key = getKey(slotId, colorwayId);
  const legacyKey = colorwayId === 'blue' ? getLegacyKey(slotId) : null;

  // 1. Try IndexedDB first
  try {
    const db = await openDB();
    const result = await new Promise<string | null>((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else if (legacyKey) {
          const legReq = store.get(legacyKey);
          legReq.onsuccess = () => resolve(legReq.result || null);
          legReq.onerror = () => resolve(null);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });

    if (result) return result;
  } catch {}

  // 2. Fallback to localStorage
  try {
    const local = localStorage.getItem(key) || (legacyKey ? localStorage.getItem(legacyKey) : null);
    if (local) return local;
  } catch {}

  return null;
}

// Get all stored sneaker images for a specific colorway
export async function getAllShoeImages(colorwayId: string = 'blue'): Promise<Record<string, string | null>> {
  const slots = ['side', 'front', 'perspective', 'top', 'rear', 'sole'];
  const result: Record<string, string | null> = {
    side: null,
    front: null,
    perspective: null,
    top: null,
    rear: null,
    sole: null,
  };

  await Promise.all(
    slots.map(async (slot) => {
      result[slot] = await getShoeImage(slot, colorwayId);
    })
  );

  return result;
}

// Remove image from IndexedDB and localStorage
export async function removeShoeImage(slotId: string, colorwayId: string = 'blue'): Promise<void> {
  const key = getKey(slotId, colorwayId);
  const legacyKey = colorwayId === 'blue' ? getLegacyKey(slotId) : null;

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.delete(key);
      if (legacyKey) store.delete(legacyKey);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch {}

  try {
    localStorage.removeItem(key);
    if (legacyKey) localStorage.removeItem(legacyKey);
  } catch {}

  window.dispatchEvent(new CustomEvent('kalli_image_updated', { detail: { slotId, colorwayId } }));
}

// Clear all sneaker images for a colorway
export async function clearAllShoeImages(colorwayId: string = 'blue'): Promise<void> {
  const slots = ['side', 'front', 'perspective', 'top', 'rear', 'sole'];
  await Promise.all(slots.map((s) => removeShoeImage(s, colorwayId)));
}
