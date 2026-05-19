// ============================================================
// Criterion4_2_2.jsx — 4.2.2 & 4.2.3 Library Resources & Expenditure
// Resource type dropdown fetched from apiService — no hardcoding
// Auto-calculates total expenditure from subscription + others
// ============================================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getLibraryResources, getAcademicYears, getRecords, addRecord, updateRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const emptyForm = () => ({
  academic_year: "",
  resource_type: "",
  membership_details: "",
  expenditure_ejournals: "",
  expenditure_eresources: "",
  total_library_expenditure: "",
  proof_links: "",
});

export default function Criterion4_2_2() {
  const [resourceOptions, setResourceOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [form, setForm]         = useState(emptyForm());
  const [records, setRecords]   = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [alert, setAlert]       = useState(null);

  useEffect(() => {
    Promise.all([getLibraryResources(), getAcademicYears(), getRecords("4_2_2")])
      .then(([resources, years, recs]) => {
        setResourceOptions(resources);
        setYearOptions(years);
        setRecords(recs);
      })
      .finally(() => setLoadingDropdowns(false));
  }, []);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  // Auto-calculate total when subscription or others change
  const updateForm = (field, val) => {
    setForm(prev => {
      const updated = { ...prev, [field]: val };
      const sub   = parseFloat(field === "expenditure_ejournals" ? val : prev.expenditure_ejournals) || 0;
      const other = parseFloat(field === "expenditure_eresources" ? val : prev.expenditure_eresources) || 0;
      updated.total_library_expenditure = (sub + other).toFixed(2);
      return updated;
    });
  };

  const updateEditForm = (field, val) => {
    setEditRecord(prev => {
      const updated = { ...prev, [field]: val };
      const sub   = parseFloat(field === "expenditure_ejournals" ? val : prev.expenditure_ejournals) || 0;
      const other = parseFloat(field === "expenditure_eresources" ? val : prev.expenditure_eresources) || 0;
      updated.total_library_expenditure = (sub + other).toFixed(2);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!form.resource_type || !form.membership_details) {
      return showAlert("Resource type and membership details are required.", "danger");
    }
    const result = await addRecord("4_2_2", form);
    if (result.success) {
      setRecords(prev => [...prev, result.data]);
      setForm(emptyForm());
      showAlert("Library record added!");
    } else {
      showAlert(result.error || "Failed to save.", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this library record?")) return;
    await deleteRecord("4_2_2", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };

  const handleEditSave = async () => {
    await updateRecord("4_2_2", editRecord.id, editRecord);
    setRecords(prev => prev.map(r => r.id === editRecord.id ? editRecord : r));
    setEditRecord(null);
    showAlert("Record updated!");
  };

  const resourceBadgeColor = {
    "Books":          { bg: "#dcfce7", text: "#16a34a" },
    "Journals":       { bg: "#dbeafe", text: "#1d4ed8" },
    "e-Journals":     { bg: "#e0f2fe", text: "#0369a1" },
    "e-Books":        { bg: "#f3e8ff", text: "#7c3aed" },
    "e-ShodhSindhu":  { bg: "#fef9c3", text: "#ca8a04" },
    "Shodhganga":     { bg: "#ffedd5", text: "#c2410c" },
    "Databases":      { bg: "#fee2e2", text: "#b91c1c" },
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="4_2_2" />

      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 4</p>
            <h4>4.2.2 &amp; 4.2.3: Library Resources &amp; Expenditure</h4>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>Subscription and Purchase Records (INR in Lakhs)</small>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('4_2_2'), '_blank')}>
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

          {/* Form Card */}
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Library Record
              </h6>

              {loadingDropdowns ? (
                <div className="spinner-overlay"><div className="spinner-border text-danger" role="status"></div></div>
              ) : (
                <>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label-custom">Library Resource</label>
                      <select className="form-select" value={form.resource_type} onChange={e => setForm({ ...form, resource_type: e.target.value })}>
                        <option value="">Select Resource</option>
                        {resourceOptions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    <div className="col-md-2">
                      <label className="form-label-custom">Academic Year</label>
                      <select className="form-select" value={form.academic_year} onChange={e => setForm({ ...form, academic_year: e.target.value })}>
                        <option value="">Select Year</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label-custom">Membership Details</label>
                      <input type="text" className="form-control" placeholder="e.g. IEEE, N-LIST, Delnet"
                        value={form.membership_details} onChange={e => setForm({ ...form, membership_details: e.target.value })} />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label-custom">Exp. (e-Journals) ₹L</label>
                      <input type="number" step="0.01" className="form-control" placeholder="0.00"
                        value={form.expenditure_ejournals} onChange={e => updateForm("expenditure_ejournals", e.target.value)} />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label-custom">Exp. (Others) ₹L</label>
                      <input type="number" step="0.01" className="form-control" placeholder="0.00"
                        value={form.expenditure_eresources} onChange={e => updateForm("expenditure_eresources", e.target.value)} />
                    </div>

                    <div className="col-md-2">
                      <label className="form-label-custom">Total Exp. ₹L</label>
                      <input type="number" step="0.01" className="form-control"
                        style={{ background: "#f8f9fa", fontWeight: 700 }}
                        value={form.total_library_expenditure} readOnly />
                    </div>

                    <div className="col-12">
                      <label className="form-label-custom">Document Link</label>
                      <input type="url" className="form-control" placeholder="https://drive.google.com/..."
                        value={form.proof_links} onChange={e => setForm({ ...form, proof_links: e.target.value })} />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-3 pt-3 border-top">
                    <button className="btn btn-danger px-4 fw-bold" onClick={handleSave}>
                      <i className="bi bi-save me-1"></i> Add Library Record
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: 14, overflow: "hidden" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Resource</th>
                    <th>Membership Details</th>
                    <th>Exp. (e-Journals) ₹L</th>
                    <th>Exp. (Others) ₹L</th>
                    <th>Total Expenditure ₹L</th>
                    <th>Document</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-muted py-5">No library records yet.</td></tr>
                  ) : records.map((row, i) => {
                    const c = resourceBadgeColor[row.resource_type] || { bg: "#f1f5f9", text: "#475569" };
                    return (
                      <tr key={row.id} style={{ background: i % 2 === 0 ? "white" : "#f9fafb" }}>
                        <td>
                          <span className="badge px-3 py-2" style={{ background: c.bg, color: c.text, fontWeight: 700, fontSize: "0.75rem" }}>
                            {row.resource_type}
                          </span>
                        </td>
                        <td className="fw-semibold">{row.membership_details}</td>
                        <td>{row.expenditure_ejournals}</td>
                        <td>{row.expenditure_eresources}</td>
                        <td className="fw-bold" style={{ color: "#0369a1" }}>{row.total_library_expenditure}</td>
                        <td>
                          {row.proof_links
                            ? <a href={row.proof_links} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-link-45deg me-1"></i>View
                              </a>
                            : <span className="text-muted small">No link</span>}
                        </td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => setEditRecord({ ...row })} title="Edit">
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(row.id)} title="Delete">
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Edit Modal */}
      {editRecord && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 14 }}>
              <div className="modal-header" style={{ background: "#b31d1d", color: "white", borderRadius: "14px 14px 0 0" }}>
                <h5 className="modal-title fw-bold">Edit Library Record</h5>
                <button className="btn-close btn-close-white" onClick={() => setEditRecord(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Resource Type</label>
                    <select className="form-select" value={editRecord.resource}
                      onChange={e => setEditRecord({ ...editRecord, resource: e.target.value })}>
                      <option value="">Select Resource</option>
                      {resourceOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label-custom">Membership Details</label>
                    <input type="text" className="form-control" value={editRecord.details}
                      onChange={e => setEditRecord({ ...editRecord, details: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">Exp. (Journals) ₹L</label>
                    <input type="number" step="0.01" className="form-control" value={editRecord.exp_subscription}
                      onChange={e => updateEditForm("exp_subscription", e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">Exp. (Others) ₹L</label>
                    <input type="number" step="0.01" className="form-control" value={editRecord.exp_others}
                      onChange={e => updateEditForm("exp_others", e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label-custom">Total Exp. ₹L</label>
                    <input type="number" step="0.01" className="form-control"
                      style={{ background: "#f8f9fa", fontWeight: 700 }}
                      value={editRecord.total_exp} readOnly />
                  </div>
                  <div className="col-12">
                    <label className="form-label-custom">Document Link</label>
                    <input type="url" className="form-control" value={editRecord.link}
                      onChange={e => setEditRecord({ ...editRecord, link: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light" style={{ borderRadius: "0 0 14px 14px" }}>
                <button className="btn btn-secondary" onClick={() => setEditRecord(null)}>Cancel</button>
                <button className="btn btn-danger fw-bold px-4" onClick={handleEditSave}>Update Record</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
