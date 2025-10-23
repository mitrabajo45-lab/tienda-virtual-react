import { useProducts } from "../context/ProductsContext";

export default function Home() {
  const { productos, cargando } = useProducts();

  if (cargando) return <p className="p-6">Cargando productos...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🏠 Bienvenido a la Tienda</h2>
      <p className="text-gray-600 mb-4">Estos son algunos productos:</p>

      <ul className="list-disc ml-6 space-y-1">
        {productos.slice(0, 5).map((p) => (
          <li key={p.id}>
            {p.nombre} — ${p.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}
