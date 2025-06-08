const SEARCH_LIMIT = 3;
const STORAGE_KEY = "searches_this_month";
const HISTORY_KEY = "search_history";
const MAX_HISTORY_ITEMS = 5;

export function getMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

export function getSearchCount() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const key = getMonthKey();
  return data[key] || 0;
}

export function incrementSearchCount() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  const key = getMonthKey();
  data[key] = (data[key] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getSearchHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').slice(0, MAX_HISTORY_ITEMS);
}

export function addToSearchHistory(searchTerm) {
  const currentHistory = getSearchHistory();
  const newHistory = [
    searchTerm, 
    ...currentHistory.filter(h => h !== searchTerm)
  ].slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  return newHistory;
}

export function clearSearchHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getSearchLimit() {
  return SEARCH_LIMIT;
}

export function getSearchesRemaining(isSignedIn) {
  if (isSignedIn) return null;
  return SEARCH_LIMIT - getSearchCount();
}