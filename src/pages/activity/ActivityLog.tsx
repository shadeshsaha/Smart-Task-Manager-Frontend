// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react";
// import API from "../../api/axios";

// export default function ActivityLog() {
//   const [logs, setLogs] = useState<any[]>([]);

//   useEffect(() => {
//     API.get("/reassign/logs").then((res) => setLogs(res.data.logs));
//   }, []);

//   return (
//     <div>
//       <h2>Activity Log</h2>
//       <ul>
//         {logs.map((log, idx) => (
//           <li key={idx}>{log.message}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
