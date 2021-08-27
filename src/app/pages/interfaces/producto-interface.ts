export interface Producto {
  idProducto: number;
  proveedor: string;
  sku: string;
  nombre: string;
  descripcion: string;
  masDescripcion?: string
  hasThumbnails?: boolean;
  hasDescuento?: boolean;
  descuento?: number;
  precioAnterior?: number;
  precioActual: number;
  precioConDescuento?: number;
  rating?: number;
  solicitud?: number;
  nuevoProducto?: boolean;
  masVendido?: boolean;
  created?: string;
  cantidad: number;
  sumaTotal?: number;
  sumaSinDescuento?: number;
  urls?: Url[];
  categorias?: Categoria[];
  subcategorias?: Subcategoria[];
}

export interface Subcategoria {
  idCategoria: number;
  idSubcategoria: number;
  descripcion: string;
}

export interface Categoria {
  idCategoria: number;
  descripcion: string;
}

export interface Url {
  idImg: number;
  idProducto: number;
  url: string;
}

export interface Fotorama {
  img: string;
  thumb: string;
}
