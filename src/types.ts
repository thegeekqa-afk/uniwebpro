export interface Carrera {
  id?: number;
  nombre: string;
  codigo: string;
  facultad: string;
  descripcion: string;
  duracion_semestres: number;
  estado: 'activa' | 'inactiva';
}

export interface Materia {
  id?: number;
  nombre: string;
  codigo: string;
  creditos: number;
  semestre: number;
  descripcion: string;
  carrera_id: number;
  estado: 'activa' | 'inactiva';
  carrera_nombre?: string;
}

export interface Estudiante {
  id?: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  correo: string;
  telefono: string;
  fecha_nacimiento: string;
  direccion: string;
  carrera_id: number;
  estado: 'activo' | 'inactivo';
  carrera_nombre?: string;
}

export interface DashboardStats {
  totalEstudiantes: number;
  totalCarreras: number;
  totalMaterias: number;
}
