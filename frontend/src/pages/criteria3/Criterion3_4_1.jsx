// Criterion3_4_1.jsx — 3.4.1 Collaborations/linkages for Faculty exchange, Internship, Research, etc.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getAcademicYears, getRecords, addRecord, updateRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const DURATION_OPTIONS = ["1 Month","2 Months","3 Months","4 Months","5 Months","6 Months","7 Months","8 Months","9 Months","10 Months","11 Months","12 Months"];
const NATURE_OPTIONS = ["Offline", "Online", "Remote"];

const emptyForm = () => ({
  activity_title: "", agency_name: "", participant_name: "",
  year: "", duration: "", nature_of_activity: "", proof_links: "",
});



export default function Criterion3_4_1() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm());
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAcademicYears(), getRecords("3_4_1")])
      .then(([y, r]) => { setYearOptions(y); setRecords(r); })
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (msg, type = "success") => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3500); };
  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = async () => {
    if (!form.activity_title) return showAlert("Please fill the Activity Title.", "danger");
    const result = await addRecord("3_4_1", form);
    if (result.success) { setRecords(prev => [...prev, result.data]); setForm(emptyForm()); showAlert("Record saved!"); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteRecord("3_4_1", id);
    setRecords(prev => prev.filter(r => r.id !== id)); showAlert("Deleted.");
  };
  const handleEditSave = async () => {
    await updateRecord("3_4_1", editRecord.id, editRecord);
    setRecords(prev => prev.map(r => r.id === editRecord.id ? editRecord : r));
    setEditRecord(null); showAlert("Updated!");
  };


  return (
    <div className="app-layout">
      <Sidebar activePage="3_4_1" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 3</p>
            <h4>3.4.1: Collaborations / Linkages During the Year</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('3_4_1'), '_blank')}>
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
              3.4.1 The Institution has several collaborations/linkages for Faculty exchange, Student exchange, Internship, Field trip, On-the-job training, research etc during the year
            </div>
          </div>
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Collaboration Record
              </h6>
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label-custom">Title of the Collaborative Activity <span className="text-danger">*</span></label>
                      <input type="text" className="form-control" placeholder="Collaboration title"
                        value={form.activity_title} onChange={e => handleChange("activity_title", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label-custom">Name of the Collaborating Agency with Contact Details</label>
                      <input type="text" className="form-control" placeholder="Agency name and contact"
                        value={form.agency_name} onChange={e => handleChange("agency_name", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label-custom">Name of the Participant</label>
                      <input type="text" className="form-control" placeholder="Participant name"
                        value={form.participant_name} onChange={e => handleChange("participant_name", e.target.value)} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label-custom">Year of Collaboration</label>
                      <select className="form-select" value={form.year} onChange={e => handleChange("year", e.target.value)}>
                        <option value="">Select Year</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <label className="form-label-custom">Duration</label>
                      <input type="text" className="form-control" placeholder="e.g. 6 months"
                        value={form.duration} onChange={e => handleChange("duration", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label-custom">Nature of the Activity</label>
                      <input type="text" className="form-control" placeholder="e.g. Internship"
                        value={form.nature_of_activity} onChange={e => handleChange("nature_of_activity", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label-custom">Proof Document Link</label>
                      <input type="text" className="form-control" placeholder="Link to document"
                        value={form.proof_links} onChange={e => handleChange("proof_links", e.target.value)} />
                    </div>
                  </div>
                  <div className="text-end mt-3">
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
                  <tr>
                    <th>#</th><th>Title of Collaborative Activity</th><th>Collaborating Agency</th>
                    <th>Participant</th><th>Year</th><th>Duration</th><th>Nature</th><th>Proof Link</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? <tr><td colSpan={9} className="text-center text-muted py-5">No records yet.</td></tr>
                    : records.map((row, idx) => (
                      <tr key={row.id}>
                        <td className="text-muted small">{idx + 1}</td>
                        <td className="fw-semibold">{row.activity_title}</td>
                        <td>{row.agency_name}</td>
                        <td>{row.participant_name}</td>
                        <td><span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>{row.year}</span></td>
                        <td>{row.duration}</td>
                        <td><span className="badge bg-info text-dark">{row.nature_of_activity}</span></td>
                        <td className="small"><a href={row.proof_links} target="_blank" rel="noreferrer">{row.proof_links}</a></td>
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
                <h5 className="modal-title fw-bold">Edit Collaboration Record</h5>
                <button className="btn-close btn-close-white" onClick={() => setEditRecord(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label-custom">Title of the Collaborative Activity <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" placeholder="Collaboration title"
                      value={editRecord.activity_title || ""} onChange={e => setEditRecord({ ...editRecord, activity_title: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">Name of the Collaborating Agency with Contact Details</label>
                    <input type="text" className="form-control" placeholder="Agency name and contact"
                      value={editRecord.agency_name || ""} onChange={e => setEditRecord({ ...editRecord, agency_name: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">Name of the Participant</label>
                    <input type="text" className="form-control" placeholder="Participant name"
                      value={editRecord.participant_name || ""} onChange={e => setEditRecord({ ...editRecord, participant_name: e.target.value })} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label-custom">Year of Collaboration</label>
                    <select className="form-select" value={editRecord.year || ""} onChange={e => setEditRecord({ ...editRecord, year: e.target.value })}>
                      <option value="">Select Year</option>
                      {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label-custom">Duration</label>
                    <input type="text" className="form-control" placeholder="e.g. 6 months"
                      value={editRecord.duration || ""} onChange={e => setEditRecord({ ...editRecord, duration: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">Nature of the Activity</label>
                    <input type="text" className="form-control" placeholder="e.g. Internship"
                      value={editRecord.nature_of_activity || ""} onChange={e => setEditRecord({ ...editRecord, nature_of_activity: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">Proof Document Link</label>
                    <input type="text" className="form-control" placeholder="Link to document"
                      value={editRecord.proof_links || ""} onChange={e => setEditRecord({ ...editRecord, proof_links: e.target.value })} />
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
