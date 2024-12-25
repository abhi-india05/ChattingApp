import axios from "axios";
import React, { useState } from "react";

const SignUp= () => {
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
    
      const response = await axios.post("/signup", formData);

      setSuccessMessage(response.data.message || "Registration successful!");
      setErrorMessage(""); 
    } catch (error) {
     
      setErrorMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
      setSuccessMessage("");
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
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
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
}

export default RegistrationForm;
