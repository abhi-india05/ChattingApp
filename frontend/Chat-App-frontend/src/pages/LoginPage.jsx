import axios from "axios";
import React, { useState } from "react";

const LoginPage = () => {
  // State to hold form inputs
  const [formData, setFormData] = useState({
    username: "",
   password: "",
  });

  // State for feedback
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      // Send POST request
      const response = await axios.post("/api/register", formData);

      // Handle success response
      setSuccessMessage(response.data.message || "Registration successful!");
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      // Handle error response
      setErrorMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
       
        <button type="submit">Register</button>
      </form>

      {/* Display feedback */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default LoginPage;
