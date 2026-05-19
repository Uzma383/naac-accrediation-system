// ============================================================
// Criterion5_3_1.jsx — 5.3.1: Awards/Medals for Outstanding Performance
// ============================================================
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getRecords, addRecord, deleteRecord, getAcademicYears, getEventLevels, getAwardCategories, getExcelExportUrl } from "../../api/apiService";

const emptyForm = () => ({
  year: "", award_name: "", event_level: "", team_individual: "",
  event_name: "", student_name: "", document: null
});

export default function Criterion5_3_1() {
  const [form, setForm] = useState(emptyForm());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    Promise.all([getRecords("5_3_1"), getAcademicYears(), getEventLevels(), getAwardCategories()])
      .then(([recs, years, levels, cats]) => {
        setRecords(recs); setYearOptions(years);
        setLevelOptions(levels); setCategoryOptions(cats);
      })
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleSave = async () => {
    if (!form.year || !form.award_name || !form.event_name || !form.student_name)
      return showAlert("Year, Award Name, Event and Student Name are required.", "danger");
    const result = await addRecord("5_3_1", form);
    if (result.success) {
      setRecords(prev => [...prev, result.data]);
      setForm(emptyForm());
      showAlert("Record submitted!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("5_3_1", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="5_3_1" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 5</p>
            <h4>5.3.1: Awards/Medals for Outstanding Performance</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl("5_3_1"), "_blank")}>
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

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Award Record
              </h6>
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="fw-bold">Year</label>
                  <select className="form-select" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>
                    <option value="">Select Year</option>
                    {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>                </div>
                <div className="col-md-4">
                  <label className="fw-bold">Name of the award/medal</label>
                  <input type="text" className="form-control" value={form.award_name}
                    onChange={e => setForm({ ...form, award_name: e.target.value })} />
                </div>
                <div className="col-md-3">
                  <label className="fw-bold">University/State/National/International</label>
                  <select className="form-select" value={form.event_level} onChange={e => setForm({ ...form, event_level: e.target.value })}>
                    <option value="">Select Level</option>
                    {levelOptions.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="fw-bold">Team / Individual</label>
                  <select className="form-select" value={form.team_individual} onChange={e => setForm({ ...form, team_individual: e.target.value })}>
                    <option value="">Select Category</option>
                    {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="fw-bold">Sports/Cultural</label>
                  <select className="form-select" value={form.event_name} onChange={e => setForm({ ...form, event_name: e.target.value })}>
                    <option value="">Select Activity</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="fw-bold">Name of the student</label>
                  <input type="text" className="form-control" value={form.student_name}
                    onChange={e => setForm({ ...form, student_name: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="fw-bold">Proof (PDF)</label>
                  <input type="file" className="form-control" accept=".pdf"
                    onChange={e => setForm({ ...form, document: e.target.files[0] })} />
                </div>
                <div className="col-md-12 text-end mt-3">
                  <button className="btn btn-danger px-5" onClick={handleSave}>Submit</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="card-body p-3">
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <div className="table-responsive">
                  <table className="table table-hover bg-white border">
                    <thead className="table-dark">
                      <tr>
                        <th>Year</th><th>Name of the award/medal</th><th>University/State/National/International</th>
                        <th>Team / Individual</th><th>Sports/Cultural</th><th>Name of the student</th>
                        <th>Proof</th><th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr><td colSpan={8} className="text-center text-muted py-4">No records found.</td></tr>
                      ) : records.map(row => (
                        <tr key={row.id}>
                          <td>{row.year}</td><td>{row.award_name}</td>
                          <td>{row.event_level}</td><td>{row.team_individual}</td>
                          <td>{row.event_name}</td><td>{row.student_name}</td>
                          <td className="text-center">
                            {row.pdf_path && <a href={row.pdf_path} target="_blank" rel="noreferrer"><i className="bi bi-file-pdf text-danger"></i></a>}
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
