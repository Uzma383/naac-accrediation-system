// Criterion3_2.jsx — 3.2 Number of Sanctioned Posts During the Year
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getRecords, addRecord, updateRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const emptyForm = () => ({
  year: "", sanctioned_posts_count: "", upload_supporting_document: "",
});

export default function Criterion3_2() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm());
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecords("3_2").then(setRecords).finally(() => setLoading(false));
  }, []);

  const showAlert = (msg, type = "success") => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3500); };
  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = async () => {
    if (!form.year) return showAlert("Please fill all required fields.", "danger");
    const result = await addRecord("3_2", form);
    if (result.success) { setRecords(prev => [...prev, result.data]); setForm(emptyForm()); showAlert("Record saved!"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("3_2", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };

  const handleEditSave = async () => {
    await updateRecord("3_2", editRecord.id, editRecord);
    setRecords(prev => prev.map(r => r.id === editRecord.id ? editRecord : r));
    setEditRecord(null); showAlert("Record updated!");
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="3_2" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 3</p>
            <h4>3.2: Number of Sanctioned Posts During the Year</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('3_2'), '_blank')}>
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
            <div className="fw-bold mb-1" style={{ fontSize: "0.92rem" }}>
              <i className="bi bi-info-circle-fill me-2 text-info"></i>
              3.2 Number of Sanctioned posts during the year
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Sanctioned Post Record
              </h6>
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <>
                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label className="form-label-custom">Year <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="e.g. 2024-25"
                        value={form.year} onChange={e => handleChange("year", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label-custom">Number of Sanctioned Posts (Year)</label>
                      <input type="text" className="form-control" placeholder="Enter count"
                        value={form.sanctioned_posts_count} onChange={e => handleChange("sanctioned_posts_count", e.target.value)} />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label-custom">Upload Supporting Document (Proof Link)</label>
                      <input type="text" className="form-control" placeholder="Paste link to uploaded document"
                        value={form.upload_supporting_document} onChange={e => handleChange("upload_supporting_document", e.target.value)} />
                    </div>
                  </div>
                  <div className="text-end">
                    <button className="btn btn-danger px-5 fw-bold" onClick={handleSave}>
                      <i className="bi bi-save me-1"></i> Save Record
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ borderRadius: 14, overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th><th>Year</th><th>Number of Sanctioned Posts</th><th>Proof Document Link</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-muted py-5">No records yet.</td></tr>
                  ) : records.map((row, idx) => (
                    <tr key={row.id}>
                      <td className="text-muted small">{idx + 1}</td>
                      <td><span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>{row.year}</span></td>
                      <td className="fw-semibold">{row.sanctioned_posts_count}</td>
                      <td className="small">
                        {row.upload_supporting_document ? (
                          <a href={row.upload_supporting_document} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none fw-semibold">
                            <i className="bi bi-box-arrow-up-right me-1"></i> View Document
                          </a>
                        ) : <span className="text-muted">No link provided</span>}
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" onClick={() => setEditRecord({ ...row })}><i className="bi bi-pencil-square"></i></button>
                          <button className="btn btn-outline-danger" onClick={() => handleDelete(row.id)}><i className="bi bi-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {editRecord && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 14 }}>
              <div className="modal-header" style={{ background: "#166534", color: "white", borderRadius: "14px 14px 0 0" }}>
                <h5 className="modal-title fw-bold">Edit Sanctioned Post Record</h5>
                <button className="btn-close btn-close-white" onClick={() => setEditRecord(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label-custom">Year</label>
                    <input type="text" className="form-control" value={editRecord.year || ""} onChange={e => setEditRecord({ ...editRecord, year: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">Number of Sanctioned Posts</label>
                    <input type="text" className="form-control" value={editRecord.sanctioned_posts_count || ""} onChange={e => setEditRecord({ ...editRecord, sanctioned_posts_count: e.target.value })} />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label-custom">Proof Document Link</label>
                    <input type="text" className="form-control" value={editRecord.upload_supporting_document || ""} onChange={e => setEditRecord({ ...editRecord, upload_supporting_document: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light" style={{ borderRadius: "0 0 14px 14px" }}>
                <button className="btn btn-secondary" onClick={() => setEditRecord(null)}>Cancel</button>
                <button className="btn btn-success fw-bold px-4" onClick={handleEditSave}>Update Record</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
