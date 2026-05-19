// ============================================================
// Criterion5_1_3.jsx — 5.1.3: Capacity Building & Skills Enhancement
// ============================================================
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getRecords, addRecord, deleteRecord, getAcademicYears, uploadEvidence, getExcelExportUrl } from "../../api/apiService";

const emptyForm = () => ({ scheme_name: "", date_impl: "", num_students: "", agencies: "", document: null });

export default function Criterion5_1_3() {
  const [rows, setRows]           = useState([emptyForm()]);
  const [records, setRecords]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [alert, setAlert]         = useState(null);
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    Promise.all([getRecords("5_1_3"), getAcademicYears()])
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
    const valid = rows.filter(r => r.scheme_name && r.date_impl && r.num_students && r.agencies);
    if (!valid.length) return showAlert("Please fill all required fields in at least one row.", "danger");
    for (const row of valid) {
      const payload = {
        program_name: row.scheme_name,
        implementation_date: row.date_impl,
        students_enrolled: row.num_students,
        agencies_involved: row.agencies
      };
      const result = await addRecord("5_1_3", payload);
      if (result.success) {
        if (row.document) {
          const uploadRes = await uploadEvidence("5_1_3", [row.document], result.data.id);
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

  const handleExport = () => {
    window.open(getExcelExportUrl("5_1_3"), "_blank");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("5_1_3", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };



  return (
    <div className="app-layout">
      <Sidebar activePage="5_1_3" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 5</p>
            <h4>5.1.3: Capacity Building & Skills Enhancement</h4>
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

          <div className="alert alert-info border-0 shadow-sm mb-4" style={{ borderRadius: 12, background: "linear-gradient(135deg,#e0f2fe,#f0f9ff)" }}>
            <div className="fw-bold mb-1" style={{ fontSize: "0.92rem", color: "#0369a1" }}>
              5.1.3 Capacity building and skills enhancement initiatives taken by the institution include the following<br/>
              <span className="fw-normal">1. Soft skills, 2. Language and communication skills, 3. Life skills (Yoga, physical fitness, health and hygiene), 4. ICT/computing skills</span>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Skills Enhancement Records
              </h6>
              {rows.map((row, idx) => (
                <div key={idx} className="row g-2 mb-3 p-3 border rounded bg-light align-items-end">
                  <div className="col-md-3">
                    <label className="form-label-custom" style={{fontSize:"0.8rem"}}>Name of the capability enhancement program</label>
                    <input type="text" className="form-control" placeholder="Soft Skills, Communication..."
                      value={row.scheme_name} onChange={e => updateRow(idx, "scheme_name", e.target.value)} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label-custom" style={{fontSize:"0.8rem"}}>Date of implementation (DD-MM-YYYY)</label>
                    <input type="text" className="form-control" placeholder="15-08-2024"
                      value={row.date_impl} onChange={e => updateRow(idx, "date_impl", e.target.value)} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label-custom" style={{fontSize:"0.8rem"}}>Number of students enrolled</label>
                    <input type="number" className="form-control" placeholder="60"
                      value={row.num_students} onChange={e => updateRow(idx, "num_students", e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom" style={{fontSize:"0.8rem"}}>Name of the agencies/consultants involved with contact details (if any)</label>
                    <input type="text" className="form-control" placeholder="Agency Name"
                      value={row.agencies} onChange={e => updateRow(idx, "agencies", e.target.value)} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label-custom" style={{fontSize:"0.8rem"}}>Evidence (PDF)</label>
                    <div className="d-flex gap-2">
                      <input type="file" className="form-control form-control-sm" accept=".pdf"
                        onChange={e => updateRow(idx, "document", e.target.files[0])} />
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeRow(idx)}>×</button>
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
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: '25%' }}>Name of the capability enhancement program</th>
                        <th style={{ width: '15%' }}>Date of implementation<br/><small>(DD-MM-YYYY)</small></th>
                        <th style={{ width: '15%' }}>Number of students enrolled</th>
                        <th style={{ width: '25%' }}>Name of the agencies/consultants involved with contact details (if any)</th>
                        <th className="text-center" style={{ width: '10%' }}>Evidence</th>
                        <th className="text-center" style={{ width: '10%' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length === 0 ? (
                        <tr><td colSpan={6} className="text-center text-muted py-4">No records found for Criteria 5.1.3.</td></tr>
                      ) : records.map(row => (
                        <tr key={row.id}>
                          <td>{row.program_name}</td>
                          <td>{row.implementation_date}</td>
                          <td>{row.students_enrolled}</td>
                          <td>{row.agencies_involved}</td>
                          <td className="text-center">
                            {row.proof_links && <a href={row.proof_links.startsWith('http') ? row.proof_links : `http://localhost:5000${row.proof_links.startsWith('/') ? '' : '/'}${row.proof_links}`} target="_blank" rel="noreferrer" className="text-danger"><i className="bi bi-file-earmark-pdf fs-5"></i></a>}
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
