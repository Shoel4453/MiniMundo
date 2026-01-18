import { createContext, useState, useEffect } from "react";

// 1. Creamos el contexto
export const CartContext = createContext();

// 2. Creamos el Proveedor
export const CartProvider = ({ children }) => {
  // Inicializamos el estado buscando si ya hay algo guardado en el navegador
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito_cotillon");
    return guardado ? JSON.parse(guardado) : [];
  });

  // Cada vez que el carrito cambie (se agregue o elimine algo), 
  // guardamos la versión actualizada en localStorage
  useEffect(() => {
    localStorage.setItem("carrito_cotillon", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);

    if (existe) {
      alert("Este producto ya está en el carrito");
    } else {
      // Importante: Aseguramos que el precio sea tratado como número 
      // para evitar el error de los ceros extra ($01800)
      const productoLimpio = {
        ...producto,
        precio: Number(producto.precio)
      };
      
      setCarrito([...carrito, productoLimpio]);
      alert("¡Producto agregado!");
    }
  };

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, setCarrito }}>
      {children}
    </CartContext.Provider>
  );
};