// Criterion3_2_1.jsx — 3.2.1 Papers published in UGC notified journals
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getRecords, addRecord, updateRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const emptyForm = () => ({
  paper_title: "", author_names: "", department: "",
  journal_name: "", year_of_publication: "", issn: "", ugc_recognition_link: "",
});

const FIELDS = [
  { key: "paper_title", label: "Title of Paper", col: "col-md-4" },
  { key: "author_names", label: "Name of the Author/s", col: "col-md-3" },
  { key: "department", label: "Department of the Teacher", col: "col-md-3" },
  { key: "journal_name", label: "Name of Journal", col: "col-md-4" },
  { key: "year_of_publication", label: "Year of Publication", col: "col-md-2" },
  { key: "issn", label: "ISSN Number", col: "col-md-2" },
  { key: "ugc_recognition_link", label: "Link to UGC Enlistment of the Journal (Proof)", col: "col-md-4" },
];

export default function Criterion3_2_1() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm());
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getRecords("3_2_1").then(setRecords).finally(() => setLoading(false)); }, []);

  const showAlert = (msg, type = "success") => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3500); };
  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = async () => {
    if (!form.paper_title) return showAlert("Please fill the Paper Title.", "danger");
    const result = await addRecord("3_2_1", form);
    if (result.success) { setRecords(prev => [...prev, result.data]); setForm(emptyForm()); showAlert("Record saved!"); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteRecord("3_2_1", id);
    setRecords(prev => prev.filter(r => r.id !== id)); showAlert("Deleted.");
  };
  const handleEditSave = async () => {
    await updateRecord("3_2_1", editRecord.id, editRecord);
    setRecords(prev => prev.map(r => r.id === editRecord.id ? editRecord : r));
    setEditRecord(null); showAlert("Updated!");
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="3_2_1" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 3</p>
            <h4>3.2.1: Papers Published per Teacher in UGC Notified Journals</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('3_2_1'), '_blank')}>
            <i className="bi bi-file-earmark-excel me-1"></i> Export Excel
          </button>
        </header>
        <div className="container-fluid p-4 fade-in">
          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible d-flex align-items-center gap-2 shadow-sm`} style={{ borderRadius: 10 }}>
              <i className={`bi ${alert.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`}></i>
              {alert.msg}<button className="btn-close ms-auto" onClick={() => setAlert(null)}></button>
            </div>
          )}
          <div className="alert alert-info border-0 shadow-sm mb-4" style={{ borderRadius: 12, background: "linear-gradient(135deg,#e0f2fe,#f0f9ff)" }}>
            <div className="fw-bold" style={{ fontSize: "0.92rem" }}>
              <i className="bi bi-info-circle-fill me-2 text-info"></i>
              3.2.1 Number of papers published per teacher in the Journals notified on UGC website during the year
            </div>
          </div>
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Paper Record
              </h6>
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <>
                  <div className="row g-3 mb-3">
                    {FIELDS.map(({ key, label, col }) => (
                      <div className={col} key={key}>
                        <label className="form-label-custom">{label}{key === "paper_title" && <span className="text-danger"> *</span>}</label>
                        <input type="text" className="form-control" placeholder={`Enter ${label.toLowerCase()}`}
                          value={form[key]} onChange={e => handleChange(key, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div className="text-end">
                    <button className="btn btn-danger px-5 fw-bold" onClick={handleSave}><i className="bi bi-save me-1"></i> Save Record</button>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="card border-0 shadow-sm" style={{ borderRadius: 14, overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr><th>#</th><th>Title of Paper</th><th>Author/s</th><th>Department</th><th>Journal</th><th>Year</th><th>ISSN</th><th>UGC Proof Link</th><th className="text-center">Actions</th></tr>
                </thead>
                <tbody>
                  {records.length === 0 ? <tr><td colSpan={9} className="text-center text-muted py-5">No records yet.</td></tr>
                    : records.map((row, idx) => (
                      <tr key={row.id}>
                        <td className="text-muted small">{idx + 1}</td>
                        <td className="fw-semibold">{row.paper_title}</td>
                        <td>{row.author_names}</td>
                        <td>{row.department}</td>
                        <td>{row.journal_name}</td>
                        <td><span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>{row.year_of_publication}</span></td>
                        <td>{row.issn}</td>
                        <td className="small"><a href={row.ugc_recognition_link} target="_blank" rel="noreferrer">{row.ugc_recognition_link}</a></td>
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
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 14 }}>
              <div className="modal-header" style={{ background: "#166534", color: "white", borderRadius: "14px 14px 0 0" }}>
                <h5 className="modal-title fw-bold">Edit Paper Record</h5>
                <button className="btn-close btn-close-white" onClick={() => setEditRecord(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  {FIELDS.map(({ key, label, col }) => (
                    <div className={col} key={key}>
                      <label className="form-label-custom">{label}</label>
                      <input type="text" className="form-control" value={editRecord[key] || ""}
                        onChange={e => setEditRecord({ ...editRecord, [key]: e.target.value })} />
                    </div>
                  ))}
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
