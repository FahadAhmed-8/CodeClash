import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../services/authService';
import { login, setLoading } from '../store/authSlice';
import LoginForm from '../components/LoginForm';
import { useSelector } from 'react-redux';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth); // get global loading
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); // Local error state

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(''); // Clear previous errors
    dispatch(setLoading(true));
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch(login(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      // Use the error message from backend if available
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return <LoginForm form={form} handleChange={handleChange} handleSubmit={handleSubmit} loading={loading} error={error} />;
}

export default Login;