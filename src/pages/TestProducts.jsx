import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export default function TestProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiFetch('/products')
      .then(data => {
        console.log('Productos:', data);
        setProducts(data);
      })
      .catch(err => {
        console.error('Error al obtener productos:', err.message);
      });
  }, []);

  return (
    <div>
      <h2>Productos</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}
