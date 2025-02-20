import React, { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, FileEdit, Eye } from "lucide-react";
import { useFormStore } from "../../store/formStore";
import { FormField } from "./FormField";
import { Toolbar } from "./Toolbar";
import { FormPreview } from "./FormPreview";

export const FormBuilder: React.FC = () => {
  const {
    currentTemplate,
    templates,
    addTemplate,
    setCurrentTemplate,
    reorderFields,
  } = useFormStore();
  const [showPreview, setShowPreview] = useState(false);

  const handleCreateTemplate = () => {
    addTemplate({
      name: "New Form Template",
      description: "A new form template",
      fields: [],
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentTemplate?.fields.findIndex(
        (field) => field.id === active.id
      );
      const newIndex = currentTemplate?.fields.findIndex(
        (field) => field.id === over.id
      );

      if (oldIndex !== undefined && newIndex !== undefined) {
        reorderFields(oldIndex, newIndex);
      }
    }
  };

  if (!currentTemplate) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Form Builder
            </h2>
            <p className="text-gray-600 mb-8">
              Create a new form template or select an existing one to begin
              building.
            </p>
          </div>

          {templates.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Existing Templates</h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setCurrentTemplate(template.id)}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileEdit className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          {template.name}
                        </div>
                        {template.description && (
                          <div className="text-sm text-gray-500">
                            {template.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleCreateTemplate}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Template</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Toolbar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{currentTemplate.name}</h1>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="w-5 h-5" />
            <span>{showPreview ? "Edit Form" : "Preview Form"}</span>
          </button>
        </div>

        {showPreview ? (
          <FormPreview />
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentTemplate.fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentTemplate.fields.map((field) => (
                  <FormField key={field.id} field={field} />
                ))}
              </SortableContext>
            </DndContext>
            {currentTemplate.fields.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-500">
                  Select form elements from the left toolbar to start building
                  your form.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
