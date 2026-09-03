import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import Modal from "../components/Modal";
import TypeToggle from "../components/TypeToggle";
import { FieldLabel, TextInput, SelectInput } from "../components/FormField";
import { useTransactions } from "../hooks/useTransactions";
import { CATEGORIES } from "../data/categories";
import { todayISO } from "../utils/format";

const EMPTY_FORM = {
  description: "",
  date: todayISO(),
  type: "Expense",
  category: "",
  amount: "",
};

export default function AddTransaction() {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    addTransaction({
      description: form.description.trim(),
      date: form.date,
      type: form.type,
      category: form.category,
      amount: Number(form.amount),
    });
    navigate("/");
  }

  function handleDiscard() {
    setIsModalOpen(true);
  }

  return (
    <Layout variant="modal" extraTab="Add Transaction">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => navigate("/")}
        title="Discard this transaction?"
        message="Your entries haven't been saved. Leaving now will discard them."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
      />
      <form onSubmit={handleSubmit} noValidate>
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
          New Transaction
        </h1>

        <div className="mt-6">
          <FieldLabel>Description</FieldLabel>
          <TextInput
            id="description"
            value={form.description}
            onChange={(v) => setField("description", v)}
            placeholder="e.g. Grocery Run"
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
              placeholder="Select a category"
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
              placeholder="₱0.00"
              error={errors.amount}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p
            className="text-sm italic"
            style={{ color: "var(--color-text-muted)" }}
          >
            "Tame thy tempers." – Kier Eagan
          </p>
          <div className="flex gap-3">
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button type="button" variant="secondary" onClick={handleDiscard}>
              Discard
            </Button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
