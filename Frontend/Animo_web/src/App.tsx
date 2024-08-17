import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {QueryClient, QueryClientProvider} from "react-query";
import AppRoutes from "./routes/AppRoutes.tsx";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
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
      <AppRoutes />
    </QueryClientProvider>
  )
}

export default App;
