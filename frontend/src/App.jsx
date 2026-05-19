import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home             from "./pages/Home";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Dashboard        from "./pages/Dashboard";

// Helper to extract criterion code from pathname
const getCriterionFromPath = (pathname) => {
  const parts = pathname.split('/');
  const last = parts[parts.length - 1];
  if (/^\d+(-\d+)*$/.test(last)) {
    return last.replace(/-/g, '_');
  }
  return null;
};

// Criteria 1
import Criterion1_1   from "./pages/criteria1/Criterion1_1";
import Criterion1_1_3 from "./pages/criteria1/Criterion1_1_3";
import Criterion1_2_1 from "./pages/criteria1/Criterion1_2_1";
import Criterion1_2_2 from "./pages/criteria1/Criterion1_2_2";
import Criterion1_3_2 from "./pages/criteria1/Criterion1_3_2";
import Criterion1_3_3 from "./pages/criteria1/Criterion1_3_3";

// Criteria 2
import Criterion2_1   from "./pages/criteria2/Criterion2_1";
import Criterion2_1_1 from "./pages/criteria2/Criterion2_1_1";
import Criterion2_2   from "./pages/criteria2/Criterion2_2";
import Criterion2_1_2 from "./pages/criteria2/Criterion2_1_2";
import Criterion2_3   from "./pages/criteria2/Criterion2_3";
import Criterion2_3_3 from "./pages/criteria2/Criterion2_3_3";
import Criterion2_4_1 from "./pages/criteria2/Criterion2_4_1";
import Criterion2_4_2 from "./pages/criteria2/Criterion2_4_2";
import Criterion2_6_3 from "./pages/criteria2/Criterion2_6_3";

// Criteria 3
import Criterion3_1     from "./pages/criteria3/Criterion3_1";
import Criterion3_2     from "./pages/criteria3/Criterion3_2";
import Criterion3_1_1_2 from "./pages/criteria3/Criterion3_1_1_2";
import Criterion3_1_3   from "./pages/criteria3/Criterion3_1_3";
import Criterion3_2_1   from "./pages/criteria3/Criterion3_2_1";
import Criterion3_2_2   from "./pages/criteria3/Criterion3_2_2";
import Criterion3_3_2   from "./pages/criteria3/Criterion3_3_2";
import Criterion3_3_3_4 from "./pages/criteria3/Criterion3_3_3_4";
import Criterion3_4_1   from "./pages/criteria3/Criterion3_4_1";
import Criterion3_4_2   from "./pages/criteria3/Criterion3_4_2";

// Criteria 4
import Criterion4_1_3 from "./pages/criteria4/Criterion4_1_3";
import Criterion4_1_4 from "./pages/criteria4/Criterion4_1_4";
import Criterion4_2_2 from "./pages/criteria4/Criterion4_2_2";

// Criteria 5
import Criterion5_1_1 from "./pages/criteria5/Criterion5_1_1";
import Criterion5_1_3 from "./pages/criteria5/Criterion5_1_3";
import Criterion5_1_4 from "./pages/criteria5/Criterion5_1_4";
import Criterion5_2_1 from "./pages/criteria5/Criterion5_2_1";
import Criterion5_2_2 from "./pages/criteria5/Criterion5_2_2";
import Criterion5_2_3 from "./pages/criteria5/Criterion5_2_3";
import Criterion5_3_1 from "./pages/criteria5/Criterion5_3_1";
import Criterion5_3_3 from "./pages/criteria5/Criterion5_3_3";

// Criteria 6
import Criterion6_2_3 from "./pages/criteria6/Criterion6_2_3";
import Criterion6_3_2 from "./pages/criteria6/Criterion6_3_2";
import Criterion6_3_3 from "./pages/criteria6/Criterion6_3_3";
import Criterion6_3_4 from "./pages/criteria6/Criterion6_3_4";
import Criterion6_4_2 from "./pages/criteria6/Criterion6_4_2";
import Criterion6_5_3 from "./pages/criteria6/Criterion6_5_3";

