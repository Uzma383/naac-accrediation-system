// Criterion3_4_2.jsx — 3.4.2 Functional MoUs with national/international institutions
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getRecords, addRecord, updateRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const FIELDS = [
  { key: "organisation_name", label: "Organisation with which MoU is Signed", col: "col-md-4" },
  { key: "institution_name", label: "Name of the Institution / Industry / Corporate House", col: "col-md-4" },
  { key: "signing_year", label: "Year of Signing MoU", col: "col-md-2" },
  { key: "duration", label: "Duration", col: "col-md-2" },
  { key: "activities_list", label: "List the Actual Activities under Each MOU Year Wise", col: "col-md-6" },
  { key: "participant_count", label: "Number of Students / Teachers Participated under MoUs", col: "col-md-3" },
];

const emptyForm = () => ({
  organisation_name: "", institution_name: "", signing_year: "",
  duration: "", activities_list: "", participant_count: "",
});

export default function Criterion3_4_2() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm());
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getRecords("3_4_2").then(setRecords).finally(() => setLoading(false)); }, []);

  const showAlert = (msg, type = "success") => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3500); };
  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = async () => {
    if (!form.organisation_name) return showAlert("Please fill the Organisation Name.", "danger");
    const result = await addRecord("3_4_2", form);
    if (result.success) { setRecords(prev => [...prev, result.data]); setForm(emptyForm()); showAlert("Record saved!"); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteRecord("3_4_2", id);
    setRecords(prev => prev.filter(r => r.id !== id)); showAlert("Deleted.");
  };
  const handleEditSave = async () => {
    await updateRecord("3_4_2", editRecord.id, editRecord);
    setRecords(prev => prev.map(r => r.id === editRecord.id ? editRecord : r));
    setEditRecord(null); showAlert("Updated!");
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="3_4_2" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 3</p>
            <h4>3.4.2: Functional MoUs with Institutions / Industries During the Year</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('3_4_2'), '_blank')}>
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
              3.4.2 Number of functional MoUs with national and international institutions, universities, industries, corporate houses etc. during the year
            </div>
          </div>
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add MoU Record
              </h6>
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <>
                  <div className="row g-3 mb-3">
                    {FIELDS.map(({ key, label, col }) => (
                      <div className={col} key={key}>
                        <label className="form-label-custom">{label}{key === "organisation_name" && <span className="text-danger"> *</span>}</label>
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
                  <tr>
                    <th>#</th><th>Organisation</th><th>Institution / Industry</th><th>Year of Signing</th>
                    <th>Duration</th><th>Activities under MOU</th><th>Students / Teachers Participated</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? <tr><td colSpan={8} className="text-center text-muted py-5">No records yet.</td></tr>
                    : records.map((row, idx) => (
                      <tr key={row.id}>
                        <td className="text-muted small">{idx + 1}</td>
                        <td className="fw-semibold">{row.organisation_name}</td>
                        <td>{row.institution_name}</td>
                        <td><span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>{row.signing_year}</span></td>
                        <td>{row.duration}</td>
                        <td className="small">{row.activities_list}</td>
                        <td>{row.participant_count}</td>
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
                <h5 className="modal-title fw-bold">Edit MoU Record</h5>
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
