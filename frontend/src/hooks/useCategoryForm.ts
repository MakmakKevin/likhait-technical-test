import { useState } from "react";
import { CategoryFormData } from "../types";

interface UseCategoryFormProps {
    initialData?: Partial<CategoryFormData>;
    onSubmit: (data: CategoryFormData) => Promise<void>;
}

export function useCategoryForm({ initialData, onSubmit }: UseCategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});

  const handleChange = (field: keyof CategoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatForm()){
        return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ name: "" }); // reset form after successful submission
    } catch (error) {
      console.error("Error submitting category:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const validatForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  }

  return {
    formData,
    handleSubmit,
    isSubmitting,
    handleChange,
    errors,
  };
}