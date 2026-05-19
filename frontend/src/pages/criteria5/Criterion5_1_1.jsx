// ============================================================
// Criterion5_1_1.jsx — 5.1.1 & 5.1.2: Scholarships and Freeships
// Dropdown data fetched from backend (no hardcoding)
// ============================================================
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getRecords, addRecord, deleteRecord, deleteRecordsBulk, getAcademicYears, uploadEvidence, getExcelExportUrl } from "../../api/apiService";

const emptyForm = () => ({ 
  year: "", 
  scheme_name: "", 
  gov_student_count: "", 
  gov_amount: "", 
  inst_student_count: "", 
  inst_amount: "", 
  document: null 
});

export default function Criterion5_1_1() {
  const [rows, setRows] = useState([emptyForm()]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    Promise.all([getRecords("5_1_1"), getAcademicYears()])
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
    const valid = rows.filter(r => r.year && r.scheme_name);
    if (!valid.length) return showAlert("Please fill in at least one complete row with Year and Scheme Name.", "danger");
    for (const row of valid) {
      const payload = {
        year: row.year,
        scheme_name: row.scheme_name,
        gov_student_count: row.gov_student_count || 0,
        gov_amount: row.gov_amount || 0,
        inst_student_count: row.inst_student_count || 0,
        inst_amount: row.inst_amount || 0
      };
      const result = await addRecord("5_1_1", payload);
      if (result.success) {
        if (row.document) {
          const uploadRes = await uploadEvidence("5_1_1", [row.document], result.data.id);
          if (uploadRes.success && uploadRes.file_urls && uploadRes.file_urls.length > 0) {
            result.data.proof_links = (result.data.proof_links ? result.data.proof_links + "," : "") + uploadRes.file_urls.join(",");
          }
        }
        setRecords(prev => [...prev, result.data]);
      }
    }
    setRows([emptyForm()]);
    showAlert(`${valid.length} record(s) saved successfully!`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("5_1_1", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };

  const handleExport = () => {
    window.open(getExcelExportUrl("5_1_1"), "_blank");
  };

  const renderProofLinks = (links) => {
    if (!links) return null;
    return links.split(',').map((path, idx) => (
      <a key={idx} href={path.startsWith('http') ? path : `http://localhost:5000${path.startsWith('/') ? '' : '/'}${path}`} 
         target="_blank" rel="noreferrer" className="text-danger me-2" title="Download PDF">
        <i className="bi bi-file-earmark-pdf fs-5"></i>
      </a>
    ));
  };



  return (
    <div className="app-layout">
      <Sidebar activePage="5_1_1" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 5</p>
            <h4>5.1.1 & 5.1.2: Scholarships and Freeships</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={handleExport}>
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

          {/* Add Form */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Scholarship Records
              </h6>
              {rows.map((row, idx) => (
                <div key={idx} className="p-3 mb-3 border rounded bg-light">
                  <div className="row g-2 mb-2 align-items-end">
                    <div className="col-md-3">
                      <label className="form-label-custom">Year</label>
                      <select className="form-select" value={row.year} onChange={e => updateRow(idx, "year", e.target.value)}>
                        <option value="">Select Year</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label-custom">Name of the scheme</label>
                      <input type="text" className="form-control" placeholder="e.g. Post Metric Scholarship"
                        value={row.scheme_name} onChange={e => updateRow(idx, "scheme_name", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label-custom">Evidence (PDF)</label>
                      <input type="file" className="form-control form-control-sm" accept=".pdf"
                        onChange={e => updateRow(idx, "document", e.target.files[0])} />
                    </div>
                    <div className="col-md-1 d-flex align-items-end">
                      <button className="btn btn-outline-danger w-100" onClick={() => removeRow(idx)}>×</button>
                    </div>
                  </div>
                  <div className="row g-2 align-items-end">
                    <div className="col-md-3">
                      <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Govt Scheme: No. of Students</label>
                      <input type="number" className="form-control" placeholder="0"
                        value={row.gov_student_count} onChange={e => updateRow(idx, "gov_student_count", e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Govt Scheme: Amount</label>
                      <input type="number" className="form-control" placeholder="0"
                        value={row.gov_amount} onChange={e => updateRow(idx, "gov_amount", e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Inst Scheme: No. of Students</label>
                      <input type="number" className="form-control" placeholder="0"
                        value={row.inst_student_count} onChange={e => updateRow(idx, "inst_student_count", e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom" style={{fontSize: "0.75rem"}}>Inst Scheme: Amount</label>
                      <input type="number" className="form-control" placeholder="0"
                        value={row.inst_amount} onChange={e => updateRow(idx, "inst_amount", e.target.value)} />
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

          {/* Records Table */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">

              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark text-center align-middle">
                      <tr>
                        <th rowSpan="2">Year</th>
                        <th rowSpan="2">Name of the scheme</th>
                        <th colSpan="2">Number of students benefited by government scheme and amount</th>
                        <th colSpan="2">Number of students benefited by the institution's schemes and amount</th>
                        <th rowSpan="2">Link to relevant document</th>
                        <th rowSpan="2">Actions</th>
                      </tr>
                      <tr>
                        <th>Number of students</th>
                        <th>Amount</th>
                        <th>Number of students</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr><td colSpan={6} className="text-center text-muted py-4">No records found for Criteria 5.1.1.</td></tr>
                      ) : records.map(row => (
                        <tr key={row.id}>

                          <td>{row.year}</td>
                          <td>{row.scheme_name}</td>
                          <td className="text-center">{row.gov_student_count}</td>
                          <td className="text-center">{row.gov_amount}</td>
                          <td className="text-center">{row.inst_student_count}</td>
                          <td className="text-center">{row.inst_amount}</td>
                          <td className="text-center">
                            {renderProofLinks(row.proof_links)}
                          </td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
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
