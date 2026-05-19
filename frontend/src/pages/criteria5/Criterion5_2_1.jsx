// ============================================================
// Criterion5_2_1.jsx — 5.2.1: Placement of Outgoing Students
// ============================================================
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
//import { getRecords, addRecord, deleteRecord, deleteRecordsBulk, getAcademicYears, getProgrammes } from "../../api/apiService";
import { getRecords, addRecord, deleteRecord, getAcademicYears, getProgrammes } from "../../api/apiService";

const emptyForm = () => ({ year: "", student_name: "", program: "", employer: "", package: "" });

export default function Criterion5_2_1() {
  const [rows, setRows] = useState([emptyForm()]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);

  useEffect(() => {
    Promise.all([getRecords("5_2_1"), getAcademicYears(), getProgrammes()])
      .then(([recs, years, progs]) => {
        setRecords(recs);
        setYearOptions(years);
        setProgramOptions(progs);
      })
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const updateRow = (idx, field, val) => {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  };

  const addRow = () => setRows(prev => [...prev, emptyForm()]);
  const removeRow = (idx) => setRows(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async () => {
    const valid = rows.filter(r => r.year && r.student_name && r.program && r.employer);
    if (!valid.length) return showAlert("Year, Student Name, Program and Employer are required.", "danger");
    for (const row of valid) {
      const result = await addRecord("5_2_1", {
        year: row.year, student_name: row.student_name,
        program: row.program, employer_name: row.employer, pay_package: row.package
      });
      if (result.success) setRecords(prev => [...prev, result.data]);
    }
    setRows([emptyForm()]);
    showAlert(`${valid.length} record(s) saved!`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("5_2_1", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };



  return (
    <div className="app-layout">
      <Sidebar activePage="5_2_1" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 5</p>
            <h4>5.2.1: Placement of Outgoing Students</h4>
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
              5.2.1 Number of placement of outgoing students during the year
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Placement Records
              </h6>
              {rows.map((row, idx) => (
                <div key={idx} className="row g-2 mb-3 p-3 border rounded bg-light align-items-end">
                  <div className="col-md-2">
                    <label className="form-label-custom">Year</label>
                    <select className="form-select" value={row.year} onChange={e => updateRow(idx, "year", e.target.value)}>
                      <option value="">Select Year</option>
                      {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Name of student placed and contact details</label>
                    <input type="text" className="form-control" value={row.student_name}
                      onChange={e => updateRow(idx, "student_name", e.target.value)} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Program graduated from</label>
                    <select className="form-select" value={row.program} onChange={e => updateRow(idx, "program", e.target.value)}>
                      <option value="">Select Program</option>
                      {programOptions.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Name of the employer with contact details</label>
                    <input type="text" className="form-control" value={row.employer}
                      onChange={e => updateRow(idx, "employer", e.target.value)} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Pay package at appointment</label>
                    <input type="text" className="form-control" placeholder="e.g. 4.5 LPA"
                      value={row.package} onChange={e => updateRow(idx, "package", e.target.value)} />
                  </div>
                  <div className="col-md-1 d-flex align-items-end">
                    <button className="btn btn-outline-danger w-100" onClick={() => removeRow(idx)}>×</button>
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button className="btn btn-sm btn-outline-primary" onClick={addRow}>+ Add More Rows</button>
                <button className="btn btn-danger px-5" onClick={handleSave}>Save All Records</button>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>Year</th>
                        <th>Name of student placed and contact details</th>
                        <th>Program graduated from</th>
                        <th>Name of the employer with contact details</th>
                        <th>Pay package at appointment</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr><td colSpan={6} className="text-center text-muted py-4">No placement records found.</td></tr>
                      ) : records.map(row => (
                        <tr key={row.id}>
                          <td>{row.year}</td><td>{row.student_name}</td>
                          <td>{row.program}</td><td>{row.employer_name}</td>
                          <td>{row.pay_package}</td>
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
