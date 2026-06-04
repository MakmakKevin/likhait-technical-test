/**
 * Form component for adding/editing expenses
 */

import React, {useEffect, useState} from "react";
import { ExpenseFormData, Category, CategoryFormData } from "../types";
import { EXPENSE_CATEGORIES } from "../constants/categories"; //ununsed - IGNORE
import { TextField, SelectBox, Button, Modal } from "../vibes";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { CategoryForm } from "./CategoryForm";
import { getCategory, createCategory } from "../services/api";

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Expense",
}: ExpenseFormProps) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useExpenseForm({
      initialData,
      onSubmit,
    });

  // state for Add Category modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  },[]);

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
    alignItems: "flex-end",
  };

  const selectBoxWrapperStyle: React.CSSProperties = {
    flex: 1,
  };

  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  const fetchCategories = async () => {
    try {
      const data = await  getCategory(); // fetch categories to get updated category list
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
    }
  };

  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      await createCategory(data);
      setIsModalOpen(false);
      fetchCategories(); // refresh categories to get updated category list
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <TextField
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          error={errors.amount}
          fullWidth
          required
        />

        <TextField
          label="Description"
          type="text"
          placeholder="Enter description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          fullWidth
          required
        />

        <div style={buttonGroupStyle}>
          <div style={selectBoxWrapperStyle}>
            <SelectBox
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              error={errors.category}
              fullWidth
              required
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsModalOpen(true)}
          >
            +
          </Button>
        </div>

        <TextField
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          error={errors.date}
          fullWidth
          required
        />

        <div style={buttonGroupStyle}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            fullWidth
          >
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
        
      </form>

    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Add New Category"
    >
      <CategoryForm
        onSubmit={handleAddCategory}
        onCancel={() => setIsModalOpen(false)}
      />
    </Modal>
    </div>
  );
}
