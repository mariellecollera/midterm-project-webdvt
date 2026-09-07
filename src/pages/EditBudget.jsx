import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import TextLink from "../components/TextLink";
import Modal from "../components/Modal";
import { FieldLabel, TextInput, SelectInput } from "../components/FormField";
import { useTransactions } from "../hooks/useTransactions";
import { useClickOutside } from "../hooks/useClickOutside";
import { useToast } from "../context/ToastContext";

import { ArrowLeft } from "lucide-react";

export default function EditBudget() {
  const { budget, setBudget } = useTransactions();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({ budget: budget ? String(budget) : "" });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef(null);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    const budgetNumber = Number(form.budget);
    if (!form.budget || Number.isNaN(budgetNumber) || budgetNumber <= 0) {
      nextErrors.budget = "Enter a budget greater than 0.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setBudget(Number(form.budget));
    showToast("Budget updated successfully!");
    navigate("/");
  }

  function handleDiscard() {
    setIsModalOpen(true);
  }

  useClickOutside(cardRef, handleDiscard, !isModalOpen);

  return (
    <Layout variant="modal" clickOutsideRef={cardRef}>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => navigate("/")}
        title="Discard this budget change?"
        message="Your entries haven't been saved. Leaving now will discard them."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
      />
      <TextLink onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft size={16} aria-hidden="true" />
        Back
      </TextLink>
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
          Edit Budget
        </h1>

        <div>
          <FieldLabel htmlFor="budget">Budget</FieldLabel>
          <TextInput
            id="budget"
            type="number"
            step="0.01"
            min="0"
            value={form.budget}
            onChange={(v) => setField("budget", v)}
            placeholder="₱0.00"
            error={errors.budget}
          />
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
