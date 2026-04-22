import useAppStore from "../app/store";

export default function useAuth() {
  const { user, token, setUser, setToken, logout } = useAppStore();

  return {
    user,
    token,
    isAuthenticated: !!token,
    setUser,
    setToken,
    logout,
  };
}
