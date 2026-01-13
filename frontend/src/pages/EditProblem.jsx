import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProblem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        statement: '',
        difficulty: 'Easy',
        tags: '',
        samples: [{ input: '', output: '' }],
        testCases: [{ input: '', expectedOutput: '' }]
    });

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
                setFormData({
                    ...res.data,
                    tags: res.data.tags.join(', '),
                });
            } catch (err) {
                console.error("Error fetching problem");
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Dynamic Array Handlers
    const addField = (type) => {
        if (type === 'samples') {
            setFormData({ ...formData, samples: [...formData.samples, { input: '', output: '' }] });
        } else {
            setFormData({ ...formData, testCases: [...formData.testCases, { input: '', expectedOutput: '' }] });
        }
    };

    const removeField = (type, index) => {
        const list = [...formData[type]];
        if (list.length > 1) {
            list.splice(index, 1);
            setFormData({ ...formData, [type]: list });
        }
    };

    const handleArrayChange = (type, index, field, value) => {
        const list = [...formData[type]];
        list[index][field] = value;
        setFormData({ ...formData, [type]: list });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formattedData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim())
            };

            await axios.put(`http://localhost:5000/api/problems/${id}`, formattedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Problem Updated!");
            navigate('/dashboard'); // Updated redirection
        } catch (err) {
            alert("Error updating problem");
        }
    };

    if (loading) return <div className="p-20 text-center text-white">Loading...</div>;

    return (
        <div className="p-8 bg-[#0d1117] min-h-screen text-white max-w-4xl mx-auto">
            <h1 className="text-3xl font-black mb-8 tracking-tighter">EDIT PROBLEM</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-[#161b22] p-8 rounded-2xl border border-gray-800">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase">Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#0d1117] border border-gray-800 p-3 rounded-lg text-sm outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase">Difficulty</label>
                        <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-[#0d1117] border border-gray-800 p-3 rounded-lg text-sm outline-none">
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase">Statement</label>
                    <textarea name="statement" rows="4" value={formData.statement} onChange={handleChange} className="w-full bg-[#0d1117] border border-gray-800 p-3 rounded-lg text-sm outline-none focus:border-blue-500" required />
                </div>

                {/* Dynamic Samples */}
                <div className="pt-6 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-blue-400 font-black text-xs uppercase italic">Public Samples</h3>
                        <button type="button" onClick={() => addField('samples')} className="text-[10px] bg-blue-600/20 text-blue-400 px-3 py-1 rounded border border-blue-600/30">+ Add Sample</button>
                    </div>
                    {formData.samples.map((s, i) => (
                        <div key={i} className="flex gap-4 mb-3 items-start">
                            <textarea placeholder="Input" value={s.input} onChange={(e) => handleArrayChange('samples', i, 'input', e.target.value)} className="flex-1 bg-[#0d1117] border border-gray-800 p-2 rounded text-xs h-16" />
                            <textarea placeholder="Output" value={s.output} onChange={(e) => handleArrayChange('samples', i, 'output', e.target.value)} className="flex-1 bg-[#0d1117] border border-gray-800 p-2 rounded text-xs h-16" />
                            <button type="button" onClick={() => removeField('samples', i)} className="text-red-500 text-lg mt-2">&times;</button>
                        </div>
                    ))}
                </div>

                {/* Dynamic Hidden Test Cases */}
                <div className="pt-6 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-red-400 font-black text-xs uppercase italic">Hidden Test Cases</h3>
                        <button type="button" onClick={() => addField('testCases')} className="text-[10px] bg-red-600/20 text-red-400 px-3 py-1 rounded border border-red-600/30">+ Add Test Case</button>
                    </div>
                    {formData.testCases.map((tc, i) => (
                        <div key={i} className="flex gap-4 mb-3 items-start">
                            <textarea placeholder="Hidden Input" value={tc.input} onChange={(e) => handleArrayChange('testCases', i, 'input', e.target.value)} className="flex-1 bg-[#0d1117] border border-gray-800 p-2 rounded text-xs h-16" />
                            <textarea placeholder="Expected Output" value={tc.expectedOutput} onChange={(e) => handleArrayChange('testCases', i, 'expectedOutput', e.target.value)} className="flex-1 bg-[#0d1117] border border-gray-800 p-2 rounded text-xs h-16" />
                            <button type="button" onClick={() => removeField('testCases', i)} className="text-red-500 text-lg mt-2">&times;</button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 pt-8">
                    <button type="submit" className="flex-1 bg-blue-600 p-4 rounded-xl font-black hover:bg-blue-500 transition shadow-lg shadow-blue-900/20">SAVE CHANGES</button>
                    <button type="button" onClick={() => navigate('/dashboard')} className="px-10 bg-gray-800 rounded-xl font-black">CANCEL</button>
                </div>
            </form>
        </div>
    );
};

export default EditProblem;