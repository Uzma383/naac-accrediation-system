// ============================================================
// Criterion4_1_4.jsx — 4.1.4 & 4.4.1 Infrastructure Expenditure
// Academic year dropdown fetched from apiService — no hardcoding
// ============================================================
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getAcademicYears, getRecords, addRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const emptyForm = () => ({
  year: "",
  budget_infra: "",
  expenditure_infra: "",
  total_expenditure_excl_salary: "",
  expenditure_academic_maint: "",
  expenditure_physical_maint: "",
});

export default function Criterion4_1_4() {
  const [yearOptions, setYearOptions]   = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [form, setForm]                 = useState(emptyForm());
  const [records, setRecords]           = useState([]);
  const [alert, setAlert]               = useState(null);

  useEffect(() => {
    Promise.all([getAcademicYears(), getRecords("4_1_4")])
      .then(([years, recs]) => {
        setYearOptions(years);
        setRecords(recs);
      })
      .finally(() => setLoadingDropdowns(false));
  }, []);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = async () => {
    if (!form.year) return showAlert("Please select an academic year.", "danger");
    if (!form.budget_infra || !form.total_expenditure_excl_salary) {
      return showAlert("Budget Allocated and Total Expenditure are required.", "danger");
    }
    const result = await addRecord("4_1_4", form);
    if (result.success) {
      setRecords(prev => [...prev, result.data]);
      setForm(emptyForm());
      showAlert("Yearly record saved!");
    } else {
      showAlert(result.error || "Failed to save record", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("4_1_4", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };

  const fields = [
    { key: "budget_infra",                  label: "Budget Allocated",          placeholder: "0.00" },
    { key: "expenditure_infra",             label: "Exp. Augmentation",         placeholder: "0.00" },
    { key: "total_expenditure_excl_salary", label: "Total Exp. (Excl. Salary)", placeholder: "0.00" },
    { key: "expenditure_academic_maint",    label: "Maint. Academic",           placeholder: "0.00" },
    { key: "expenditure_physical_maint",    label: "Maint. Physical",           placeholder: "0.00" },
  ];

  return (
    <div className="app-layout">
      <Sidebar activePage="4_1_4" />

      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 4</p>
            <h4>4.1.4 &amp; 4.4.1: Infrastructure Expenditure</h4>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>INR in Lakhs — Excluding Salary</small>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('4_1_4'), '_blank')}>
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
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Yearly Expenditure Record
              </h6>

              {loadingDropdowns ? (
                <div className="spinner-overlay"><div className="spinner-border text-danger" role="status"></div></div>
              ) : (
                <>
                  <div className="row g-3">
                    {/* Year dropdown */}
                    <div className="col-md-2">
                      <label className="form-label-custom">Academic Year</label>
                      <select className="form-select" value={form.year} onChange={e => set("year", e.target.value)}>
                        <option value="">Select Year</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    {/* Numeric fields */}
                    {fields.map(f => (
                      <div key={f.key} className="col-md-2">
                        <label className="form-label-custom">{f.label}</label>
                        <div className="input-group">
                          <span className="input-group-text" style={{ fontSize: "0.78rem", background: "#f8f9fa" }}>₹</span>
                          <input
                            type="number" step="0.01" className="form-control"
                            placeholder={f.placeholder}
                            value={form[f.key]}
                            onChange={e => set(f.key, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-end mt-3 pt-3 border-top">
                    <button className="btn btn-danger px-4 fw-bold" onClick={handleSave}>
                      <i className="bi bi-save me-1"></i> Save Yearly Record
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
                    <th>Year</th>
                    <th>Budget Allocated (₹L)</th>
                    <th>Augmentation (₹L)</th>
                    <th>Total Exp. Excl. Salary (₹L)</th>
                    <th>Maint. Academic (₹L)</th>
                    <th>Maint. Physical (₹L)</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-muted py-5">No records yet. Add a yearly record above.</td></tr>
                  ) : records.map((row, i) => (
                    <tr key={row.id} style={{ background: i % 2 === 0 ? "white" : "#f9fafb" }}>
                      <td>
                        <span className="badge" style={{ background: "#fee2e2", color: "#b31d1d", fontWeight: 700, fontSize: "0.75rem" }}>
                          {row.year}
                        </span>
                      </td>
                      <td>{row.budget_infra}</td>
                      <td>{row.expenditure_infra}</td>
                      <td className="fw-bold" style={{ color: "#0369a1" }}>{row.total_expenditure_excl_salary}</td>
                      <td>{row.expenditure_academic_maint}</td>
                      <td>{row.expenditure_physical_maint}</td>
                      <td className="text-center">
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(row.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
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
    </div>
  );
}
