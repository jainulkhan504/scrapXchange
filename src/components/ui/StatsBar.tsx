"use client";

import { ReactNode } from "react";

type StatusCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
};

export default function StatusCard({ title, value, icon }: StatusCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition">
      
      <div className="text-[var(--sx-green-700)] text-3xl">
        {icon}
      </div>

      <div>
        <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>

    </div>
  );
}
