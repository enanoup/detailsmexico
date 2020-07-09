export interface InnovationProduct2 {

    id: string;
    can_1: string;
    descripcion: string;
    imagen: string;
    impresion: string;
    inventario: [{ color: string; total: string}];
    nuevo: string;
    precio_0: number;

}


export interface InnovationProduct {
  id: string;
  descripcion: string;
  can_1: string;
  precio_1: number;
  cant_2: string;
  precio_2: number;
  cant_3: string;
  precio_3: number;
  cant_4: string;
  precio_4: number;
  cant_5: string;
  precio_5: number;
  categ: string;
  clave2: string;
  nuevo: string;
  destacado: string;
  impresion: string;
  pagina: string;
  clave3: string;
  externo: string;
  video: string;
  inventario: Inventario[];
  imagen: string;
  precio_0: number;
}

export interface Inventario {
  color: string;
  total: string;
}
