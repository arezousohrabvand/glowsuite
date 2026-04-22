import { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import Spinner from "./components/ui/Spinner";

export default function App() {
  return (
    <Suspense fallback={<Spinner fullScreen />}>
      <AppRoutes />
    </Suspense>
  );
}
