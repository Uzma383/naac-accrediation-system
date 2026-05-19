// ============================================================
// Criterion5_2_2.jsx — 5.2.2: Students Progressing to Higher Education
// ============================================================
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getRecords, addRecord, deleteRecord, getAcademicYears, getProgrammes } from "../../api/apiService";

const emptyForm = () => ({
  student_name: "", program_graduated: "",
  inst_joined: "", prog_joined: "", document: null
});

export default function Criterion5_2_2() {
  const [form, setForm]           = useState(emptyForm());
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [alert, setAlert]         = useState(null);
  const [yearOptions, setYearOptions]   = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

  useEffect(() => {
    Promise.all([getRecords("5_2_2"), getAcademicYears(), getProgrammes()])
      .then(([recs, years, progs]) => {
        setRecords(recs); setYearOptions(years); setProgramOptions(progs);
      })
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleSave = async () => {
    if (!form.student_name || !form.program_graduated || !form.inst_joined || !form.prog_joined)
      return showAlert("All fields are required.", "danger");
    const result = await addRecord("5_2_2", form);
    if (result.success) {
      setRecords(prev => [...prev, result.data]);
      setForm(emptyForm());
      showAlert("Record saved!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("5_2_2", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="5_2_2" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 5</p>
            <h4>5.2.2: Students Progressing to Higher Education</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold">
            <i className="bi bi-file-earmark-excel me-1"></i> Export Excel
          </button>
        </header>

        <div className="container-fluid p-4 fade-in">
          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible d-flex align-items-center gap-2 shadow-sm`} style={{ borderRadius: 10 }}>
              <i className={`bi ${alert.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
              {alert.msg}
              <button className="btn-close ms-auto" onClick={() => setAlert(null)}></button>
            </div>
          )}

          <div className="alert alert-info border-0 shadow-sm mb-4" style={{ borderRadius: 12, background: "linear-gradient(135deg,#e0f2fe,#f0f9ff)" }}>
            <div className="fw-bold mb-1" style={{ fontSize: "0.92rem", color: "#0369a1" }}>
              5.2.2 Number of students progressing to higher education during the year
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Higher Education Record
              </h6>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label-custom" style={{fontSize: "0.75rem", fontWeight:"bold"}}>Name of student enrolling into higher education</label>
                  <input type="text" className="form-control" value={form.student_name}
                    onChange={e => setForm({ ...form, student_name: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <label className="form-label-custom" style={{fontSize: "0.75rem", fontWeight:"bold"}}>Program graduated from</label>
                  <select className="form-select" value={form.program_graduated} onChange={e => setForm({ ...form, program_graduated: e.target.value })}>
                    <option value="">Select Program</option>
                    {programOptions.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label-custom" style={{fontSize: "0.75rem", fontWeight:"bold"}}>Name of institution joined</label>
                  <input type="text" className="form-control" value={form.inst_joined}
                    onChange={e => setForm({ ...form, inst_joined: e.target.value })} />
                </div>
                <div className="col-md-2">
                  <label className="form-label-custom" style={{fontSize: "0.75rem", fontWeight:"bold"}}>Name of programme admitted to</label>
                  <input type="text" className="form-control" value={form.prog_joined}
                    onChange={e => setForm({ ...form, prog_joined: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold">Admission/ID Proof (PDF)</label>
                  <input type="file" className="form-control" accept=".pdf"
                    onChange={e => setForm({ ...form, document: e.target.files[0] })} />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button className="btn btn-danger w-100" onClick={handleSave}>Save Record</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="card-body p-3">
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Name of student enrolling into higher education</th>
                        <th>Program graduated from</th>
                        <th>Name of institution joined</th>
                        <th>Name of programme admitted to</th>
                        <th className="text-center">PDF</th><th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr><td colSpan={6} className="text-center text-muted py-4">No records found.</td></tr>
                      ) : records.map(row => (
                        <tr key={row.id}>
                          <td>{row.student_name}</td>
                          <td>{row.program_graduated}</td><td>{row.inst_joined}</td>
                          <td>{row.prog_joined}</td>
                          <td className="text-center">
                            {row.pdf_path && <a href={row.pdf_path} target="_blank" rel="noreferrer" className="text-danger fs-5"><i className="bi bi-file-earmark-pdf"></i></a>}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row.id)}><i className="bi bi-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
