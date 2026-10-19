/* HanLoIndexedDB — Hệ thống lưu trữ Client-Side chuẩn IndexedDB API thuần.
   Không phụ thuộc thư viện ngoài, hỗ trợ 6 Object Stores, dung lượng không giới hạn,
   kèm cơ chế tự động di chuyển dữ liệu (auto-migration) từ localStorage. */

(function (global) {
  "use strict";

  const DB_NAME = "hanlo_db";
  const DB_VERSION = 1;

  let dbInstance = null;

  function openDB() {
    return new Promise(function (resolve, reject) {
      if (dbInstance) return resolve(dbInstance);
      if (!("indexedDB" in global)) {
        return reject(new Error("Trình duyệt không hỗ trợ IndexedDB"));
      }

      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("cards")) {
          db.createObjectStore("cards", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("reviews")) {
          const revStore = db.createObjectStore("reviews", { keyPath: "id", autoIncrement: true });
          revStore.createIndex("dayKey", "dayKey", { unique: false });
        }
        if (!db.objectStoreNames.contains("exam_results")) {
          db.createObjectStore("exam_results", { keyPath: "id", autoIncrement: true });
        }
        if (!db.objectStoreNames.contains("study_streaks")) {
          db.createObjectStore("study_streaks", { keyPath: "dayKey" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("speaking_records")) {
          db.createObjectStore("speaking_records", { keyPath: "id", autoIncrement: true });
        }
      };

      req.onsuccess = function (e) {
        dbInstance = e.target.result;
        resolve(dbInstance);
      };

      req.onerror = function (e) {
        reject(e.target.error);
      };
    });
  }

  const HanLoDB = {
    isSupported: "indexedDB" in global,

    init: async function () {
      try {
        await openDB();
        await this.migrateFromLocalStorage();
        return true;
      } catch (err) {
        console.warn("IndexedDB không khởi tạo được, dùng fallback localStorage:", err);
        return false;
      }
    },

    get: async function (storeName, key) {
      const db = await openDB();
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error); };
      });
    },

    getAll: async function (storeName) {
      const db = await openDB();
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = function () { resolve(req.result || []); };
        req.onerror = function () { reject(req.error); };
      });
    },

    put: async function (storeName, val) {
      const db = await openDB();
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.put(val);
        req.onsuccess = function () { resolve(req.result); };
        req.onerror = function () { reject(req.error); };
      });
    },

    putBatch: async function (storeName, items) {
      const db = await openDB();
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        items.forEach(function (item) { store.put(item); });
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(tx.error); };
      });
    },

    clear: async function (storeName) {
      const db = await openDB();
      return new Promise(function (resolve, reject) {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = function () { resolve(true); };
        req.onerror = function () { reject(req.error); };
      });
    },

    // Tự động di chuyển từ localStorage khi người dùng nâng cấp
    migrateFromLocalStorage: async function () {
      try {
        const raw = localStorage.getItem("hanlo.v1");
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!data) return;

        // Lưu settings
        if (data.settings) {
          await this.put("settings", { key: "main_settings", ...data.settings });
        }
        // Lưu thẻ từ vựng
        if (data.cards && typeof data.cards === "object") {
          const cardsList = Object.keys(data.cards).map(function (k) {
            return { id: Number(k), ...data.cards[k] };
          });
          if (cardsList.length) {
            await this.putBatch("cards", cardsList);
          }
        }
        // Lưu lịch sử thi
        if (Array.isArray(data.examHistory) && data.examHistory.length) {
          await this.putBatch("exam_results", data.examHistory);
        }
        // Lưu streak
        if (data.streak) {
          await this.put("settings", { key: "streak", ...data.streak });
        }
        console.log("Đã đồng bộ hóa an toàn từ localStorage sang IndexedDB!");
      } catch (e) {
        console.warn("Không thể migrate tự động:", e);
      }
    },

    // Tạo bản snapshot toàn diện để xuất JSON backup
    exportFullBackup: async function () {
      const backup = {
        app: "han-lo",
        version: "1.4.0",
        exportedAt: new Date().toISOString(),
        settings: await this.getAll("settings"),
        cards: await this.getAll("cards"),
        exam_results: await this.getAll("exam_results"),
        speaking_records: await this.getAll("speaking_records")
      };
      return backup;
    }
  };

  global.HanLoDB = HanLoDB;
})(typeof window !== "undefined" ? window : global);
