// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import API from "../../api/axios";
// import { fetchTasks } from "../../features/tasks/taskActions";
// import { useAppDispatch } from "../../utils/hooks";

// export default function TaskEditModal({ task, teams, onClose }: any) {
//   const dispatch = useAppDispatch();

//   const [title, setTitle] = useState(task.title);
//   const [description, setDescription] = useState(task.description);
//   const [status, setStatus] = useState(task.status);
//   const [priority, setPriority] = useState(task.priority);
//   const [assignedToId, setAssignedToId] = useState(task.assignedToId || "");

//   const allMembers = teams.flatMap((t: any) => t.members);

//   const save = async () => {
//     try {
//       await API.put(`/tasks/${task.id}`, {
//         title,
//         description,
//         status,
//         priority,
//         assignedToId: assignedToId || null,
//       });

//       toast.success("Task updated");
//       dispatch(fetchTasks());
//       onClose();
//     } catch (err: any) {
//       toast.error(err?.response?.data?.error || "Update failed");
//     }
//   };

//   return (
//     <Dialog open onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit Task</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-3">
//           <input
//             className="border p-2 w-full rounded"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Title"
//           />

//           <textarea
//             className="border p-2 w-full rounded"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Description"
//           />

//           <select
//             className="border p-2 w-full rounded"
//             value={priority}
//             onChange={(e) => setPriority(e.target.value)}
//           >
//             <option>Low</option>
//             <option>Medium</option>
//             <option>High</option>
//           </select>

//           <select
//             className="border p-2 w-full rounded"
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//           >
//             <option>Pending</option>
//             <option>In Progress</option>
//             <option>Done</option>
//           </select>

//           <select
//             className="border p-2 w-full rounded"
//             value={assignedToId}
//             onChange={(e) => setAssignedToId(Number(e.target.value))}
//           >
//             <option value="">Unassigned</option>
//             {allMembers.map((m: any) => (
//               <option key={m.id} value={m.id}>
//                 {m.name} ({m.currentTasks}/{m.capacity})
//               </option>
//             ))}
//           </select>

//           <Button onClick={save}>Save</Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
