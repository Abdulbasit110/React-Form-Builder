import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash2,
  Copy,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { FormField as FormFieldType } from "../../types/form";
import { useFormStore } from "../../store/formStore";
import { FieldProperties } from "./FieldProperties";

interface FormFieldProps {
  field: FormFieldType;
  level?: number;
}

export const FormField: React.FC<FormFieldProps> = ({ field, level = 0 }) => {
  const { deleteField, duplicateField, updateField } = useFormStore();
  const [showProperties, setShowProperties] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    marginLeft: `${level * 1.5}rem`,
  };

  const renderFieldInput = () => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.placeholder}
          />
        );
      case "textarea":
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.placeholder}
          />
        );
      case "select":
        return (
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case "phone":
        return (
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={field.placeholder}
          />
        );
      case "file":
        return (
          <input
            type="file"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case "country":
        return (
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case "section":
        return (
          <div className="border-l-2 border-gray-200 pl-4 mt-4">
            {field.children?.map((childField) => (
              <FormField
                key={childField.id}
                field={childField}
                level={level + 1}
              />
            ))}
            <button
              onClick={() =>
                updateField(field.id, {
                  children: [
                    ...(field.children || []),
                    {
                      id: crypto.randomUUID(),
                      type: "text",
                      label: "New Field",
                      name: `field_${Date.now()}`,
                      required: false,
                    },
                  ],
                })
              }
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Field
            </button>
          </div>
        );
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:border-blue-500 transition-colors"
    >
      <div className="flex items-start gap-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {field.type === "section" && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setShowProperties(!showProperties)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Field properties"
              >
                <Settings className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => duplicateField(field.id)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Duplicate field"
              >
                <Copy className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => deleteField(field.id)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Delete field"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          {showProperties ? (
            <FieldProperties field={field} />
          ) : (
            isExpanded && renderFieldInput()
          )}
        </div>
      </div>
    </div>
  );
};
