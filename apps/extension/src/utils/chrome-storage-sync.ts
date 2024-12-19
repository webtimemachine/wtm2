export const chromeStorageSync = {
  getItem: (name: string) =>
    new Promise<string | null>((resolve) => {
      chrome.storage.sync.get([name], (result) => {
        resolve(result[name] ? JSON.stringify(result[name]) : null);
      });
    }),

  setItem: (name: string, value: string) =>
    new Promise<void>((resolve) => {
      chrome.storage.sync.set({ [name]: JSON.parse(value) }, () => {
        resolve();
      });
    }),

  removeItem: (name: string) =>
    new Promise<void>((resolve) => {
      chrome.storage.sync.remove(name, () => {
        resolve();
      });
    }),
};
