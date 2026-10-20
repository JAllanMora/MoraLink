// Convierte los productos de una sección del JSON del cliente en filas de
// products. Un producto con "variants" se vuelve una fila por presentación:
//
//   { "name": "Cuernitos Naturales", "variants": [
//       { "name": "4 en bolsa", "price": 70 },
//       { "name": "4 en caja", "price": 80 } ] }
//
// Reglas por producto o presentación: "min" y "max" piezas por pedido, y
// "coming_soon": true para mostrarlo como "Próximamente" sin precio ni compra.
export function productRows(section) {
  return (section.products ?? []).flatMap((product) => {
    const { variants, min, max, ...base } = product;
    const row = (fields, extra) => ({
      description: null,
      price: null,
      image_url: null,
      group_name: null,
      variant: null,
      coming_soon: false,
      ...fields,
      min_quantity: extra.min ?? min ?? 1,
      max_quantity: extra.max ?? max ?? 99,
    });
    if (!variants?.length) return [row(base, {})];
    return variants.map(({ name, min, max, ...variant }) =>
      row({ ...base, ...variant, name: `${base.name} · ${name}`, group_name: base.name, variant: name }, { min, max }),
    );
  });
}
