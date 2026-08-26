const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  currency: string;
  accountIds: number[];
}

export interface AccountDto {
  id: number;
  name: string;
  currency: string;
  balance: number;
  color: string;
  icon: string;
  includeInStatistic: boolean;
  recordIds?: number[];
  userId?: number;
  incomes?: number | null;
  expenses?: number | null;
}

export interface CategoryDto {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface AccountDtoReduced {
  id: number;
  name: string;
  currency: string;
  color: string;
  icon: string;
}

export interface RecordDto {
  id: number;
  amount: number;
  label: string;
  note: string;
  date: string; // ISO DateTime string
  account: AccountDtoReduced;
  category: CategoryDto;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface TotalAnalytic {
  incomes: number;
  expenses: number;
  cashFlow: number;
  balance: number;
  currency: string;
}

export interface TimeSeriesEntry {
  y: number; // Balance
  x: string; // Date (ISO string or formatted date)
}

export interface CategoryAnalyticDto {
  category: CategoryDto;
  amount: number;
  numberOfRecords: number;
}

// Authentication Storage Helpers
export const authStorage = {
  getToken: () => (typeof window !== "undefined" ? localStorage.getItem("token") : null),
  setToken: (token: string) => {
    if (typeof window !== "undefined") localStorage.setItem("token", token);
  },
  getUser: (): UserDto | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
  setUser: (user: UserDto) => {
    if (typeof window !== "undefined") localStorage.setItem("user", JSON.stringify(user));
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  isLoggedIn: () => {
    return authStorage.getToken() !== null;
  },
};

// Global headers builder
function getHeaders(extraHeaders?: HeadersInit): HeadersInit {
  const token = authStorage.getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: getHeaders(options.headers),
    });
  } catch {
    throw new Error(
      "Cannot reach the backend. Start it with ./mvnw spring-boot:run in ExpenseFlow.",
    );
  }

  if (response.status === 401) {
    authStorage.logout();
    if (typeof window !== "undefined" && window.location.pathname !== "/sign-in") {
      window.location.href = "/sign-in";
    }
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    let message = "An error occurred";
    try {
      const errBody = await response.json();
      if (typeof errBody.message === "string" && errBody.message) {
        message = errBody.message;
      } else if (errBody.errors && typeof errBody.errors === "object") {
        const parts = Object.values(errBody.errors).filter((v) => typeof v === "string");
        if (parts.length) message = parts.join(" ");
      }
    } catch {
      // ignore JSON parse error
    }
    throw new Error(message);
  }

  // Handle empty bodies (e.g. DELETE returns 200 OK with no content)
  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}

export const api = {
  // Auth endpoints
  authenticate: async (email: string, password: string) => {
    const res = await request<{ token: string; user: UserDto }>("/auth/authenticate", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    currency: string;
  }) => {
    const res = await request<{ token: string; user: UserDto }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  // User endpoints
  getUserById: (id: number) => {
    return request<UserDto>(`/users/${id}`);
  },

  // Accounts endpoints
  getAccountsByUserId: (id: number, withIncomesAndExpenses = true) => {
    return request<AccountDto[]>(
      `/users/${id}/accounts?withIncomesAndExpenses=${withIncomesAndExpenses}`,
    );
  },

  createAccount: (data: {
    name: string;
    currency: string;
    balance: number;
    color?: string;
    icon?: string;
    includeInStatistic?: boolean;
    userId: number;
  }) => {
    return request<AccountDto>("/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateAccount: (id: number, data: Partial<AccountDto>) => {
    return request<AccountDto>(`/accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteAccount: (id: number) => {
    return request<void>(`/accounts/${id}`, {
      method: "DELETE",
    });
  },

  // Categories endpoints
  getCategories: () => {
    return request<CategoryDto[]>("/categories");
  },

  // Records endpoints
  getRecords: (params: {
    userId: number;
    label?: string;
    accountId?: string;
    categoryId?: string;
    amountLt?: number;
    amountGt?: number;
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.append(key, String(val));
      }
    });
    return request<Page<RecordDto>>(`/records?${query.toString()}`);
  },

  createRecord: (data: {
    amount: number;
    label: string;
    note: string;
    date: string; // ISO
    accountId: number;
    categoryId: number;
  }) => {
    return request<RecordDto>("/records", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateRecord: (
    id: number,
    data: Partial<{
      amount: number;
      label: string;
      note: string;
      date: string;
      accountId: number;
      categoryId: number;
    }>,
  ) => {
    return request<RecordDto>(`/records/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteRecord: (id: number) => {
    return request<void>(`/records/${id}`, {
      method: "DELETE",
    });
  },

  // Analytics endpoints
  getTotalAnalytics: (userId: number, dateGe?: string, dateLt?: string) => {
    const query = new URLSearchParams();
    if (dateGe) query.append("dateGe", dateGe);
    if (dateLt) query.append("dateLt", dateLt);
    return request<TotalAnalytic>(`/users/${userId}/totalAnalytic?${query.toString()}`);
  },

  getBalanceEvolution: (userId: number, dateGe?: string, dateLt?: string) => {
    const query = new URLSearchParams();
    if (dateGe) query.append("dateGe", dateGe);
    if (dateLt) query.append("dateLt", dateLt);
    return request<TimeSeriesEntry[]>(`/users/${userId}/balanceEvolution?${query.toString()}`);
  },

  getCategoryAnalytics: (userId: number, dateGe?: string, dateLt?: string) => {
    const query = new URLSearchParams();
    query.append("userId", String(userId));
    if (dateGe) query.append("dateGe", dateGe);
    if (dateLt) query.append("dateLt", dateLt);
    return request<CategoryAnalyticDto[]>(`/categories/analytic?${query.toString()}`);
  },
};
