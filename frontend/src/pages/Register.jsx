import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService'; // Note lowercase 'services'
import RegisterForm from '../components/RegisterForm';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', adminSecret: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert("Passwords do not match");

    try {
      const res = await registerUser({ username: form.username, email: form.email, password: form.password, adminSecret: form.adminSecret });
      alert(res.data.message || "Registered!");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return <RegisterForm form={form} handleChange={handleChange} handleSubmit={handleSubmit} />;
}

export default Register;