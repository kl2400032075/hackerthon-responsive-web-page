import { useState } from 'react';

function App() {
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [scholarships, setScholarships] = useState([
    { id: 1, name: 'Merit Scholarship', description: 'For high-achieving students', deadline: '2023-12-31', amount: 5000 },
    { id: 2, name: 'Need-Based Aid', description: 'Financial aid for low-income students', deadline: '2023-11-30', amount: 3000 },
  ]);
  const [applications, setApplications] = useState([
    { id: 1, studentName: 'John Doe', scholarshipId: 1, status: 'applied' },
    { id: 2, studentName: 'Jane Smith', scholarshipId: 2, status: 'approved' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newScholarship, setNewScholarship] = useState({ name: '', description: '', deadline: '', amount: '' });
  const [newApplication, setNewApplication] = useState({ studentName: '', scholarshipId: '' });

  // Filter scholarships based on search
  const filteredScholarships = scholarships.filter(sch =>
    sch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new scholarship (Admin)
  const addScholarship = () => {
    if (newScholarship.name && newScholarship.amount) {
      setScholarships([...scholarships, { ...newScholarship, id: Date.now() }]);
      setNewScholarship({ name: '', description: '', deadline: '', amount: '' });
    }
  };

  // Apply for scholarship (Student)
  const applyForScholarship = () => {
    if (newApplication.studentName && newApplication.scholarshipId) {
      setApplications([...applications, { ...newApplication, id: Date.now(), status: 'applied' }]);
      setNewApplication({ studentName: '', scholarshipId: '' });
    }
  };

  // Update application status (Admin)
  const updateStatus = (id, status) => {
    setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
  };

  return (
    <div className="container">
      <header>
        <h1>Scholarship & Financial Aid Tracker</h1>
      </header>
      
      <div className="tabs">
        <button className={`tab ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>Student</button>
        <button className={`tab ${role === 'admin' ? 'active' : ''}`} onClick={() => setRole('admin')}>Admin</button>
      </div>

      {role === 'student' && (
        <div className="section">
          <h2>Student Dashboard</h2>
          
          {/* Search Scholarships */}
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <h3>Available Scholarships</h3>
          <ul>
            {filteredScholarships.map(sch => (
              <li key={sch.id}>
                <strong>{sch.name}</strong>: {sch.description} - Amount: ${sch.amount} - Deadline: {sch.deadline}
              </li>
            ))}
          </ul>
          
          {/* Apply for Aid */}
          <h3>Apply for Financial Aid</h3>
          <form onSubmit={(e) => { e.preventDefault(); applyForScholarship(); }}>
            <input
              type="text"
              placeholder="Your Name"
              value={newApplication.studentName}
              onChange={(e) => setNewApplication({ ...newApplication, studentName: e.target.value })}
              required
            />
            <select
              value={newApplication.scholarshipId}
              onChange={(e) => setNewApplication({ ...newApplication, scholarshipId: parseInt(e.target.value) })}
              required
            >
              <option value="">Select Scholarship</option>
              {scholarships.map(sch => <option key={sch.id} value={sch.id}>{sch.name}</option>)}
            </select>
            <button type="submit">Apply</button>
          </form>
          
          {/* Track Applications */}
          <h3>Your Applications</h3>
          <ul>
            {applications.filter(app => app.studentName === newApplication.studentName).map(app => {
              const sch = scholarships.find(s => s.id === app.scholarshipId);
              return (
                <li key={app.id}>
                  {sch?.name} - Status: <span className={`status ${app.status}`}>{app.status}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {role === 'admin' && (
        <div className="section">
          <h2>Admin Dashboard</h2>
          
          {/* Manage Scholarships */}
          <h3>Manage Scholarships</h3>
          <form onSubmit={(e) => { e.preventDefault(); addScholarship(); }}>
            <input
              type="text"
              placeholder="Scholarship Name"
              value={newScholarship.name}
              onChange={(e) => setNewScholarship({ ...newScholarship, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newScholarship.description}
              onChange={(e) => setNewScholarship({ ...newScholarship, description: e.target.value })}
            />
            <input
              type="date"
              value={newScholarship.deadline}
              onChange={(e) => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
            />
            <input
              type="number"
              placeholder="Amount"
              value={newScholarship.amount}
              onChange={(e) => setNewScholarship({ ...newScholarship, amount: e.target.value })}
              required
            />
            <button type="submit">Add Scholarship</button>
          </form>
          
          <ul>
            {scholarships.map(sch => (
              <li key={sch.id}>
                {sch.name} - ${sch.amount} - Deadline: {sch.deadline}
                <button onClick={() => setScholarships(scholarships.filter(s => s.id !== sch.id))}>Delete</button>
              </li>
            ))}
          </ul>
          
          {/* Track Applications */}
          <h3>Application Statuses</h3>
          <ul>
            {applications.map(app => {
              const sch = scholarships.find(s => s.id === app.scholarshipId);
              return (
                <li key={app.id}>
                  {app.studentName} - {sch?.name} - Status: 
                  <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value)}>
                    <option value="applied">Applied</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;