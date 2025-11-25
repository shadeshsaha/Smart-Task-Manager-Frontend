/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { UploadOutlined } from "@ant-design/icons";
// import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
// import axios from "axios";
// import { useCallback, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { fetchProjects } from "../../redux/slices/projectsSlice";
// import {
//   createTask,
//   fetchTasks,
//   updateTask,
// } from "../../redux/slices/tasksSlice";
// import type { RootState } from "../../redux/store";

// interface Props {
//   visible: boolean;
//   onClose: () => void;
//   editingTask?: any;
// }

// const CreateTaskModal: React.FC<Props> = ({
//   visible,
//   onClose,
//   editingTask,
// }) => {
//   const dispatch = useDispatch<any>();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const { projects } = useSelector((state: RootState) => state.projects);

//   const [form] = Form.useForm();
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [teamMembers, setTeamMembers] = useState<any[]>([]);
//   const [warning, setWarning] = useState<string | null>(null);

//   // Memoized function to load members of a project
//   const loadTeamMembers = useCallback(
//     async (projectId: number) => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/projects/${projectId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setTeamMembers(res.data.team.members);
//       } catch (err: any) {
//         message.error("Failed to load team members");
//       }
//     },
//     [token]
//   );

//   //   useEffect(() => {
//   //     if (token) {
//   //         dispatch(fetchProjects(token));
//   //     }

//   //     if (editingTask) {
//   //       form.setFieldsValue(editingTask);

//   //       if (editingTask.projectId){
//   //         loadTeamMembers(editingTask.projectId);
//   //       }
//   //     } else {
//   //       form.resetFields();
//   //     }
//   //   }, [editingTask, token]);

//   // Effect to initialize form and load project members
//   useEffect(() => {
//     if (!token) return;

//     dispatch(fetchProjects(token));

//     if (editingTask) {
//       form.setFieldsValue(editingTask);

//       if (editingTask.projectId) {
//         //   const fetchMembers = async () => {
//         //     await loadTeamMembers(editingTask.projectId);
//         //   };
//         //   fetchMembers();
//         (async () => {
//           await loadTeamMembers(editingTask.projectId);
//         })();
//       }
//     } else {
//       Promise.resolve().then(() => {
//         form.resetFields();
//         setTeamMembers([]);
//         setWarning(null);
//         setSelectedFile(null);
//       });
//     }
//   }, [editingTask, token, dispatch, form, loadTeamMembers]);

//   const handleProjectChange = (projectId: number) => {
//     form.setFieldsValue({ assignedToId: undefined });
//     setWarning(null);
//     loadTeamMembers(projectId);
//   };

//   const handleMemberChange = (memberId: number) => {
//     const member = teamMembers.find((m) => m.id === memberId);
//     if (member && member.tasks.length >= member.capacity) {
//       setWarning(
//         `${member.name} has ${member.tasks.length} tasks but capacity is ${member.capacity}. Assign anyway?`
//       );
//     } else {
//       setWarning(null);
//     }
//   };

//   const handleSubmit = async () => {
//     const values = await form.validateFields();
//     const formData = new FormData();
//     Object.keys(values).forEach((key) => {
//       if (values[key] !== undefined && values[key] !== null)
//         formData.append(key, values[key]);
//     });
//     if (selectedFile) formData.append("attachment", selectedFile);

//     try {
//       if (editingTask) {
//         await dispatch(
//           updateTask({ id: editingTask.id, data: formData, token })
//         );
//         toast.success("Task updated");
//       } else {
//         await dispatch(createTask({ data: formData, token }));
//         toast.success("Task created");
//       }

//       dispatch(fetchTasks({ token }));
//       onClose();
//     } catch (err: any) {
//       toast.error(err.message);
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       title={editingTask ? "Edit Task" : "Create Task"}
//       onCancel={onClose}
//       onOk={handleSubmit}
//     >
//       <Form form={form} layout="vertical">
//         <Form.Item
//           name="title"
//           label="Title"
//           rules={[{ required: true, message: "Enter title" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item name="description" label="Description">
//           <Input.TextArea />
//         </Form.Item>

//         <Form.Item
//           name="priority"
//           label="Priority"
//           rules={[{ required: true }]}
//         >
//           <Select>
//             <Select.Option value="Low">Low</Select.Option>
//             <Select.Option value="Medium">Medium</Select.Option>
//             <Select.Option value="High">High</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item name="status" label="Status" rules={[{ required: true }]}>
//           <Select>
//             <Select.Option value="Pending">Pending</Select.Option>
//             <Select.Option value="In Progress">In Progress</Select.Option>
//             <Select.Option value="Done">Done</Select.Option>
//           </Select>
//         </Form.Item>

