// src/components/ui/CategoryTree.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { slugify } from "@/lib/slugify";

type Cat = {
  id: string;
  title: string;
  children?: Cat[];
};

export default function CategoryTree({ nodes }: { nodes: Cat[] }) {
  return (
    <ul className="space-y-1">
      {nodes.map((n) => (
        <TreeNode key={n.id} node={n} />
      ))}
    </ul>
  );
}

function TreeNode({ node }: { node: Cat }) {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const href = `/category/${slugify(node.title)}`;

  return (
    <li className="group">
      <div className="flex items-center justify-between">
        <Link href={href} className="text-sm hover:text-emerald-600">
          {node.title}
        </Link>

        {hasChildren && (
          <button
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            className="ml-3 text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
            title={open ? "Collapse" : "Expand"}
          >
            {open ? "−" : "+"}
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="pl-4 mt-2">
          <CategoryTree nodes={node.children!} />
        </div>
      )}
    </li>
  );
}

