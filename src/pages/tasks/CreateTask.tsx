// /* eslint-disable @typescript-eslint/no-explicit-any */
// import * as ProjectsAPI from "@/api/projects";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as TasksAPI from "../../api/tasks";

// export default function CreateTask() {
//   const [projects, setProjects] = useState<any[]>([]);
//   const [selectedProject, setSelectedProject] = useState<number | null>(null);
//   const [teamMembers, setTeamMembers] = useState<any[]>([]);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
//   const [status, setStatus] = useState<"Pending" | "In Progress" | "Done">(
//     "Pending"
//   );
//   const [assignedToId, setAssignedToId] = useState<number | "">("");
//   const [file, setFile] = useState<File | null>(null);
//   // const [confirmAssign, setConfirmAssign] = useState<{
//   //   show: boolean;
//   //   message?: string;
//   // }>({ show: false });

//   const navigate = useNavigate();

//   useEffect(() => {
//     (async () => {
//       const res = await ProjectsAPI.fetchProjects();
//       setProjects(res.data);
//     })();
//   }, []);

//   useEffect(() => {
//     if (!selectedProject) {
//       setTeamMembers([]);
//       return;
//     }
//     (async () => {
//       // fetch project detail to get team and members
//       try {
//         const r = await ProjectsAPI.fetchProject(selectedProject);
//         // backend should return project.team { members: [...] } where each member has currentTasks & capacity
//         const members = r.data.team?.members || [];
//         setTeamMembers(members);
//       } catch (err) {
//         console.error(err);
//         setTeamMembers([]);
//       }
//     })();
//   }, [selectedProject]);

//   const submit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // check capacity warning if assignedToId selected
//     if (assignedToId) {
//       const m = teamMembers.find((x: any) => x.id === assignedToId);
//       if (m && m.currentTasks >= m.capacity) {
//         // show confirm UI (simple window.confirm here; replace with shadcn Dialog for nicer UI)
//         const ok = window.confirm(
//           `${m.name} has ${m.currentTasks} tasks but capacity is ${m.capacity}. Assign anyway?`
//         );
//         if (!ok) return;
//       }
//     }

//     try {
//       const fd = new FormData();
//       fd.append("title", title);
//       fd.append("description", description);
//       fd.append("priority", priority);
//       fd.append("status", status);
//       fd.append("projectId", String(selectedProject));
//       if (assignedToId) fd.append("assignedToId", String(assignedToId));
//       if (file) fd.append("attachment", file);

//       await TasksAPI.createTask(fd);
//       toast.success("Task created");
//       navigate("/tasks");
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || "Create failed");
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Create Task</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form
//           onSubmit={submit}
//           style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
//         >
//           <div style={{ gridColumn: "1 / -1" }}>
//             <Input
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </div>

//           <div style={{ gridColumn: "1 / -1" }}>
//             <Textarea
//               placeholder="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>

//           <div>
//             <label>Project</label>
//             <Select
//               value={selectedProject ? String(selectedProject) : ""}
//               onValueChange={(v: any) =>
//                 setSelectedProject(v ? Number(v) : null)
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select project" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">--</SelectItem>
//                 {projects.map((p) => (
//                   <SelectItem key={p.id} value={String(p.id)}>
//                     {p.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <label>Assigned To</label>
//             <Select
//               value={assignedToId ? String(assignedToId) : ""}
//               onValueChange={(v: any) => setAssignedToId(v ? Number(v) : "")}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose member (optional)" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="">Unassigned</SelectItem>
//                 {teamMembers.map((m: any) => (
//                   <SelectItem key={m.id} value={String(m.id)}>
//                     {m.name} ({m.currentTasks}/{m.capacity})
//                     {m.currentTasks >= m.capacity ? " — Over capacity" : ""}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <label>Priority</label>
//             <Select
//               value={priority}
//               onValueChange={(v: any) => setPriority(v as any)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Priority" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Low">Low</SelectItem>
//                 <SelectItem value="Medium">Medium</SelectItem>
//                 <SelectItem value="High">High</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <label>Status</label>
//             <Select
//               value={status}
//               onValueChange={(v: any) => setStatus(v as any)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Pending">Pending</SelectItem>
//                 <SelectItem value="In Progress">In Progress</SelectItem>
//                 <SelectItem value="Done">Done</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div style={{ gridColumn: "1 / -1" }}>
//             <label>Attachment (optional)</label>
//             <input
//               type="file"
//               onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//             />
//           </div>

//           <div
//             style={{
//               gridColumn: "1 / -1",
//               display: "flex",
//               gap: 8,
//               justifyContent: "flex-end",
//             }}
//           >
//             <Button type="submit">Create Task</Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
