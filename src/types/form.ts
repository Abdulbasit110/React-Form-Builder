import { z } from 'zod';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'file'
  | 'checkbox'
  | 'date'
  | 'phone'
  | 'country'
  | 'section'
  | 'button';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: {
    type: 'email' | 'phone' | 'custom';
    pattern?: string;
    message?: string;
  };
  conditions?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
    value: string;
  }[];
  children?: FormField[];
  buttonType?: 'submit' | 'reset' | 'button';
  buttonStyle?: {
    backgroundColor?: string;
    textColor?: string;
    size?: 'small' | 'medium' | 'large';
  };
}

export interface FormTemplate {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export const formFieldSchema = z.object({
  id: z.string(),
  type: z.enum([
    'text',
    'textarea',
    'select',
    'radio',
    'file',
    'checkbox',
    'date',
    'phone',
    'country',
    'section',
    'button',
  ]),
  label: z.string(),
  name: z.string(),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  validation: z
    .object({
      type: z.enum(['email', 'phone', 'custom']),
      pattern: z.string().optional(),
      message: z.string().optional(),
    })
    .optional(),
  conditions: z
    .array(
      z.object({
        field: z.string(),
        operator: z.enum([
          'equals',
          'notEquals',
          'contains',
          'greaterThan',
          'lessThan',
        ]),
        value: z.string(),
      })
    )
    .optional(),
  children: z.lazy(() => z.array(formFieldSchema)).optional(),
  buttonType: z.enum(['submit', 'reset', 'button']).optional(),
  buttonStyle: z
    .object({
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      size: z.enum(['small', 'medium', 'large']).optional(),
    })
    .optional(),
});

export type FormFieldSchema = z.infer<typeof formFieldSchema>;