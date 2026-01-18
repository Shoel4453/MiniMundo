import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito_cotillon");
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito_cotillon", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidad) => {
    setCarrito((currItems) => {
      const existe = currItems.find((item) => item.id === producto.id);

      if (existe) {
        return currItems.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      } else {
        return [...currItems, { ...producto, cantidad, precio: Number(producto.precio) }];
      }
    });
    alert(`¡Agregado al carrito: ${cantidad} unidad(es)!`);
  };

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, setCarrito }}>
      {children}
    </CartContext.Provider>
  );
};