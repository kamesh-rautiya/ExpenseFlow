import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, PiggyBank, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/moneybag/AppHeader";
import { Chip } from "@/components/moneybag/Chips";
import { formatAmount, formatDate, formatMoney } from "@/lib/moneybag";
import { api, authStorage, AccountDto } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Moneybag" },
      {
        name: "description",
        content: "See all your account balances and the latest records in one place.",
      },
      { property: "og:title", content: "Dashboard — Moneybag" },
      { property: "og:description", content: "Account balances and latest records." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const queryClient = useQueryClient();
  const user = authStorage.getUser();
  const userId = user?.id ?? 0;

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [color, setColor] = useState("#4285f4");
  const [includeInStats, setIncludeInStats] = useState(true);

  // Queries
  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts", userId],
    queryFn: () => api.getAccountsByUserId(userId, true),
    enabled: !!userId,
  });

  const { data: recordsPage, isLoading: recordsLoading } = useQuery({
    queryKey: ["records", userId],
    queryFn: () => api.getRecords({ userId, page: 0, size: 5, sort: "date,desc" }),
    enabled: !!userId,
  });

  const recentRecords = recordsPage?.content ?? [];

  // Mutations
  const createAccountMutation = useMutation({
    mutationFn: api.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast.success("Account created successfully!");
      setIsAddOpen(false);
      resetForm();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create account.");
    },
  });

  const updateAccountMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AccountDto> }) =>
      api.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast.success("Account updated successfully!");
      setIsEditOpen(false);
      resetForm();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update account.");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: api.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      queryClient.invalidateQueries({ queryKey: ["records", userId] });
      toast.success("Account deleted successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete account.");
    },
  });

  const resetForm = () => {
    setName("");
    setBalance("");
    setCurrency("EUR");
    setColor("#4285f4");
    setIncludeInStats(true);
    setSelectedAccount(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !balance) return;
    createAccountMutation.mutate({
      name,
      currency,
      balance: parseFloat(balance),
      color,
      icon: "mdi-cash",
      includeInStatistic: includeInStats,
      userId,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount || !name || !balance) return;
    updateAccountMutation.mutate({
      id: selectedAccount.id,
      data: {
        name,
        balance: parseFloat(balance),
        color,
        includeInStatistic: includeInStats,
      },
    });
  };

  const openEdit = (account: AccountDto) => {
    setSelectedAccount(account);
    setName(account.name);
    setBalance(String(account.balance));
    setCurrency(account.currency);
    setColor(account.color || "#4285f4");
    setIncludeInStats(account.includeInStatistic);
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this account? All associated records will be deleted!",
      )
    ) {
      deleteAccountMutation.mutate(id);
    }
  };

  return (
    <AppShell
      title="Dashboard"
      action={
        <button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-amber px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-amber-foreground shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add account
        </button>
      }
    >
      {accountsLoading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-md">
          No accounts found. Click "Add account" to create one.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="rounded-md border border-border bg-card p-4 shadow-sm"
              style={{ borderLeft: `4px solid ${account.color}` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-foreground">
                  <CreditCard className="h-4 w-4" style={{ color: account.color }} />
                  <span className="text-lg font-semibold">{account.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    aria-label="Edit account"
                    onClick={() => openEdit(account)}
                    className="text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="Delete account"
                    onClick={() => handleDelete(account.id)}
                    className="text-muted-foreground transition-colors hover:text-expense cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {formatMoney(account.balance)}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  {account.currency}
                </span>
              </p>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Monthly Incomes</span>
                  <span className="font-semibold text-income">
                    +{formatMoney(account.incomes ?? 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Monthly Expenses</span>
                  <span className="font-semibold text-expense">
                    {formatMoney(account.expenses ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mb-4 mt-10 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Last records</h2>
      </div>

      {recordsLoading ? (
        <div className="text-center py-8 text-muted-foreground text-sm">Loading records...</div>
      ) : recentRecords.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-md">
          No records found. Click on the Records tab to add a transaction.
        </div>
      ) : (
        <div className="space-y-3">
          {recentRecords.map((record) => {
            const category = record.category;
            const account = record.account;
            return (
              <div
                key={record.id}
                className="flex items-start justify-between rounded-md border border-border bg-card px-4 py-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{record.label}</span>
                    <span className="text-sm text-muted-foreground">{record.note}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Chip label={category.name} color={category.color} />
                    <Chip label={account.name} color={account.color} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{formatDate(record.date)}</p>
                  <p
                    className={`mt-1 text-sm font-semibold ${record.amount < 0 ? "text-expense" : "text-income"}`}
                  >
                    {formatAmount(record.amount, account.currency).replace("+", "")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog for Adding Account */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                placeholder="e.g. Current Wallet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="accountBalance">Initial Balance</Label>
                <Input
                  id="accountBalance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="accountCurrency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="accountCurrency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="CZK">CZK (Kč)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="accountColor">Color Theme</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="accountColor"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-12 p-0.5"
                />
                <span className="text-xs text-muted-foreground">
                  Select a brand color for the card layout
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="includeInStats"
                type="checkbox"
                checked={includeInStats}
                onChange={(e) => setIncludeInStats(e.target.checked)}
                className="h-4 w-4 accent-amber"
              />
              <Label htmlFor="includeInStats" className="cursor-pointer text-xs">
                Include in total statistics and charts
              </Label>
            </div>
            <DialogFooter className="mt-6">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-md border border-border hover:bg-accent text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createAccountMutation.isPending}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-amber text-amber-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {createAccountMutation.isPending ? "Creating..." : "Create Account"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Editing Account */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="editAccountName">Account Name</Label>
              <Input
                id="editAccountName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="editAccountBalance">Current Balance</Label>
              <Input
                id="editAccountBalance"
                type="number"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="editAccountColor">Color Theme</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="editAccountColor"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-12 p-0.5"
                />
                <span className="text-xs text-muted-foreground">Modify brand theme color</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="editIncludeInStats"
                type="checkbox"
                checked={includeInStats}
                onChange={(e) => setIncludeInStats(e.target.checked)}
                className="h-4 w-4 accent-amber"
              />
              <Label htmlFor="editIncludeInStats" className="cursor-pointer text-xs">
                Include in total statistics and charts
              </Label>
            </div>
            <DialogFooter className="mt-6">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-md border border-border hover:bg-accent text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateAccountMutation.isPending}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-amber text-amber-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {updateAccountMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
