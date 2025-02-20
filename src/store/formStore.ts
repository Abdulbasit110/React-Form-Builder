import { create } from 'zustand';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import type { FormField, FormTemplate } from '../types/form';

interface FormState {
  templates: FormTemplate[];
  currentTemplate: FormTemplate | null;
  undoStack: FormTemplate[];
  redoStack: FormTemplate[];
  addTemplate: (template: Omit<FormTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  setCurrentTemplate: (templateId: string) => void;
  addField: (field: Omit<FormField, 'id'>) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (fieldId: string) => void;
  reorderFields: (sourceIndex: number, destinationIndex: number) => void;
  duplicateField: (fieldId: string) => void;
  undo: () => void;
  redo: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  templates: [],
  currentTemplate: {
      name: 'React Form Builder',
      description: 'A new form template',
      fields: [],
    },
  undoStack: [],
  redoStack: [],

  addTemplate: (template) =>
    set(
      produce((state) => {
        const newTemplate: FormTemplate = {
          ...template,
          id: uuidv4(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        state.templates.push(newTemplate);
        state.currentTemplate = newTemplate;
      })
    ),

  setCurrentTemplate: (templateId) =>
    set(
      produce((state) => {
        state.currentTemplate = state.templates.find((t) => t.id === templateId) || null;
      })
    ),

  addField: (field) =>
    set(
      produce((state) => {
        if (!state.currentTemplate) return;

        const newField: FormField = {
          ...field,
          id: uuidv4(),
        };

        state.undoStack.push({ ...state.currentTemplate });
        state.currentTemplate.fields.push(newField);
        state.currentTemplate.updatedAt = new Date();
        state.redoStack = [];
      })
    ),

  updateField: (fieldId, updates) =>
    set(
      produce((state) => {
        if (!state.currentTemplate) return;

        state.undoStack.push({ ...state.currentTemplate });
        const updateFieldRecursive = (fields: FormField[]): boolean => {
          for (let i = 0; i < fields.length; i++) {
            if (fields[i].id === fieldId) {
              fields[i] = { ...fields[i], ...updates };
              return true;
            }
            if (fields[i].children && updateFieldRecursive(fields[i].children)) {
              return true;
            }
          }
          return false;
        };

        updateFieldRecursive(state.currentTemplate.fields);
        state.currentTemplate.updatedAt = new Date();
        state.redoStack = [];
      })
    ),

  deleteField: (fieldId) =>
    set(
      produce((state) => {
        if (!state.currentTemplate) return;

        state.undoStack.push({ ...state.currentTemplate });
        const deleteFieldRecursive = (fields: FormField[]): boolean => {
          const index = fields.findIndex((f) => f.id === fieldId);
          if (index !== -1) {
            fields.splice(index, 1);
            return true;
          }
          for (const field of fields) {
            if (field.children && deleteFieldRecursive(field.children)) {
              return true;
            }
          }
          return false;
        };

        deleteFieldRecursive(state.currentTemplate.fields);
        state.currentTemplate.updatedAt = new Date();
        state.redoStack = [];
      })
    ),

  reorderFields: (sourceIndex, destinationIndex) =>
    set(
      produce((state) => {
        if (!state.currentTemplate) return;

        state.undoStack.push({ ...state.currentTemplate });
        const fields = state.currentTemplate.fields;
        const [removed] = fields.splice(sourceIndex, 1);
        fields.splice(destinationIndex, 0, removed);
        state.currentTemplate.updatedAt = new Date();
        state.redoStack = [];
      })
    ),

  duplicateField: (fieldId) =>
    set(
      produce((state) => {
        if (!state.currentTemplate) return;

        state.undoStack.push({ ...state.currentTemplate });
        const duplicateFieldRecursive = (fields: FormField[]): boolean => {
          const field = fields.find((f) => f.id === fieldId);
          if (field) {
            const duplicate: FormField = {
              ...field,
              id: uuidv4(),
              name: `${field.name}_copy`,
              label: `${field.label} (Copy)`,
              children: field.children
                ? field.children.map((child) => ({
                    ...child,
                    id: uuidv4(),
                    name: `${child.name}_copy`,
                    label: `${child.label} (Copy)`,
                  }))
                : undefined,
            };
            const index = fields.findIndex((f) => f.id === fieldId);
            fields.splice(index + 1, 0, duplicate);
            return true;
          }
          for (const f of fields) {
            if (f.children && duplicateFieldRecursive(f.children)) {
              return true;
            }
          }
          return false;
        };

        duplicateFieldRecursive(state.currentTemplate.fields);
        state.currentTemplate.updatedAt = new Date();
        state.redoStack = [];
      })
    ),

  undo: () =>
    set(
      produce((state) => {
        const previousState = state.undoStack.pop();
        if (previousState && state.currentTemplate) {
          state.redoStack.push({ ...state.currentTemplate });
          state.currentTemplate = previousState;
        }
      })
    ),

  redo: () =>
    set(
      produce((state) => {
        const nextState = state.redoStack.pop();
        if (nextState && state.currentTemplate) {
          state.undoStack.push({ ...state.currentTemplate });
          state.currentTemplate = nextState;
        }
      })
    ),
}));