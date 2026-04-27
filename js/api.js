const API_URL = "https://trasenhong-backend-production.up.railway.app";

const api = {
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/products?${query}`);
    return res.json();
  },

  async getProduct(id) {
    const res = await fetch(`${API_URL}/products/${id}`);
    return res.json();
  },

  async createOrder(orderData) {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    return res.json();
  },

  async trackOrder(code) {
    const res = await fetch(`${API_URL}/orders/track/${code}`);
    return res.json();
  },

  async calcShippingFee(district_id, ward_code) {
    const res = await fetch(`${API_URL}/ghn/fee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to_district_id: district_id,
        to_ward_code: ward_code,
      }),
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return API_URL.replace("/api", "") + path;
  },

  setToken(token) {
    localStorage.setItem("tsh_token", token);
  },
  getToken() {
    return localStorage.getItem("tsh_token");
  },
  removeToken() {
    localStorage.removeItem("tsh_token");
  },
  isLoggedIn() {
    return !!this.getToken();
  },

  async authFetch(url, options = {}) {
    const token = this.getToken();
    const res = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    return res.json();
  },
};
