import React from 'react';
import { useFormStore } from '../../store/formStore';
import type { FormField } from '../../types/form';

interface FieldPropertiesProps {
  field: FormField;
}

export const FieldProperties: React.FC<FieldPropertiesProps> = ({ field }) => {
  const { updateField, currentTemplate } = useFormStore();

  const handleChange = (key: keyof FormField, value: any) => {
    updateField(field.id, { [key]: value });
  };

  const handleValidationChange = (key: string, value: any) => {
    const validation = { ...field.validation, [key]: value };
    updateField(field.id, { validation });
  };

  const handleButtonStyleChange = (key: string, value: any) => {
    const buttonStyle = { ...(field.buttonStyle || {}), [key]: value };
    updateField(field.id, { buttonStyle });
  };

  const handleConditionChange = (index: number, key: string, value: any) => {
    const conditions = [...(field.conditions || [])];
    conditions[index] = { ...conditions[index], [key]: value };
    updateField(field.id, { conditions });
  };

  const addCondition = () => {
    const conditions = [
      ...(field.conditions || []),
      { field: '', operator: 'equals', value: '' },
    ];
    updateField(field.id, { conditions });
  };

  const removeCondition = (index: number) => {
    const conditions = [...(field.conditions || [])].filter((_, i) => i !== index);
    updateField(field.id, { conditions });
  };

  const getAvailableFields = (fields: FormField[], currentFieldId: string): FormField[] => {
    return fields.reduce((acc: FormField[], field) => {
      if (field.id !== currentFieldId) {
        acc.push(field);
        if (field.children) {
          acc.push(...getAvailableFields(field.children, currentFieldId));
        }
      }
      return acc;
    }, []);
  };

  const availableFields = currentTemplate 
    ? getAvailableFields(currentTemplate.fields, field.id)
    : [];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => handleChange('label', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {field.type !== 'button' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={field.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Placeholder
            </label>
            <input
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => handleChange('required', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-900">Required</label>
          </div>
        </>
      )}

      {field.type === 'button' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Button Type</label>
            <select
              value={field.buttonType || 'submit'}
              onChange={(e) => handleChange('buttonType', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="submit">Submit</option>
              <option value="reset">Reset</option>
              <option value="button">Button</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Background Color</label>
            <input
              type="color"
              value={field.buttonStyle?.backgroundColor || '#2563eb'}
              onChange={(e) => handleButtonStyleChange('backgroundColor', e.target.value)}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Text Color</label>
            <input
              type="color"
              value={field.buttonStyle?.textColor || '#ffffff'}
              onChange={(e) => handleButtonStyleChange('textColor', e.target.value)}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <select
              value={field.buttonStyle?.size || 'medium'}
              onChange={(e) => handleButtonStyleChange('size', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      )}

      {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Options
          </label>
          <div className="space-y-2">
            {(field.options || []).map((option, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => {
                    const options = [...(field.options || [])];
                    options[index] = {
                      ...options[index],
                      label: e.target.value,
                      value: e.target.value.toLowerCase().replace(/\s+/g, '_'),
                    };
                    handleChange('options', options);
                  }}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Option label"
                />
                <button
                  onClick={() => {
                    const options = [...(field.options || [])].filter(
                      (_, i) => i !== index
                    );
                    handleChange('options', options);
                  }}
                  className="px-2 py-1 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const options = [...(field.options || []), { label: '', value: '' }];
                handleChange('options', options);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Option
            </button>
          </div>
        </div>
      )}

      {field.type !== 'button' && (
        <>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Validation</h3>
            <select
              value={field.validation?.type || ''}
              onChange={(e) =>
                handleValidationChange('type', e.target.value || undefined)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">No validation</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="custom">Custom</option>
            </select>

            {field.validation?.type === 'custom' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={field.validation.pattern || ''}
                  onChange={(e) => handleValidationChange('pattern', e.target.value)}
                  placeholder="Regular expression pattern"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            <input
              type="text"
              value={field.validation?.message || ''}
              onChange={(e) => handleValidationChange('message', e.target.value)}
              placeholder="Validation message"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Conditional Logic
            </h3>
            {(field.conditions || []).map((condition, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={condition.field}
                  onChange={(e) =>
                    handleConditionChange(index, 'field', e.target.value)
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select field</option>
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.name}>
                      {field.label}
                    </option>
                  ))}
                </select>
                <select
                  value={condition.operator}
                  onChange={(e) =>
                    handleConditionChange(index, 'operator', e.target.value)
                  }
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="equals">Equals</option>
                  <option value="notEquals">Not equals</option>
                  <option value="contains">Contains</option>
                  <option value="greaterThan">Greater than</option>
                  <option value="lessThan">Less than</option>
                </select>
                <input
                  type="text"
                  value={condition.value}
                  onChange={(e) =>
                    handleConditionChange(index, 'value', e.target.value)
                  }
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Value"
                />
                <button
                  onClick={() => removeCondition(index)}
                  className="px-2 py-1 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addCondition}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Condition
            </button>
          </div>
        </>
      )}
    </div>
  );
};