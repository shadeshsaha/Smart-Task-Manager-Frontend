// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import * as TasksAPI from "../../api/tasks";

// export default function TaskDetails() {
//   const { id } = useParams();
//   const [task, setTask] = useState<any | null>(null);
//   const nav = useNavigate();

//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         const r = await TasksAPI.fetchTask(Number(id));
//         setTask(r.data);
//       } catch (err: any) {
//         console.log("err", err);

//         toast.error("Failed to load task");
//       }
//     })();
//   }, [id]);

//   if (!task) return <div>Loading...</div>;

//   const handleDelete = async () => {
//     try {
//       await TasksAPI.deleteTask(task.id);
//       toast.success("Deleted");
//       nav("/tasks");
//     } catch (err: any) {
//       console.log("err", err);
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{task.title}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div>
//           <strong>Project:</strong> {task.project?.name}
//         </div>
//         <div>
//           <strong>Assigned to:</strong>{" "}
//           {task.assignedTo?.user?.name ?? "Unassigned"}
//         </div>
//         <div>
//           <strong>Priority:</strong> {task.priority}
//         </div>
//         <div>
//           <strong>Status:</strong> {task.status}
//         </div>
//         <div style={{ marginTop: 12 }}>
//           <strong>Description</strong>
//           <p>{task.description}</p>
//         </div>

//         {task.attachment && (
//           <div style={{ marginTop: 12 }}>
//             <a
//               href={`/uploads/${task.attachment}`}
//               target="_blank"
//               rel="noreferrer"
//             >
//               Download attachment
//             </a>
//           </div>
//         )}

//         <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
//           <Button onClick={() => nav(`/tasks/${task.id}/edit`)}>Edit</Button>
//           <Button variant="destructive" onClick={handleDelete}>
//             Delete
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
