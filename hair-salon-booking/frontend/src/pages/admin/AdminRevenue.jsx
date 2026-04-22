import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminRevenue() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/revenue", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error("Revenue error:", err);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Revenue</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
