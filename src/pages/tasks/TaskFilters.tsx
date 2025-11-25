// /* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function TaskFilters({
//   projects,
//   teams,
//   selectedProject,
//   setSelectedProject,
//   selectedMember,
//   setSelectedMember,
// }: any) {
//   const allMembers = teams.flatMap((t: any) => t.members);

//   return (
//     <div className="flex gap-4 mb-4">
//       {/* Project filter */}
//       <Select
//         value={selectedProject ? String(selectedProject) : ""}
//         onValueChange={(v) => setSelectedProject(v ? Number(v) : "")}
//       >
//         <SelectTrigger className="w-64">
//           <SelectValue placeholder="Filter by Project" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="">All</SelectItem>
//           {projects.map((p: any) => (
//             <SelectItem key={p.id} value={String(p.id)}>
//               {p.name}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/* Member filter */}
//       <Select
//         value={selectedMember ? String(selectedMember) : ""}
//         onValueChange={(v) => setSelectedMember(v ? Number(v) : "")}
//       >
//         <SelectTrigger className="w-64">
//           <SelectValue placeholder="Filter by Member" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectItem value="">All</SelectItem>
//           {allMembers.map((m: any) => (
//             <SelectItem key={m.id} value={String(m.id)}>
//               {m.name} ({m.currentTasks}/{m.capacity})
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }
