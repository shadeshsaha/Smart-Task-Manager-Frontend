/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";

export default function TaskColumns({
  onEdit,
  onDelete,
  onAutoAssign,
  teams,
}: any): ColumnDef<any>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "project.name",
      header: "Project",
      cell: ({ row }) => row.original.project?.name || "-",
    },
    {
      accessorKey: "assignedTo.name",
      header: "Assigned To",
      cell: ({ row }) => {
        const t = row.original;
        const member = teams
          .flatMap((tm: any) => tm.members)
          .find((m) => m.id === t.assignedToId);
        if (!member) return <Badge variant="destructive">Unassigned</Badge>;

        const overload = member.currentTasks > member.capacity;

        return (
          <div className="flex flex-col">
            <span className={`${overload ? "text-red-600 font-semibold" : ""}`}>
              {member.name} ({member.currentTasks}/{member.capacity})
            </span>
            {overload && (
              <span className="text-xs text-red-500">Over capacity!</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const p = row.original.priority;
        return (
          <Badge
            variant={
              p === "High"
                ? "destructive"
                : p === "Medium"
                ? "secondary"
                : "outline"
            }
          >
            {p}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "attachment",
      header: "File",
      cell: ({ row }) =>
        row.original.fileUrl ? (
          <a
            href={row.original.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Download
          </a>
        ) : (
          "-"
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => onAutoAssign(task)}
            >
              Auto-Assign
            </Button>
          </div>
        );
      },
    },
  ];
}
