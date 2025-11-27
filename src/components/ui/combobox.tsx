"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface ComboboxProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    id?: string;
}

export function Combobox({ 
    options,
    value,
    onChange,
    placeholder = "Select or type a role...",
    id = "combobox"
}: ComboboxProps) {
  const datalistId = `${id}-datalist`;

  return (
    <div className="relative">
      <Input
        type="text"
        list={datalistId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
      <datalist id={datalistId}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
    </div>
  )
}
