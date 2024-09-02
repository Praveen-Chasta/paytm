import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { Toaster } from 'react-hot-toast';
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import { userFriendsState } from './state/atom/atom'



function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Toaster position='top-center' toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
