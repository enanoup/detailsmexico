export interface ImportlineResponse {
  type: string;
  response: ImportlineProduct[];
}

export interface ImportlineProduct {
  id: string;
  clave: string;
  descripcion: string;
  precio: string;
  categ: string;
  externo: string;
  id_ext: string;
  urls: string;
  imagenes_colores: Imagenescolore[];
  otras_imagenes: Imagenescolore[];
  inventario: Inventario[];
}

export interface Inventario {
  clave: string;
  tipo: string;
  almacen1: string;
  almacen2: string;
  almacen3: string;
  total: string;
  trancito: string;
  produccion: string;
  apartado: string;
  id_cat: string;
  externo: string;
}

export interface Imagenescolore {
  imagen_chica: string;
  imagen_mediana: string;
}
