const isNode = typeof window === 'undefined';
const storage = isNode ? { getItem: () => null, setItem: () => {}, removeItem: () => {} } : window.localStorage;

const getAppParamValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
  if (isNode) return defaultValue;

  const storageKey = `7golden_${paramName}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl && searchParam) {
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams}` : ''}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }
  if (defaultValue !== undefined) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }
  return storage.getItem(storageKey) || null;
};

const getAppParams = () => {
  if (getAppParamValue('clear_access_token') === 'true') {
    storage.removeItem('access_token');
    storage.removeItem('base44_access_token');
    storage.removeItem('token');
  }
  return {
    appId: 'local',
    token: getAppParamValue('access_token', { removeFromUrl: true }),
    fromUrl: getAppParamValue('from_url', { defaultValue: typeof window !== 'undefined' ? window.location.href : '/' }),
  };
};

export const appParams = {
  ...getAppParams(),
};
