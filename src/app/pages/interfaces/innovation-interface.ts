export interface InnovationProduct {

  idProducto: number;
  sku: string;
  nombre: string;
  descripcion: string;
  metaDescripcion: string;
  imagenPrincipal: string;
  idCategoria: number;
  categoria: string;
  material: string;
  images: string[];
  areaImpresion: string;
  medidas: string;
  pesoProducto: string;
  precio: number;
  existencias: number;
}

export interface InnovationImages {
  url: string;
}

export interface InnovationExistencias {
  idProducto: number;
  sku: string;
  existencias: number;
}