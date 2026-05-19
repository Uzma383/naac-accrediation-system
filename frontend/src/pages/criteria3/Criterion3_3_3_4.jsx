// Criterion3_3_3_4.jsx — 3.3.3 & 3.3.4 Extension/Outreach Programs & Student Participation
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getAcademicYears, getRecords, addRecord, updateRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const emptyForm = () => ({
  activity_name: "", agency_name: "", scheme_name: "", year: "", students_participated: "",
});

const FormFields = ({ data, onChange, yearOptions }) => (
  <div className="row g-3">
    <div className="col-md-3">
      <label className="form-label-custom">Name of the Activity <span className="text-danger">*</span></label>
      <input type="text" className="form-control" placeholder="Activity name"
        value={data.activity_name} onChange={e => onChange("activity_name", e.target.value)} />
    </div>
    <div className="col-md-3">
      <label className="form-label-custom">Organising Unit / Agency / Collaborating Agency</label>
      <input type="text" className="form-control" placeholder="Organisation or agency"
        value={data.agency_name} onChange={e => onChange("agency_name", e.target.value)} />
    </div>
    <div className="col-md-2">
      <label className="form-label-custom">Name of the Scheme</label>
      <input type="text" className="form-control" placeholder="Scheme name"
        value={data.scheme_name} onChange={e => onChange("scheme_name", e.target.value)} />
    </div>
    <div className="col-md-2">
      <label className="form-label-custom">Year of the Activity</label>
      <select className="form-select" value={data.year} onChange={e => onChange("year", e.target.value)}>
        <option value="">Select Year</option>
        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
    <div className="col-md-2">
      <label className="form-label-custom">Students Participated</label>
      <input type="number" className="form-control" placeholder="Count"
        value={data.students_participated} onChange={e => onChange("students_participated", e.target.value)} />
    </div>
  </div>
);

export default function Criterion3_3_3_4() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm());
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAcademicYears(), getRecords("3_3_3_4")])
      .then(([y, r]) => { setYearOptions(y); setRecords(r); })
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (msg, type = "success") => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3500); };
  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = async () => {
    if (!form.activity_name) return showAlert("Please fill the Activity Name.", "danger");
    const result = await addRecord("3_3_3_4", form);
    if (result.success) { setRecords(prev => [...prev, result.data]); setForm(emptyForm()); showAlert("Record saved!"); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteRecord("3_3_3_4", id);
    setRecords(prev => prev.filter(r => r.id !== id)); showAlert("Deleted.");
  };
  const handleEditSave = async () => {
    await updateRecord("3_3_3_4", editRecord.id, editRecord);
    setRecords(prev => prev.map(r => r.id === editRecord.id ? editRecord : r));
    setEditRecord(null); showAlert("Updated!");
  };



  return (
    <div className="app-layout">
      <Sidebar activePage="3_3_3_4" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 3</p>
            <h4>3.3.3 & 3.3.4: Extension / Outreach Programs & Student Participation</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('3_3_3_4'), '_blank')}>
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
            <div className="fw-bold mb-1" style={{ fontSize: "0.92rem" }}>
              <i className="bi bi-info-circle-fill me-2 text-info"></i>
              3.3.3 Number of extension and outreach programs conducted by the institution through NSS/NCC/Government and Government recognized bodies during the year
            </div>
            <div className="text-muted small">3.3.4 Number of students participating in extension activities at 3.3.3. above during the year</div>
          </div>
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Extension Activity Record
              </h6>
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <>
                  <FormFields data={form} onChange={handleChange} yearOptions={yearOptions} />
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
                    <th>#</th><th>Name of Activity</th><th>Organising Unit / Agency</th>
                    <th>Name of Scheme</th><th>Year of Activity</th><th>Students Participated</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? <tr><td colSpan={7} className="text-center text-muted py-5">No records yet.</td></tr>
                    : records.map((row, idx) => (
                      <tr key={row.id}>
                        <td className="text-muted small">{idx + 1}</td>
                        <td className="fw-semibold">{row.activity_name}</td>
                        <td>{row.agency_name}</td>
                        <td>{row.scheme_name}</td>
                        <td><span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>{row.year}</span></td>
                        <td><span className="badge bg-primary">{row.students_participated}</span></td>
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
                <h5 className="modal-title fw-bold">Edit Extension Activity Record</h5>
                <button className="btn-close btn-close-white" onClick={() => setEditRecord(null)}></button>
              </div>
              <div className="modal-body p-4">
                <FormFields data={editRecord} onChange={(f, v) => setEditRecord({ ...editRecord, [f]: v })} />
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
