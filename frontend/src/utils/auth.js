export function getAuthToken() {
  try {
    const rawUserInfo = localStorage.getItem("userInfo");
    const userInfo = rawUserInfo ? JSON.parse(rawUserInfo) : null;

    return (
      localStorage.getItem("token") ||
      userInfo?.token ||
      userInfo?.accessToken ||
      ""
    );
  } catch (error) {
    return localStorage.getItem("token") || "";
  }
}

export function getStoredUser() {
  try {
    const rawUserInfo = localStorage.getItem("userInfo");
    return rawUserInfo ? JSON.parse(rawUserInfo) : null;
  } catch (error) {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("userInfo");
}
