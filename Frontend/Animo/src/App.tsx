import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

function App() {

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
        stacked
      />
    </div>
  )
}

export default App
