import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/moneybag/AppHeader";
import { Chip } from "@/components/moneybag/Chips";
import { formatDateTime, formatMoney } from "@/lib/moneybag";
import { api, authStorage, RecordDto } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title: "Records — ExpenseFlow" },
      {
        name: "description",
        content: "Browse, filter and manage every income and expense record.",
      },
      { property: "og:title", content: "Records — ExpenseFlow" },
      { property: "og:description", content: "Filter your income and expense records." },
    ],
  }),
  component: Records,
});

const ALL = "all";

function Records() {
  const queryClient = useQueryClient();
  const user = authStorage.getUser();
  const userId = user?.id ?? 0;

  // Filter states
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState(ALL);
  const [account, setAccount] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordDto | null>(null);

  // Form states
  const [recordLabel, setRecordLabel] = useState("");
  const [recordAmount, setRecordAmount] = useState("");
  const [recordType, setRecordType] = useState("expense"); // "income" | "expense"
  const [recordNote, setRecordNote] = useState("");
  const [recordDate, setRecordDate] = useState("");
  const [recordAccountId, setRecordAccountId] = useState("");
  const [recordCategoryId, setRecordCategoryId] = useState("");

  // Queries
  const { data: recordsPage, isLoading: recordsLoading } = useQuery({
    queryKey: ["records", userId, label, category, account, type],
    queryFn: () => {
      // Build filters for backend
      const queryParams: Parameters<typeof api.getRecords>[0] = {
        userId,
        page: 0,
        size: 200,
        sort: "date,desc",
      };
      if (label) queryParams.label = label;
      if (category !== ALL) queryParams.categoryId = category;
      if (account !== ALL) queryParams.accountId = account;
      // Note: we'll filter by amountLt/amountGt on the backend if we choose,
      // but client-side filtering or setting simple amount Lt/Gt also works.
      // Let's set it on backend:
      if (type === "income") queryParams.amountGt = 0;
      if (type === "expense") queryParams.amountLt = 0;

      return api.getRecords(queryParams);
    },
    enabled: !!userId,
  });

  const recordsList = recordsPage?.content ?? [];

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts", userId],
    queryFn: () => api.getAccountsByUserId(userId, false),
    enabled: !!userId,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  // Mutations
  const createRecordMutation = useMutation({
    mutationFn: api.createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", userId] });
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast.success("Record created successfully!");
      setIsAddOpen(false);
      resetForm();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create record.");
    },
  });

  const updateRecordMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof api.updateRecord>[1] }) =>
      api.updateRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", userId] });
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast.success("Record updated successfully!");
      setIsEditOpen(false);
      resetForm();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update record.");
    },
  });

  const deleteRecordMutation = useMutation({
    mutationFn: api.deleteRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", userId] });
      queryClient.invalidateQueries({ queryKey: ["accounts", userId] });
      toast.success("Record deleted successfully!");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete record.");
    },
  });

  const resetForm = () => {
    setRecordLabel("");
    setRecordAmount("");
    setRecordType("expense");
    setRecordNote("");
    setRecordDate(new Date().toISOString().substring(0, 16));
    setRecordAccountId(accounts[0]?.id ? String(accounts[0].id) : "");
    setRecordCategoryId(categories[0]?.id ? String(categories[0].id) : "");
    setSelectedRecord(null);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordLabel || !recordAmount || !recordAccountId || !recordCategoryId) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const amt = parseFloat(recordAmount);
    const finalAmount = recordType === "expense" ? -Math.abs(amt) : Math.abs(amt);

    createRecordMutation.mutate({
      label: recordLabel,
      amount: finalAmount,
      note: recordNote,
      date: new Date(recordDate).toISOString(),
      accountId: parseInt(recordAccountId),
      categoryId: parseInt(recordCategoryId),
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !recordLabel || !recordAmount || !recordAccountId || !recordCategoryId) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const amt = parseFloat(recordAmount);
    const finalAmount = recordType === "expense" ? -Math.abs(amt) : Math.abs(amt);

    updateRecordMutation.mutate({
      id: selectedRecord.id,
      data: {
        label: recordLabel,
        amount: finalAmount,
        note: recordNote,
        date: new Date(recordDate).toISOString(),
        accountId: parseInt(recordAccountId),
        categoryId: parseInt(recordCategoryId),
      },
    });
  };

  const openEdit = (rec: RecordDto) => {
    setSelectedRecord(rec);
    setRecordLabel(rec.label);
    setRecordAmount(String(Math.abs(rec.amount)));
    setRecordType(rec.amount < 0 ? "expense" : "income");
    setRecordNote(rec.note || "");

    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const d = new Date(rec.date);
    const tzOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    setRecordDate(localISOTime);

    setRecordAccountId(String(rec.account.id));
    setRecordCategoryId(String(rec.category.id));
    setIsEditOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      deleteRecordMutation.mutate(id);
    }
  };

  const resetFilters = () => {
    setLabel("");
    setCategory(ALL);
    setAccount(ALL);
    setType(ALL);
  };

  return (
    <AppShell
      title="Records"
      action={
        <button
          onClick={() => {
            resetForm();
            setIsAddOpen(true);
          }}
          className="btn-interactive inline-flex items-center gap-1.5 rounded-md bg-amber px-4 py-2 text-xs font-semibold uppercase tracking-wider text-amber-foreground shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add record
        </button>
      }
    >
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-4 border-b border-border p-4 bg-muted/20">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Search by label"
            className="h-9 w-44 transition-all focus-visible:ring-primary"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-52">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={account} onValueChange={setAccount}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All accounts</SelectItem>
              {accounts.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder="Income / Expense" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Income / Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={resetFilters}
            aria-label="Clear filters"
            title="Clear filters"
            className="ml-auto rounded-full p-2 text-muted-foreground transition-all hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {recordsLoading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading records...</div>
        ) : recordsList.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No records found matching filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                <th className="w-8" />
                <th className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider text-[11px]">Label</th>
                <th className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider text-[11px]">Category</th>
                <th className="px-3 py-2.5 text-left font-semibold uppercase tracking-wider text-[11px]">Account</th>
                <th className="px-3 py-2.5 text-right font-semibold uppercase tracking-wider text-[11px]">
                  <span className="inline-flex items-center gap-1">
                    <ArrowDown className="h-3 w-3" /> Date
                  </span>
                </th>
                <th className="px-3 py-2.5 text-right font-semibold uppercase tracking-wider text-[11px]">Amount</th>
                <th className="px-3 py-2.5 text-right font-semibold uppercase tracking-wider text-[11px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recordsList.map((record) => {
                const cat = record.category;
                const acc = record.account;
                const open = expanded === record.id;
                return (
                  <tr key={record.id} className="row-hover border-b border-border last:border-0 transition-colors">
                    <td className="pl-3">
                      <button
                        aria-label="Toggle note"
                        onClick={() => setExpanded(open ? null : record.id)}
                        className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                      >
                        {open ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-3 font-semibold text-foreground">
                      {record.label}
                      {open && (
                        <p className="mt-1 text-xs font-normal text-muted-foreground">
                          {record.note || "No notes provided."}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Chip label={cat?.name ?? "Others"} color={cat?.color ?? "#1a1a1a"} />
                    </td>
                    <td className="px-3 py-3">
                      <Chip label={acc?.name ?? "Unknown"} color={acc?.color ?? "#999999"} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right text-muted-foreground text-xs">
                      {formatDateTime(record.date)}
                    </td>
                    <td
                      className={`whitespace-nowrap px-3 py-3 text-right font-bold ${record.amount < 0 ? "text-expense" : "text-income"}`}
                    >
                      {formatMoney(record.amount)} {acc?.currency ?? "EUR"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1 text-muted-foreground">
                        <button
                          aria-label="Edit record"
                          onClick={() => openEdit(record)}
                          className="rounded-full p-1.5 transition-all hover:bg-accent hover:text-foreground cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          aria-label="Delete record"
                          onClick={() => handleDelete(record.id)}
                          className="rounded-full p-1.5 transition-all hover:bg-destructive/15 hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Dialog for Adding Record */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="recordType">Transaction Type</Label>
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger id="recordType">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="recordAmount">Amount</Label>
                <Input
                  id="recordAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={recordAmount}
                  onChange={(e) => setRecordAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="recordLabel">Label</Label>
              <Input
                id="recordLabel"
                placeholder="e.g. Weekly Groceries"
                value={recordLabel}
                onChange={(e) => setRecordLabel(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="recordNote">Note (Optional)</Label>
              <Input
                id="recordNote"
                placeholder="e.g. Bought items at supermarket"
                value={recordNote}
                onChange={(e) => setRecordNote(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="recordDate">Transaction Date</Label>
              <Input
                id="recordDate"
                type="datetime-local"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="recordAccount">Account</Label>
                <Select value={recordAccountId} onValueChange={setRecordAccountId}>
                  <SelectTrigger id="recordAccount">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name} ({a.currency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="recordCategory">Category</Label>
                <Select value={recordCategoryId} onValueChange={setRecordCategoryId}>
                  <SelectTrigger id="recordCategory">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                disabled={createRecordMutation.isPending}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-amber text-amber-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {createRecordMutation.isPending ? "Adding..." : "Add Record"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Editing Record */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction Record</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="editRecordType">Transaction Type</Label>
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger id="editRecordType">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="editRecordAmount">Amount</Label>
                <Input
                  id="editRecordAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={recordAmount}
                  onChange={(e) => setRecordAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="editRecordLabel">Label</Label>
              <Input
                id="editRecordLabel"
                value={recordLabel}
                onChange={(e) => setRecordLabel(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="editRecordNote">Note (Optional)</Label>
              <Input
                id="editRecordNote"
                value={recordNote}
                onChange={(e) => setRecordNote(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="editRecordDate">Transaction Date</Label>
              <Input
                id="editRecordDate"
                type="datetime-local"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="editRecordAccount">Account</Label>
                <Select value={recordAccountId} onValueChange={setRecordAccountId}>
                  <SelectTrigger id="editRecordAccount">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={String(a.id)}>
                        {a.name} ({a.currency})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="editRecordCategory">Category</Label>
                <Select value={recordCategoryId} onValueChange={setRecordCategoryId}>
                  <SelectTrigger id="editRecordCategory">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                disabled={updateRecordMutation.isPending}
                className="px-4 py-2 text-xs font-semibold rounded-md bg-amber text-amber-foreground hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {updateRecordMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
