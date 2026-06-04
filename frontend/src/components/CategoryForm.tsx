import React from "react";
import { TextField, Button } from "../vibes";
import { CategoryFormData } from "../types";
import { useCategoryForm } from "../hooks/useCategoryForm";

interface CategoryFormProps {
  initialData?:Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel?: () => void;
}

export function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {

  const {formData, handleSubmit, isSubmitting, handleChange, errors} = useCategoryForm({
    initialData,
    onSubmit,
  })

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Category Name"
        type="text"
        placeholder="Enter category name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        required
        error={errors.name}
      />
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Category"}
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
  );
}