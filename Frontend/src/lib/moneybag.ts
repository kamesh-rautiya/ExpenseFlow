export type Category = {
  id: number;
  name: string;
  color: string;
  icon: string;
};

export type Account = {
  id: number;
  name: string;
  currency: string;
  balance: number;
  color: string;
  icon: string;
  incomes: number;
  expenses: number;
  includeInStatistic: boolean;
};

export type MoneyRecord = {
  id: number;
  label: string;
  note: string;
  amount: number;
  date: string; // ISO
  accountId: number;
  categoryId: number;
};

export const categories: Category[] = [
  { id: 1, name: "Food, Groceries", color: "#6bb001", icon: "apple" },
  { id: 2, name: "Restaurant, bar, cafe", color: "#50bf01", icon: "utensils" },
  { id: 3, name: "Communication, PC, digital", color: "#ff5379", icon: "laptop" },
  { id: 4, name: "Clothes & shoes", color: "#9e2c22", icon: "shirt" },
  { id: 5, name: "Housing", color: "#d59687", icon: "home" },
  { id: 6, name: "Transportation", color: "#f077ff", icon: "train" },
  { id: 7, name: "Alcohol", color: "#294acf", icon: "martini" },
  { id: 8, name: "Salary, wage", color: "#FFAB00", icon: "coins" },
  { id: 9, name: "Investments", color: "#4285f4", icon: "chart" },
  { id: 10, name: "Other incomes", color: "#f2c14a", icon: "wallet" },
  { id: 11, name: "Others", color: "#1a1a1a", icon: "shapes" },
];

export const accounts: Account[] = [
  {
    id: 1,
    name: "Savings",
    currency: "EUR",
    balance: 50000,
    color: "#4285f4",
    icon: "piggy",
    incomes: 20,
    expenses: -160,
    includeInStatistic: true,
  },
  {
    id: 2,
    name: "Current",
    currency: "EUR",
    balance: 3250,
    color: "#f2a33c",
    icon: "card",
    incomes: 15,
    expenses: -49,
    includeInStatistic: true,
  },
  {
    id: 3,
    name: "Family budget",
    currency: "EUR",
    balance: 4000,
    color: "#4a9d55",
    icon: "card",
    incomes: 0,
    expenses: 0,
    includeInStatistic: false,
  },
];

export const records: MoneyRecord[] = [
  {
    id: 1,
    label: "Skate shoes",
    note: "Vans oldskool Boardstar",
    amount: -49,
    date: "2023-03-30T20:52:00",
    accountId: 2,
    categoryId: 4,
  },
  {
    id: 2,
    label: "ETFs",
    note: "VUSA.L",
    amount: -160,
    date: "2023-03-28T14:52:00",
    accountId: 1,
    categoryId: 9,
  },
  {
    id: 3,
    label: "Dividends",
    note: "Apple, Meta",
    amount: 20,
    date: "2023-03-26T14:52:00",
    accountId: 1,
    categoryId: 10,
  },
  {
    id: 4,
    label: "Teaching",
    note: "math lesson",
    amount: 15,
    date: "2023-03-11T20:52:00",
    accountId: 2,
    categoryId: 8,
  },
  {
    id: 5,
    label: "Teaching",
    note: "math lesson",
    amount: 15,
    date: "2023-02-15T20:52:00",
    accountId: 2,
    categoryId: 8,
  },
  {
    id: 6,
    label: "Party",
    note: "with friends",
    amount: -22,
    date: "2023-02-11T20:52:00",
    accountId: 2,
    categoryId: 7,
  },
  {
    id: 7,
    label: "Salary",
    note: "January salary",
    amount: 3900,
    date: "2023-02-05T14:52:00",
    accountId: 2,
    categoryId: 8,
  },
  {
    id: 8,
    label: "Spotify",
    note: "family plan",
    amount: -7,
    date: "2023-02-02T20:52:00",
    accountId: 2,
    categoryId: 3,
  },
  {
    id: 9,
    label: "Rent",
    note: "flat Brno",
    amount: -700,
    date: "2023-02-01T20:52:00",
    accountId: 2,
    categoryId: 5,
  },
  {
    id: 10,
    label: "Public transport ticker",
    note: "yearly ticket",
    amount: -750,
    date: "2023-01-19T20:52:00",
    accountId: 2,
    categoryId: 6,
  },
  {
    id: 11,
    label: "Gift",
    note: "birthday present",
    amount: -34,
    date: "2023-01-02T14:52:00",
    accountId: 2,
    categoryId: 11,
  },
];

const fallbackCategory: Category = {
  id: 0,
  name: "Others",
  color: "#1a1a1a",
  icon: "shapes",
};

export const getCategory = (id: number): Category =>
  categories.find((c) => c.id === id) ?? fallbackCategory;

export const getAccount = (id: number): Account =>
  accounts.find((a) => a.id === id) ?? {
    id: 0,
    name: "Unknown",
    currency: "EUR",
    balance: 0,
    color: "#999999",
    icon: "card",
    incomes: 0,
    expenses: 0,
    includeInStatistic: false,
  };

export const formatAmount = (value: number, currency = "EUR") =>
  `${value > 0 ? "+" : ""}${value.toFixed(2)} ${currency}`;

export const formatMoney = (value: number) => value.toFixed(2);

export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
};

export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${formatDate(iso)} ${hh}:${mm}`;
};

export const sortedRecords = [...records].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

/** March 2023 analytics, matching the reference product screens. */
export const analytics = (() => {
  const inRange = records.filter((r) => r.date.startsWith("2023-03"));
  const totalBalance = accounts
    .filter((a) => a.includeInStatistic)
    .reduce((sum, a) => sum + a.balance, 0);
  const totalIncomes = inRange.filter((r) => r.amount > 0).reduce((s, r) => s + r.amount, 0);
  const totalExpenses = inRange.filter((r) => r.amount < 0).reduce((s, r) => s + r.amount, 0);

  const byCategory = new Map<number, number>();
  for (const r of inRange) {
    byCategory.set(r.categoryId, (byCategory.get(r.categoryId) ?? 0) + Math.abs(r.amount));
  }
  const categoryBreakdown = [...byCategory.entries()].map(([id, value]) => ({
    name: getCategory(id).name,
    color: getCategory(id).color,
    value,
  }));

  const balanceSeries = [
    { date: "1. 3.", balance: 53400 },
    { date: "8. 3.", balance: 53400 },
    { date: "11. 3.", balance: 53415 },
    { date: "18. 3.", balance: 53415 },
    { date: "26. 3.", balance: 53435 },
    { date: "28. 3.", balance: 53275 },
    { date: "31. 3.", balance: 53250 },
  ];

  return {
    totalBalance,
    totalIncomes,
    totalExpenses,
    cashFlow: totalIncomes + totalExpenses,
    categoryBreakdown,
    balanceSeries,
  };
})();
