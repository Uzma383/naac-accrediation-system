// ============================================================
// Criterion5_1_4.jsx — 5.1.4: Competitive Exams & Career Counseling
// ============================================================
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getRecords, addRecord, deleteRecord, deleteRecordsBulk, getAcademicYears } from "../../api/apiService";

const emptyForm = () => ({
  year: "", exam_activity_name: "", exam_students_count: "",
  counseling_activity_name: "", counseling_students_count: "",
  students_placed: "", proof_links: "", document: null
});

export default function Criterion5_1_4() {
  const [rows, setRows]           = useState([emptyForm()]);
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [alert, setAlert]         = useState(null);
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    Promise.all([getRecords("5_1_4"), getAcademicYears()])
      .then(([recs, years]) => { setRecords(recs); setYearOptions(years); })
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
    const valid = rows.filter(r => r.year);
    if (!valid.length) return showAlert("Year is required.", "danger");
    for (const row of valid) {
      const result = await addRecord("5_1_4", {
        year: row.year, exam_activity_name: row.exam_activity_name,
        exam_students_count: row.exam_students_count,
        counseling_activity_name: row.counseling_activity_name,
        counseling_students_count: row.counseling_students_count,
        students_placed: row.students_placed, proof_links: row.proof_links
      });
      if (result.success) setRecords(prev => [...prev, result.data]);
    }
    setRows([emptyForm()]);
    showAlert(`${valid.length} record(s) saved!`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("5_1_4", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };



  return (
    <div className="app-layout">
      <Sidebar activePage="5_1_4" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 5</p>
            <h4>5.1.4: Competitive Exams & Career Counseling</h4>
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
              5.1.4 Number of students benefitted by guidance for competitive examinations and career counseling offered by the Institution during the year
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Records
              </h6>
              {rows.map((row, idx) => (
                <div key={idx} className="p-3 border rounded bg-light mb-3">
                  <div className="row g-2 align-items-end">
                    <div className="col-md-2">
                      <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Year</label>
                      <select className="form-select form-select-sm" value={row.year} onChange={e => updateRow(idx, "year", e.target.value)}>
                        <option value="">Select Year</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="col-md-5">
                      <div className="p-2 border rounded" style={{background: "#f8fafc"}}>
                        <label className="form-label-custom mb-2 text-primary" style={{fontSize: "0.75rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", display: "block"}}>Guidance for competitive examinations</label>
                        <div className="row g-2">
                          <div className="col-8">
                            <input type="text" className="form-control form-control-sm" placeholder="Name of Activity"
                              value={row.exam_activity_name} onChange={e => updateRow(idx, "exam_activity_name", e.target.value)} />
                          </div>
                          <div className="col-4">
                            <input type="number" className="form-control form-control-sm" placeholder="Students"
                              value={row.exam_students_count} onChange={e => updateRow(idx, "exam_students_count", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="p-2 border rounded" style={{background: "#f8fafc"}}>
                        <label className="form-label-custom mb-2 text-primary" style={{fontSize: "0.75rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", display: "block"}}>Guidance for career counselling</label>
                        <div className="row g-2">
                          <div className="col-8">
                            <input type="text" className="form-control form-control-sm" placeholder="Details of counselling"
                              value={row.counseling_activity_name} onChange={e => updateRow(idx, "counseling_activity_name", e.target.value)} />
                          </div>
                          <div className="col-4">
                            <input type="number" className="form-control form-control-sm" placeholder="Students"
                              value={row.counseling_students_count} onChange={e => updateRow(idx, "counseling_students_count", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 mt-2">
                      <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Students placed through campus placement</label>
                      <input type="number" className="form-control form-control-sm" placeholder="No. of Students"
                        value={row.students_placed} onChange={e => updateRow(idx, "students_placed", e.target.value)} />
                    </div>
                    <div className="col-md-3 mt-2">
                      <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Link to the relevant document</label>
                      <input type="url" className="form-control form-control-sm" placeholder="https://..."
                        value={row.proof_links} onChange={e => updateRow(idx, "proof_links", e.target.value)} />
                    </div>
                    <div className="col-md-3 mt-2">
                      <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Evidence (PDF)</label>
                      <input type="file" className="form-control form-control-sm" accept=".pdf"
                        onChange={e => updateRow(idx, "document", e.target.files[0])} />
                    </div>
                    <div className="col-md-1 d-flex align-items-end mt-2">
                      <button className="btn btn-sm btn-outline-danger w-100" onClick={() => removeRow(idx)}>×</button>
                    </div>
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
                  <table className="table table-hover align-middle small">
                    <thead className="table-dark">
                      <tr>
                        <th rowSpan={2} className="align-middle">Year</th>
                        <th colSpan={2} className="text-center border-start border-end" style={{backgroundColor: '#1f2937'}}>Name of the Activity conducted by the HEI to offer guidance for competitive examinations offered by the institution during the last five years</th>
                        <th colSpan={2} className="text-center border-end" style={{backgroundColor: '#1f2937'}}>Name of the Activity conducted by the HEI to offer guidance for career counselling offered by the institution during the last five years</th>
                        <th rowSpan={2} className="align-middle" style={{width: '10%'}}>Number of students placed through campus placement</th>
                        <th rowSpan={2} className="align-middle" style={{width: '15%'}}>Link to the relevant document</th>
                        <th rowSpan={2} className="text-center align-middle">Actions</th>
                      </tr>
                      <tr>
                        <th className="border-start" style={{backgroundColor: '#374151'}}>Name of the Activity</th>
                        <th className="border-end" style={{backgroundColor: '#374151'}}>Number of students attended / participated</th>
                        <th style={{backgroundColor: '#374151'}}>Details of career counselling</th>
                        <th className="border-end" style={{backgroundColor: '#374151'}}>Number of students attended / participated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr><td colSpan={8} className="text-center text-muted py-4">No records found.</td></tr>
                      ) : records.map(row => (
                        <tr key={row.id}>
                          <td>{row.year}</td>
                          <td className="border-start">{row.exam_activity_name}</td>
                          <td className="border-end">{row.exam_students_count}</td>
                          <td>{row.counseling_activity_name}</td>
                          <td className="border-end">{row.counseling_students_count}</td>
                          <td>{row.students_placed}</td>
                          <td className="text-center">
                            {row.pdf_path && <a href={row.pdf_path} target="_blank" rel="noreferrer" className="text-danger me-2"><i className="bi bi-file-earmark-pdf fs-5"></i></a>}
                            {row.proof_links && <a href={row.proof_links} target="_blank" rel="noreferrer" className="text-primary"><i className="bi bi-link-45deg fs-5"></i></a>}
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
