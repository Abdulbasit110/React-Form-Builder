import React, { useState } from 'react';
import { useFormStore } from '../../store/formStore';
import type { FormField } from '../../types/form';

export const FormPreview: React.FC = () => {
  const { currentTemplate } = useFormStore();
  const [formData, setFormData] = useState<Record<string, any>>({});

  const copyHtml = () => {
    const formHtml = document.getElementById('form-preview')?.outerHTML;
    if (formHtml) {
      navigator.clipboard.writeText(formHtml);
      alert('Form HTML copied to clipboard!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    alert('Form submitted successfully!');
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditions || field.conditions.length === 0) return true;

    return field.conditions.every((condition) => {
      const dependentFieldValue = formData[condition.field];
      if (!dependentFieldValue) return false;

      switch (condition.operator) {
        case 'equals':
          return dependentFieldValue === condition.value;
        case 'notEquals':
          return dependentFieldValue !== condition.value;
        case 'contains':
          return dependentFieldValue.includes(condition.value);
        case 'greaterThan':
          return Number(dependentFieldValue) > Number(condition.value);
        case 'lessThan':
          return Number(dependentFieldValue) < Number(condition.value);
        default:
          return true;
      }
    });
  };

  const getButtonClasses = (field: FormField) => {
    const size = field.buttonStyle?.size || 'medium';
    const sizeClasses = {
      small: 'px-3 py-1 text-sm',
      medium: 'px-4 py-2',
      large: 'px-6 py-3 text-lg',
    }[size];

    return `${sizeClasses} rounded-md transition-colors`;
  };

  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null;

    switch (field.type) {
      case 'button':
        return (
          <button
            type={field.buttonType || 'submit'}
            style={{
              backgroundColor: field.buttonStyle?.backgroundColor || '#2563eb',
              color: field.buttonStyle?.textColor || '#ffffff',
            }}
            className={getButtonClasses(field)}
          >
            {field.label}
          </button>
        );
      case 'text':
        return (
          <input
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        );
      case 'textarea':
        return (
          <textarea
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        );
      case 'select':
        return (
          <select
            name={field.name}
            required={field.required}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name] === option.value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  name={field.name}
                  value={option.value}
                  checked={
                    Array.isArray(formData[field.name]) &&
                    formData[field.name].includes(option.value)
                  }
                  onChange={(e) => {
                    const currentValues = Array.isArray(formData[field.name])
                      ? formData[field.name]
                      : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleFieldChange(field.name, newValues);
                  }}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      case 'date':
        return (
          <input
            type="date"
            name={field.name}
            required={field.required}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            value={formData[field.name] || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        );
      case 'file':
        return (
          <input
            type="file"
            name={field.name}
            required={field.required}
            onChange={(e) => handleFieldChange(field.name, e.target.files?.[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        );
      case 'section':
        return (
          <div className="space-y-4 border-l-2 border-gray-200 pl-4">
            {field.children?.map((childField) => (
              <div key={childField.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {childField.label}
                  {childField.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                {renderField(childField)}
              </div>
            ))}
          </div>
        );
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  if (!currentTemplate) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Form Preview</h2>
        <button
          onClick={copyHtml}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Copy HTML
        </button>
      </div>
      <form id="form-preview" className="space-y-6" onSubmit={handleSubmit}>
        {currentTemplate.fields.map((field) => (
          shouldShowField(field) && (
            <div key={field.id}>
              {field.type !== 'button' && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              )}
              {renderField(field)}
            </div>
          )
        ))}
      </form>
    </div>
  );
};