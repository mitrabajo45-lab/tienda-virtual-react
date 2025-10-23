import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const ref = collection(db, "productos");
    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProductos(data);
      setCargando(false);
    });

    return () => unsub(); // limpiar listener al desmontar
  }, []);

  return (
    <ProductsContext.Provider value={{ productos, cargando }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
