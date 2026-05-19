// ============================================================
// Criterion4_1_3.jsx — 4.1.3 ICT-Enabled Facilities
// No dropdown needed — all fields are free-text
// ============================================================
import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { getRecords, addRecord, deleteRecord, getExcelExportUrl } from "../../api/apiService";

const emptyForm = () => ({ room_number: "", ict_facility_type: "", geo_tagged_photo_link: "" });

export default function Criterion4_1_3() {
  const [form, setForm]       = useState(emptyForm());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert]     = useState(null);

  useEffect(() => {
    getRecords("4_1_3")
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleSave = async () => {
    if (!form.room_number || !form.ict_facility_type) {
      return showAlert("Room number and ICT type are required.", "danger");
    }
    const result = await addRecord("4_1_3", form);
    if (result.success) {
      setRecords(prev => [...prev, result.data]);
      setForm(emptyForm());
      showAlert("Record added successfully!");
    } else {
      showAlert(result.error || "Failed to save.", "danger");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    await deleteRecord("4_1_3", id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showAlert("Record deleted.");
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="4_1_3" />

      <div className="main-content">
        <header className="page-header">
          <div>
            <p className="text-muted mb-0" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: 1 }}>Criteria 4</p>
            <h4>4.1.3: ICT-Enabled Facilities</h4>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>Smart Classrooms, LMS, Labs etc.</small>
          </div>
          <button className="btn btn-success btn-sm fw-semibold" onClick={() => window.open(getExcelExportUrl('4_1_3'), '_blank')}>
            <i className="bi bi-file-earmark-excel me-1"></i> Export Excel
          </button>
        </header>

        <div className="container-fluid p-4 fade-in">

          {/* Alert */}
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
                <i className="bi bi-plus-circle me-2 text-danger"></i>Add ICT Facility Record
              </h6>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label-custom">Room Number / Name</label>
                  <input
                    type="text" className="form-control"
                    placeholder="e.g. Class Room No. 501"
                    value={form.room_number}
                    onChange={e => setForm({ ...form, room_number: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Type of ICT Facility</label>
                  <input
                    type="text" className="form-control"
                    placeholder="e.g. LCD Projector, LAN, Smart Board"
                    value={form.ict_facility_type}
                    onChange={e => setForm({ ...form, ict_facility_type: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label-custom">Link to Geo-Tagged Photos / Timetable</label>
                  <input
                    type="url" className="form-control"
                    placeholder="https://drive.google.com/..."
                    value={form.geo_tagged_photo_link}
                    onChange={e => setForm({ ...form, geo_tagged_photo_link: e.target.value })}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3 pt-3 border-top">
                <button className="btn btn-success px-4 fw-bold" onClick={handleSave}>
                  <i className="bi bi-save me-1"></i> Add Room Record
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card border-0 shadow-sm" style={{ borderRadius: 14, overflow: "hidden" }}>
            {loading ? (
              <div className="spinner-overlay p-5"><div className="spinner-border text-danger" role="status"></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Room / Classroom / Seminar Hall</th>
                      <th>Type of ICT Facility</th>
                      <th>Link to Geo-Tagged Photos & Timetable</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center text-muted py-5">
                          No records yet. Add an ICT facility above.
                        </td>
                      </tr>
                    ) : records.map(row => (
                      <tr key={row.id}>
                        <td className="fw-semibold">{row.room_number}</td>
                        <td>
                          <span className="badge" style={{ background: "#e0f2fe", color: "#0369a1", fontWeight: 600, fontSize: "0.78rem", padding: "5px 10px" }}>
                            {row.ict_facility_type}
                          </span>
                        </td>
                        <td>
                          {row.geo_tagged_photo_link
                            ? <a href={row.geo_tagged_photo_link} target="_blank" rel="noreferrer" className="text-decoration-none text-danger small">
                                <i className="bi bi-link-45deg me-1"></i>View Document
                              </a>
                            : <span className="text-muted small">No link provided</span>
                          }
                        </td>
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
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
