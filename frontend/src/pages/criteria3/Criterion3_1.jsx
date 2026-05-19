// Criterion3_1.jsx — 3.1 Number of Full-Time Teachers During the Year
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getTeachers, getAcademicYears, getRecords, addRecord, updateRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const DESIGNATION_OPTIONS = ["Assistant Professor", "Associate Professor", "Professor", "HOD", "Director", "Principal", "Lab Assistant", "Other"];

const emptyForm = () => ({
  teacher_id: "", id_number_aadhar: "", email: "",
  gender: "", designation: "", date_of_joining: "",
  sanctioned_posts: "", academic_year: "",
});

export default function Criterion3_1() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm());
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTeachers(), getAcademicYears(), getRecords("3_1")])
      .then(([t, y, r]) => { setTeachers(t); setYearOptions(y); setRecords(r); })
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (msg, type = "success") => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3500); };
  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const getTeacherName = (id) => { const t = teachers.find(t => String(t.id) === String(id)); return t ? t.name : id; };

  const handleSave = async () => {
    if (!form.teacher_id || !form.academic_year) return showAlert("Please fill all required fields.", "danger");
    const result = await addRecord("3_1", form);
    if (result.success) { setRecords(prev => [...prev, result.data]); setForm(emptyForm()); showAlert("Record saved!"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("3_1", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };

  const handleEditSave = async () => {
    await updateRecord("3_1", editRecord.id, editRecord);
    setRecords(prev => prev.map(r => r.id === editRecord.id ? editRecord : r));
    setEditRecord(null); showAlert("Record updated!");
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="3_1" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 3</p>
            <h4>3.1: Number of Full-Time Teachers During the Year</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('3_1'), '_blank')}>
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
              3.1 a) Number of full time teachers during the year
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Teacher Record
              </h6>
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <>
                  <div className="row g-3 mb-3">
                    <div className="col-md-3">
                      <label className="form-label-custom">Name <span className="text-danger">*</span></label>
                      <select className="form-select" value={form.teacher_id} onChange={e => handleChange("teacher_id", e.target.value)}>
                        <option value="">Select Teacher</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom">ID Number / Aadhar Number (not mandatory)</label>
                      <input type="text" className="form-control" placeholder="ID or Aadhar number"
                        value={form.id_number_aadhar} onChange={e => handleChange("id_number_aadhar", e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom">Email</label>
                      <input type="email" className="form-control" placeholder="Email address"
                        value={form.email} onChange={e => handleChange("email", e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom">Gender</label>
                      <select className="form-select" value={form.gender} onChange={e => handleChange("gender", e.target.value)}>
                        <option value="">Select Gender</option>
                        {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom">Designation</label>
                      <select className="form-select" value={form.designation} onChange={e => handleChange("designation", e.target.value)}>
                        <option value="">Select Designation</option>
                        {DESIGNATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom">Date of Joining Institution</label>
                      <input type="text" className="form-control" placeholder="DD-MM-YYYY"
                        value={form.date_of_joining} onChange={e => handleChange("date_of_joining", e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom">No. of Sanctioned Posts (Five Year)</label>
                      <input type="text" className="form-control" placeholder="Number"
                        value={form.sanctioned_posts} onChange={e => handleChange("sanctioned_posts", e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label-custom">Academic Year <span className="text-danger">*</span></label>
                      <select className="form-select" value={form.academic_year} onChange={e => handleChange("academic_year", e.target.value)}>
                        <option value="">Select Year</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
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
                    <th>#</th><th>Name</th><th>ID/Aadhar</th><th>Email</th>
                    <th>Gender</th><th>Designation</th><th>Date of Joining</th>
                    <th>Sanctioned Posts</th><th>Academic Year</th><th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={10} className="text-center text-muted py-5">No records yet.</td></tr>
                  ) : records.map((row, idx) => (
                    <tr key={row.id}>
                      <td className="text-muted small">{idx + 1}</td>
                      <td className="fw-semibold">{getTeacherName(row.teacher_id)}</td>
                      <td>{row.id_number_aadhar}</td>
                      <td>{row.email}</td>
                      <td>{row.gender}</td>
                      <td>{row.designation}</td>
                      <td>{row.date_of_joining}</td>
                      <td>{row.sanctioned_posts}</td>
                      <td><span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>{row.academic_year}</span></td>
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
                <h5 className="modal-title fw-bold">Edit Teacher Record</h5>
                <button className="btn-close btn-close-white" onClick={() => setEditRecord(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label-custom">Name</label>
                    <select className="form-select" value={editRecord.teacher_id} onChange={e => setEditRecord({ ...editRecord, teacher_id: e.target.value })}>
                      {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">ID/Aadhar</label>
                    <input type="text" className="form-control" value={editRecord.id_number_aadhar || ""} onChange={e => setEditRecord({ ...editRecord, id_number_aadhar: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Email</label>
                    <input type="email" className="form-control" value={editRecord.email || ""} onChange={e => setEditRecord({ ...editRecord, email: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Gender</label>
                    <select className="form-select" value={editRecord.gender || ""} onChange={e => setEditRecord({ ...editRecord, gender: e.target.value })}>
                      {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Designation</label>
                    <select className="form-select" value={editRecord.designation || ""} onChange={e => setEditRecord({ ...editRecord, designation: e.target.value })}>
                      {DESIGNATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Date of Joining</label>
                    <input type="text" className="form-control" value={editRecord.date_of_joining || ""} onChange={e => setEditRecord({ ...editRecord, date_of_joining: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Sanctioned Posts</label>
                    <input type="text" className="form-control" value={editRecord.sanctioned_posts || ""} onChange={e => setEditRecord({ ...editRecord, sanctioned_posts: e.target.value })} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label-custom">Academic Year</label>
                    <select className="form-select" value={editRecord.academic_year || ""} onChange={e => setEditRecord({ ...editRecord, academic_year: e.target.value })}>
                      {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
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