export default function App() {
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const btn = e.target.closest('button');
      if (btn && btn.textContent.toLowerCase().includes('export excel')) {
        const criterion = getCriterionFromPath(window.location.pathname);
        if (criterion) {
          e.preventDefault();
          e.stopPropagation();
          const BASE_URL = "http://localhost:5000/api";
          window.open(`${BASE_URL}/export-excel/${criterion}`, "_blank");
        }
      }
    };
    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
        <Route path="/dashboard"   element={<Dashboard />} />

        {/* Criteria 1 */}
        <Route path="/criteria1/1-1"   element={<Criterion1_1 />} />
        <Route path="/criteria1/1-1-3" element={<Criterion1_1_3 />} />
        <Route path="/criteria1/1-2-1" element={<Criterion1_2_1 />} />
        <Route path="/criteria1/1-2-2" element={<Criterion1_2_2 />} />
        <Route path="/criteria1/1-3-2" element={<Criterion1_3_2 />} />
        <Route path="/criteria1/1-3-3" element={<Criterion1_3_3 />} />

        {/* Criteria 2 */}
        <Route path="/criteria2/2-1"   element={<Criterion2_1 />} />
        <Route path="/criteria2/2-1-1" element={<Criterion2_1_1 />} />
        <Route path="/criteria2/2-2"   element={<Criterion2_2 />} />
        <Route path="/criteria2/2-1-2" element={<Criterion2_1_2 />} />
        <Route path="/criteria2/2-3"   element={<Criterion2_3 />} />
        <Route path="/criteria2/2-3-3" element={<Criterion2_3_3 />} />
        <Route path="/criteria2/2-4-1" element={<Criterion2_4_1 />} />
        <Route path="/criteria2/2-4-2" element={<Criterion2_4_2 />} />
        <Route path="/criteria2/2-6-3" element={<Criterion2_6_3 />} />

        {/* Criteria 3 */}
        <Route path="/criteria3/3-1"     element={<Criterion3_1 />} />
        <Route path="/criteria3/3-2"     element={<Criterion3_2 />} />
        <Route path="/criteria3/3-1-1-2" element={<Criterion3_1_1_2 />} />
        <Route path="/criteria3/3-1-3"   element={<Criterion3_1_3 />} />
        <Route path="/criteria3/3-2-1"   element={<Criterion3_2_1 />} />
        <Route path="/criteria3/3-2-2"   element={<Criterion3_2_2 />} />
        <Route path="/criteria3/3-3-2"   element={<Criterion3_3_2 />} />
        <Route path="/criteria3/3-3-3-4" element={<Criterion3_3_3_4 />} />
        <Route path="/criteria3/3-4-1"   element={<Criterion3_4_1 />} />
        <Route path="/criteria3/3-4-2"   element={<Criterion3_4_2 />} />

        {/* Criteria 4 */}
        <Route path="/criteria4/4-1-3" element={<Criterion4_1_3 />} />
        <Route path="/criteria4/4-1-4" element={<Criterion4_1_4 />} />
        <Route path="/criteria4/4-2-2" element={<Criterion4_2_2 />} />

        {/* Criteria 5 */}
        <Route path="/criteria5/5-1-1" element={<Criterion5_1_1 />} />
        <Route path="/criteria5/5-1-3" element={<Criterion5_1_3 />} />
        <Route path="/criteria5/5-1-4" element={<Criterion5_1_4 />} />
        <Route path="/criteria5/5-2-1" element={<Criterion5_2_1 />} />
        <Route path="/criteria5/5-2-2" element={<Criterion5_2_2 />} />
        <Route path="/criteria5/5-2-3" element={<Criterion5_2_3 />} />
        <Route path="/criteria5/5-3-1" element={<Criterion5_3_1 />} />
        <Route path="/criteria5/5-3-3" element={<Criterion5_3_3 />} />

        {/* Criteria 6 */}
        <Route path="/criteria6/6-2-3" element={<Criterion6_2_3 />} />
        <Route path="/criteria6/6-3-2" element={<Criterion6_3_2 />} />
        <Route path="/criteria6/6-3-3" element={<Criterion6_3_3 />} />
        <Route path="/criteria6/6-3-4" element={<Criterion6_3_4 />} />
        <Route path="/criteria6/6-4-2" element={<Criterion6_4_2 />} />
        <Route path="/criteria6/6-5-3" element={<Criterion6_5_3 />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
