import { RouterProvider } from "react-router-dom"
import useRouter from "./hooks/useRouter"
import { AuthProvider } from "./contexts/AuthContext";

function App() {

  const router = useRouter();

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
