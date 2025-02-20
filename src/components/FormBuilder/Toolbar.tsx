import React from "react";
import {
  Type,
  AlignLeft,
  List,
  Radio,
  File,
  CheckSquare,
  Calendar,
  Phone,
  Globe,
  Layers,
  Square,
} from "lucide-react";
import { useFormStore } from "../../store/formStore";
import type { FieldType } from "../../types/form";

interface ToolbarItem {
  type: FieldType;
  icon: React.ReactNode;
  label: string;
}

export const Toolbar: React.FC = () => {
  const { addField } = useFormStore();

  const tools: ToolbarItem[] = [
    { type: "text", icon: <Type className="w-5 h-5" />, label: "Text Input" },
    {
      type: "textarea",
      icon: <AlignLeft className="w-5 h-5" />,
      label: "Text Area",
    },
    { type: "select", icon: <List className="w-5 h-5" />, label: "Dropdown" },
    {
      type: "radio",
      icon: <Radio className="w-5 h-5" />,
      label: "Radio Group",
    },
    { type: "file", icon: <File className="w-5 h-5" />, label: "File Upload" },
    {
      type: "checkbox",
      icon: <CheckSquare className="w-5 h-5" />,
      label: "Checkbox",
    },
    {
      type: "date",
      icon: <Calendar className="w-5 h-5" />,
      label: "Date Picker",
    },
    {
      type: "phone",
      icon: <Phone className="w-5 h-5" />,
      label: "Phone Number",
    },
    // { type: 'country', icon: <Globe className="w-5 h-5" />, label: 'Country' },
    { type: "section", icon: <Layers className="w-5 h-5" />, label: "Section" },
    { type: "button", icon: <Square className="w-5 h-5" />, label: "Button" },
  ];

  const handleAddField = (type: FieldType) => {
    const defaultField = {
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      name: `${type}_${Date.now()}`,
      required: false,
      placeholder: type === "button" ? undefined : `Enter ${type}...`,
    };

    if (type === "button") {
      Object.assign(defaultField, {
        buttonType: "submit",
        buttonStyle: {
          backgroundColor: "#2563eb",
          textColor: "#ffffff",
          size: "medium",
        },
        label: "Submit",
      });
    }

    addField(defaultField);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Form Elements</h2>
      <div className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => handleAddField(tool.type)}
            className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {tool.icon}
            <span>{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
