import { useState } from "react";
import axios from "../api/axios";
import "../App.css";

export default function CreateSoftware() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    accessLevels: ""
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, accessLevels } = formData;
    if (!name.trim()) {
      alert("Name is required");
      return;
    }
    try {
      await axios.post("/software", {
        name,
        description,
        accessLevels: accessLevels
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
      });
      alert("Software created");
      setFormData({
        name: "",
        description: "",
        accessLevels: ""
      })
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create software");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="create-software-container">
      <h2>Create Software</h2>
      <form className="create-software-form" onSubmit={handleCreate}>
        <input
          type="text"
          className="create-software-input"
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="create-software-input"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          className="create-software-input"
          placeholder="Access Levels (comma-separated)"
          name="accessLevels"
          value={formData.accessLevels}
          onChange={handleChange}
        />
        <button className="create-software-button" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}