//         <Form.Item
//           name="projectId"
//           label="Project"
//           rules={[{ required: true }]}
//         >
//           <Select onChange={handleProjectChange}>
//             {projects.map((p: any) => (
//               <Select.Option key={p.id} value={p.id}>
//                 {p.name}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//         {teamMembers.length > 0 && (
//           <Form.Item name="assignedToId" label="Assign To">
//             <Select
//               placeholder="Select Member"
//               onChange={handleMemberChange}
//               allowClear
//             >
//               {teamMembers.map((member) => (
//                 <Select.Option key={member.id} value={member.id}>
//                   {member.name} ({member.tasks.length}/{member.capacity})
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//         )}

//         {warning && <p style={{ color: "red" }}>{warning}</p>}

//         <Form.Item label="Attachment">
//           <Upload
//             beforeUpload={(file) => {
//               setSelectedFile(file);
//               return false;
//             }}
//             maxCount={1}
//           >
//             <Button icon={<UploadOutlined />}>Select File</Button>
//           </Upload>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default CreateTaskModal;

import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProjectDetails } from "../../api/tasks";
import { createTask, updateTask } from "../../redux/slices/tasksSlice";

interface Props {
  visible: boolean;
  onClose: () => void;
  editingTask?: any | null;
}

const CreateTaskModal: React.FC<Props> = ({
  visible,
  onClose,
  editingTask,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<any>();
  const [members, setMembers] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        projectId: editingTask.projectId,
        assignedToId: editingTask.assignedToId ?? undefined,
      });
      if (editingTask.projectId) loadMembers(editingTask.projectId);
    } else {
      form.resetFields();
      setMembers([]);
      setSelectedFile(null);
      setWarning(null);
    }
  }, [editingTask, visible]);

  const loadMembers = async (projectId: number) => {
    setLoadingMembers(true);
    try {
      const data = await getProjectDetails(projectId);
      // backend returned project with team: include.members (each member likely has tasks)
      const membersArr = data.team?.members || [];
      setMembers(membersArr);
    } catch (err: any) {
      message.error("Failed to load members");
    } finally {
      setLoadingMembers(false);
    }
  };

  const onProjectChange = (projectId: number) => {
    form.setFieldsValue({ assignedToId: undefined });
    setWarning(null);
    loadMembers(projectId);
  };

  const onMemberChange = (memberId: number | undefined) => {
    if (!memberId) {
      setWarning(null);
      return;
    }
    const mem = members.find((m) => m.id === memberId);
    if (mem) {
      if (mem.tasks && mem.tasks.length >= mem.capacity) {
        setWarning(
          `${mem.name} has ${mem.tasks.length} tasks but capacity is ${mem.capacity}. Assign anyway?`
        );
      } else {
        setWarning(null);
      }
    }
  };

  const beforeUpload = (file: File) => {
    setSelectedFile(file);
    return false; // prevent auto upload
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("title", values.title);
      if (values.description)
        formData.append("description", values.description);
      formData.append("priority", values.priority);
      formData.append("status", values.status);
      formData.append("projectId", String(values.projectId));
      if (values.assignedToId)
        formData.append("assignedToId", String(values.assignedToId));
      if (selectedFile) formData.append("attachment", selectedFile);

      if (editingTask) {
        // If backend supports multipart PUT, you can use API.put with formData
        // Here we'll call editTask (which uses PUT JSON) — if editing file required, adjust backend
        await dispatch(
          updateTask({
            id: editingTask.id,
            data: Object.fromEntries(formData as any),
          })
        );
      } else {
        await dispatch(createTask(formData));
      }

      message.success(editingTask ? "Task updated" : "Task created");
      onClose();
    } catch (err: any) {
      message.error(err?.message || "Failed to save task");
    }
  };

  return (
    <Modal
      visible={visible}
      title={editingTask ? "Edit Task" : "Create Task"}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ priority: "Low", status: "Pending" }}
      >
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="Low">Low</Select.Option>
            <Select.Option value="Medium">Medium</Select.Option>
            <Select.Option value="High">High</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Pending">Pending</Select.Option>
            <Select.Option value="In Progress">In Progress</Select.Option>
            <Select.Option value="Done">Done</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="projectId"
          label="Project"
          rules={[{ required: true }]}
        >
          <Select onChange={onProjectChange} loading={loadingMembers}>
            {/* fetch projects from API or Redux projects slice */}
            {/* If you have projects in Redux, you can map them; otherwise call API here */}
            {/** Example: projects from localStorage or global state **/}
            {/* We'll get projects from /api/projects via API call: */}
            <Select.Option value={1}>Project 1</Select.Option>
          </Select>
        </Form.Item>

        {members.length > 0 && (
          <Form.Item name="assignedToId" label="Assign to">
            <Select onChange={(v) => onMemberChange(v)}>
              <Select.Option value={undefined}>Unassigned</Select.Option>
              {members.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name} ({m.tasks?.length ?? 0}/{m.capacity})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {warning && (
          <div style={{ color: "red", marginBottom: 8 }}>{warning}</div>
        )}

        <Form.Item label="Attachment">
          <Upload beforeUpload={beforeUpload} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;
