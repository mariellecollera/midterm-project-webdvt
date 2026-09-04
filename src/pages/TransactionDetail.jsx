import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import TypeToggle from "../components/TypeToggle";
import { FieldLabel, TextInput, SelectInput } from "../components/FormField";
import { useTransactions } from "../hooks/useTransactions";
import { useClickOutside } from "../hooks/useClickOutside";
import { CATEGORIES } from "../data/categories";
import { formatCurrency, formatDateForDisplay } from "../utils/format";
import { useToast } from "../context/ToastContext";

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransaction, updateTransaction, deleteTransaction } =
    useTransactions();
  const { showToast } = useToast();
  const transaction = getTransaction(id);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const editFormRef = useRef(null);

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        amount: String(transaction.amount),
      });
    }
  }, [transaction]);

  // While editing, show the discard-edits modal when the user clicks
  // outside the card. Paused while any modal is already open.
  useClickOutside(
    editFormRef,
    () => setIsEditOpen(true),
    isEditing && !isEditOpen && !isDeleteOpen,
  );

  if (!transaction) {
    return (
      <Layout variant="modal" extraTab="View Transaction">
        <p style={{ color: "var(--color-text-primary)" }}>
          This transaction doesn't exist or was already deleted.
        </p>
        <Button className="mt-6" onClick={() => navigate("/")}>
          Back to Dashboard
        </Button>
      </Layout>
    );
  }

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.description.trim())
      nextErrors.description = "Description is required.";
    if (!form.date) nextErrors.date = "Date is required.";
    if (!form.category) nextErrors.category = "Category is required.";
    const amountNumber = Number(form.amount);
    if (!form.amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      nextErrors.amount = "Enter an amount greater than 0.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSave(e) {
    e.preventDefault();
    if (!validate()) return;
    updateTransaction(transaction.id, {
      description: form.description.trim(),
      date: form.date,
      type: form.type,
      category: form.category,
      amount: Number(form.amount),
    });
    setIsEditing(false);
    showToast("Transaction updated successfully!");
  }

  function handleDelete() {
    setIsDeleteOpen(true);
  }

  function confirmDelete() {
    deleteTransaction(transaction.id);
    showToast("Transaction deleted successfully!");
    navigate("/");
  }

  function discardChanges() {
    setIsEditing(false);
    showToast("Changes discarded.");
  }

  const isExpense = transaction.type === "Expense";

  return (
    <Layout variant="modal" extraTab="View Transaction">
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title="Delete this transaction?"
        message="This action can’t be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      {isEditing ? (
        <form ref={editFormRef} onSubmit={handleSave} noValidate>
          <div className="flex items-center justify-between">
            <h1
              className="font-display text-xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span
                className="mr-3 inline-block w-1 align-middle"
                style={{
                  height: "1.1em",
                  backgroundColor: "var(--color-btn-primary-bg)",
                }}
              />
              Edit Transaction
            </h1>
          </div>

          <div className="mt-6">
            <FieldLabel>Description</FieldLabel>
            <TextInput
              id="description"
              value={form.description}
              onChange={(v) => setField("description", v)}
              error={errors.description}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel>Date</FieldLabel>
              <TextInput
                id="date"
                type="date"
                value={form.date}
                onChange={(v) => setField("date", v)}
                error={errors.date}
              />
            </div>
            <div>
              <FieldLabel>Type</FieldLabel>
              <TypeToggle
                value={form.type}
                onChange={(v) => setField("type", v)}
              />
            </div>

            <div>
              <FieldLabel>Category</FieldLabel>
              <SelectInput
                id="category"
                value={form.category}
                onChange={(v) => setField("category", v)}
                options={CATEGORIES}
                error={errors.category}
              />
            </div>
            <div>
              <FieldLabel>Amount</FieldLabel>
              <TextInput
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(v) => setField("amount", v)}
                error={errors.amount}
              />
            </div>
          </div>

          <Modal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onConfirm={discardChanges}
            title="Discard edits?"
            message="Your edits haven't been saved. Leaving now will discard them."
            confirmLabel="Discard"
            cancelLabel="Keep editing"
          />

          <div className="mt-8 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditOpen(true)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1
              className="font-display text-xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span
                className="mr-3 inline-block w-1 align-middle"
                style={{
                  height: "1.1em",
                  backgroundColor: "var(--color-btn-primary-bg)",
                }}
              />
              {transaction.description}
            </h1>
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel>Date</FieldLabel>
              <TextInput
                id="date-view"
                value={formatDateForDisplay(transaction.date)}
                readOnly
              />
            </div>
            <div>
              <FieldLabel>Type</FieldLabel>
              <div
                className="w-fit rounded-lg px-4 py-2 text-sm font-semibold"
                style={{
                  backgroundColor: isExpense
                    ? "var(--color-expense-bg)"
                    : "var(--color-income-bg)",
                  color: isExpense
                    ? "var(--color-expense-text)"
                    : "var(--color-income-text)",
                }}
              >
                {transaction.type}
              </div>
            </div>

            <div>
              <FieldLabel>Category</FieldLabel>
              <div>
                <Badge>{transaction.category}</Badge>
              </div>
            </div>
            <div>
              <FieldLabel>Amount</FieldLabel>
              <TextInput
                id="amount-view"
                value={formatCurrency(transaction.amount)}
                readOnly
              />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <p
              className="text-sm italic"
              style={{ color: "var(--color-text-muted)" }}
            >
              "Tame thy tempers." – Kier Eagan
            </p>
            <Button
              variant="secondary"
              onClick={handleDelete}
              style={{
                borderColor: "var(--color-expense-text)",
                color: "var(--color-expense-text)",
              }}
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </Layout>
  );
}
