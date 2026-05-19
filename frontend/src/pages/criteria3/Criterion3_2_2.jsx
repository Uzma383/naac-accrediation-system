// Criterion3_2_2.jsx — 3.2.2 Books, chapters and papers in conference proceedings per teacher
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getTeachers, getAcademicYears, getRecords, addRecord, updateRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const YEAR_RANGE = ["2019-20","2020-21","2021-22","2022-23","2023-24","2024-25","2025-26","2026-27"];

const emptyForm = () => ({
  teacher_ids: [], other_teacher_name: "",
  book_title: "", paper_title: "", proceedings_title: "",
  conference_name: "", level: "", year_of_publication: "",
  isbn_issn: "", affiliating_institute: "", publisher: "",
});

// Multi-select teacher dropdown component
function TeacherMultiSelect({ teachers, selectedIds, otherName, onToggle, onOtherChange, includeOther, onToggleOther }) {
  const [open, setOpen] = useState(false);
  const selectedNames = selectedIds.map(id => teachers.find(t => String(t.id) === String(id))?.name || "").filter(Boolean);
  const display = [...selectedNames, ...(includeOther && otherName ? [otherName] : [])].join(", ") || "Select Teachers";

  return (
    <div style={{ position: "relative" }}>
      <div className="form-control d-flex align-items-center justify-content-between"
        style={{ cursor: "pointer", minHeight: 38 }} onClick={() => setOpen(o => !o)}>
        <span className="text-truncate small" style={{ color: selectedNames.length || (includeOther && otherName) ? "#212529" : "#6c757d" }}>{display}</span>
        <i className={`bi bi-chevron-${open ? "up" : "down"} ms-2`}></i>
      </div>
      {open && (
        <div className="border rounded shadow-sm bg-white" style={{ position: "absolute", zIndex: 1000, width: "100%", maxHeight: 220, overflowY: "auto", top: "100%" }}>
          {teachers.map(t => (
            <div key={t.id} className="form-check px-3 py-1" style={{ cursor: "pointer" }} onClick={() => onToggle(String(t.id))}>
              <input type="checkbox" className="form-check-input" readOnly checked={selectedIds.includes(String(t.id))} />
              <label className="form-check-label ms-1 small">{t.name}</label>
            </div>
          ))}
          <div className="form-check px-3 py-1 border-top" style={{ cursor: "pointer" }} onClick={onToggleOther}>
            <input type="checkbox" className="form-check-input" readOnly checked={includeOther} />
            <label className="form-check-label ms-1 small fw-bold text-danger">Other (type below)</label>
          </div>
          {includeOther && (
            <div className="px-3 pb-2">
              <input type="text" className="form-control form-control-sm" placeholder="Type other teacher name"
                value={otherName} onChange={e => onOtherChange(e.target.value)} onClick={e => e.stopPropagation()} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Criterion3_2_2() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm());
  const [includeOther, setIncludeOther] = useState(false);
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTeachers(), getAcademicYears(), getRecords("3_2_2")])
      .then(([t, y, r]) => { setTeachers(t); setYearOptions([...YEAR_RANGE, ...y.filter(yr => !YEAR_RANGE.includes(yr))]); setRecords(r); })
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (msg, type = "success") => { setAlert({ msg, type }); setTimeout(() => setAlert(null), 3500); };
  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const toggleTeacher = (id) => setForm(f => ({ ...f, teacher_ids: f.teacher_ids.includes(id) ? f.teacher_ids.filter(t => t !== id) : [...f.teacher_ids, id] }));

  const getTeacherLabel = (row) => {
    const names = (row.teacher_ids || []).map(id => teachers.find(t => String(t.id) === String(id))?.name || "").filter(Boolean);
    if (row.other_teacher_name) names.push(row.other_teacher_name);
    return names.join(", ") || "-";
  };

  const handleSave = async () => {
    if (form.teacher_ids.length === 0 && !form.other_teacher_name) return showAlert("Please select at least one teacher.", "danger");
    const result = await addRecord("3_2_2", form);
    if (result.success) { setRecords(prev => [...prev, result.data]); setForm(emptyForm()); setIncludeOther(false); showAlert("Record saved!"); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    await deleteRecord("3_2_2", id);
    setRecords(prev => prev.filter(r => r.id !== id)); showAlert("Deleted.");
  };
  const handleEditSave = async () => {
    await updateRecord("3_2_2", editRecord.id, editRecord);
    setRecords(prev => prev.map(r => r.id === editRecord.id ? editRecord : r));
    setEditRecord(null); showAlert("Updated!");
  };

  const textFields = [
    { key: "book_title", label: "Title of the Book/Chapters Published", col: "col-md-4" },
    { key: "paper_title", label: "Title of the Paper", col: "col-md-4" },
    { key: "proceedings_title", label: "Title of the Proceedings of the Conference", col: "col-md-4" },
    { key: "conference_name", label: "Name of the Conference", col: "col-md-3" },
    { key: "level", label: "National / International", col: "col-md-2" },
    { key: "isbn_issn", label: "ISBN/ISSN Number of the Proceeding", col: "col-md-2" },
    { key: "affiliating_institute", label: "Affiliating Institute at the Time of Publication", col: "col-md-3" },
    { key: "publisher", label: "Name of the Publisher", col: "col-md-3" },
  ];

  return (
    <div className="app-layout">
      <Sidebar activePage="3_2_2" />
      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 3</p>
            <h4>3.2.2: Books, Chapters & Papers in Conference Proceedings per Teacher</h4>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('3_2_2'), '_blank')}>
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
              3.2.2 Number of books and chapters in edited volumes/books published and papers published in national/international conference proceedings per teacher during the year
            </div>
          </div>
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 14 }}>
            <div className="card-body p-4">
              <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: "0.78rem", letterSpacing: 1, color: "#888" }}>
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add Publication Record
              </h6>
              {loading ? <div className="text-center py-4"><div className="spinner-border text-danger"></div></div> : (
                <>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label-custom">Name of the Teacher <span className="text-danger">*</span></label>
                      <TeacherMultiSelect
                        teachers={teachers} selectedIds={form.teacher_ids} otherName={form.other_teacher_name}
                        onToggle={toggleTeacher} onOtherChange={v => handleChange("other_teacher_name", v)}
                        includeOther={includeOther} onToggleOther={() => setIncludeOther(o => !o)} />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label-custom">Year of Publication</label>
                      <select className="form-select" value={form.year_of_publication} onChange={e => handleChange("year_of_publication", e.target.value)}>
                        <option value="">Select Year</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    {textFields.map(({ key, label, col }) => (
                      <div className={col} key={key}>
                        <label className="form-label-custom">{label}</label>
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
                    <th>#</th><th>Name of Teacher</th><th>Book/Chapter Title</th><th>Paper Title</th>
                    <th>Proceedings Title</th><th>Conference</th><th>Level</th><th>Year</th>
                    <th>ISBN/ISSN</th><th>Affiliating Institute</th><th>Publisher</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? <tr><td colSpan={12} className="text-center text-muted py-5">No records yet.</td></tr>
                    : records.map((row, idx) => (
                      <tr key={row.id}>
                        <td className="text-muted small">{idx + 1}</td>
                        <td className="fw-semibold">{getTeacherLabel(row)}</td>
                        <td>{row.book_title}</td><td>{row.paper_title}</td>
                        <td>{row.proceedings_title}</td><td>{row.conference_name}</td>
                        <td>{row.level}</td>
                        <td><span className="badge" style={{ background: "#dcfce7", color: "#166534", fontWeight: 700 }}>{row.year_of_publication}</span></td>
                        <td>{row.isbn_issn}</td><td>{row.affiliating_institute}</td><td>{row.publisher}</td>
                        <td className="text-center">
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => setEditRecord({ ...row, teacher_ids: row.teacher_ids || [] })}><i className="bi bi-pencil-square"></i></button>
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
                <h5 className="modal-title fw-bold">Edit Publication Record</h5>
                <button className="btn-close btn-close-white" onClick={() => setEditRecord(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-3">
                  <div className="col-md-2">
                    <label className="form-label-custom">Year of Publication</label>
                    <select className="form-select" value={editRecord.year_of_publication || ""} onChange={e => setEditRecord({ ...editRecord, year_of_publication: e.target.value })}>
                      <option value="">Select Year</option>
                      {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  {textFields.map(({ key, label, col }) => (
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
