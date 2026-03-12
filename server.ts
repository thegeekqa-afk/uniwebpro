import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- DATABASE INITIALIZATION ---
let useMock = false;
let pool: any = null;

// Simple in-memory mock for preview if MySQL is not available
const mockDb: any = {
  carreras: [
    { id: 1, nombre: 'Ingeniería de Sistemas', codigo: 'IS101', facultad: 'Facultad de Ingeniería', descripcion: 'Carrera de software.', duracion_semestres: 10, estado: 'activa' },
    { id: 2, nombre: 'Administración de Empresas', codigo: 'ADM303', facultad: 'Ciencias Económicas', descripcion: 'Gestión empresarial.', duracion_semestres: 10, estado: 'activa' }
  ],
  materias: [
    { id: 1, nombre: 'Cálculo Diferencial', codigo: 'MAT101', creditos: 5, semestre: 1, descripcion: 'Fundamentos.', carrera_id: 1, estado: 'activa', carrera_nombre: 'Ingeniería de Sistemas' }
  ],
  estudiantes: [
    { id: 1, nombres: 'Juan', apellidos: 'Pérez', tipo_documento: 'DNI', numero_documento: '12345678', correo: 'juan@example.com', telefono: '987654321', fecha_nacimiento: '2002-05-15', direccion: 'Calle 1', carrera_id: 1, estado: 'activo', carrera_nombre: 'Ingeniería de Sistemas' }
  ]
};

async function initDb() {
  try {
    // Try MySQL first
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'u785806933_uniweb',
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });
    // Test connection
    await pool.getConnection();
    console.log("Connected to MySQL");
  } catch (error) {
    console.warn("MySQL connection failed, falling back to In-Memory Mock for preview:", error);
    useMock = true;
  }
}

// --- API HELPERS ---
async function query(sql: string, params: any[] = []) {
  if (useMock) {
    const sqlUpper = sql.trim().toUpperCase();
    
    if (sqlUpper.startsWith("SELECT")) {
      if (sqlUpper.includes("FROM CARRERAS")) return [mockDb.carreras];
      if (sqlUpper.includes("FROM MATERIAS")) return [mockDb.materias];
      if (sqlUpper.includes("FROM ESTUDIANTES")) return [mockDb.estudiantes];
      if (sqlUpper.includes("COUNT(*)")) {
        if (sqlUpper.includes("ESTUDIANTES")) return [[{ count: mockDb.estudiantes.length }]];
        if (sqlUpper.includes("CARRERAS")) return [[{ count: mockDb.carreras.length }]];
        if (sqlUpper.includes("MATERIAS")) return [[{ count: mockDb.materias.length }]];
      }
      return [[]];
    }
    
    if (sqlUpper.startsWith("INSERT")) {
      const table = sqlUpper.includes("CARRERAS") ? "carreras" : sqlUpper.includes("MATERIAS") ? "materias" : "estudiantes";
      const newId = mockDb[table].length > 0 ? Math.max(...mockDb[table].map((i: any) => i.id)) + 1 : 1;
      // Note: This is a very simplified mock that doesn't actually parse the params into the object correctly
      // but it's enough to let the UI proceed in preview mode.
      return [{ insertId: newId }];
    }
    
    return [{}];
  } else {
    return await pool.query(sql, params);
  }
}

// --- API ROUTES ---

app.get("/api/carreras", async (req, res) => {
  try {
    const [rows] = await query("SELECT * FROM carreras");
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/carreras", async (req, res) => {
  try {
    const { nombre, codigo, facultad, descripcion, duracion_semestres, estado } = req.body;
    const [result]: any = await query(
      "INSERT INTO carreras (nombre, codigo, facultad, descripcion, duracion_semestres, estado) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, codigo, facultad, descripcion, duracion_semestres, estado]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/carreras/:id", async (req, res) => {
  try {
    const { nombre, codigo, facultad, descripcion, duracion_semestres, estado } = req.body;
    await query(
      "UPDATE carreras SET nombre = ?, codigo = ?, facultad = ?, descripcion = ?, duracion_semestres = ?, estado = ? WHERE id = ?",
      [nombre, codigo, facultad, descripcion, duracion_semestres, estado, req.params.id]
    );
    res.json({ id: req.params.id, ...req.body });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/carreras/:id", async (req, res) => {
  try {
    await query("DELETE FROM carreras WHERE id = ?", [req.params.id]);
    res.json({ message: "Carrera eliminada" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/materias", async (req, res) => {
  try {
    const [rows] = await query(`
      SELECT m.*, c.nombre as carrera_nombre 
      FROM materias m 
      JOIN carreras c ON m.carrera_id = c.id
    `);
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/materias", async (req, res) => {
  try {
    const { nombre, codigo, creditos, semestre, descripcion, carrera_id, estado } = req.body;
    const [result]: any = await query(
      "INSERT INTO materias (nombre, codigo, creditos, semestre, descripcion, carrera_id, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nombre, codigo, creditos, semestre, descripcion, carrera_id, estado]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/materias/:id", async (req, res) => {
  try {
    await query("DELETE FROM materias WHERE id = ?", [req.params.id]);
    res.json({ message: "Materia eliminada" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/estudiantes", async (req, res) => {
  try {
    const [rows] = await query(`
      SELECT e.*, c.nombre as carrera_nombre 
      FROM estudiantes e 
      JOIN carreras c ON e.carrera_id = c.id
    `);
    res.json(rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/estudiantes", async (req, res) => {
  try {
    const { nombres, apellidos, tipo_documento, numero_documento, correo, telefono, fecha_nacimiento, direccion, carrera_id, estado } = req.body;
    const [result]: any = await query(
      "INSERT INTO estudiantes (nombres, apellidos, tipo_documento, numero_documento, correo, telefono, fecha_nacimiento, direccion, carrera_id, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nombres, apellidos, tipo_documento, numero_documento, correo, telefono, fecha_nacimiento, direccion, carrera_id, estado]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/estudiantes/:id", async (req, res) => {
  try {
    await query("DELETE FROM estudiantes WHERE id = ?", [req.params.id]);
    res.json({ message: "Estudiante eliminado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/stats", async (req, res) => {
  try {
    const [est]: any = await query("SELECT COUNT(*) as count FROM estudiantes");
    const [car]: any = await query("SELECT COUNT(*) as count FROM carreras");
    const [mat]: any = await query("SELECT COUNT(*) as count FROM materias");
    res.json({ 
      totalEstudiantes: est[0].count, 
      totalCarreras: car[0].count, 
      totalMaterias: mat[0].count 
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- VITE MIDDLEWARE ---

async function startServer() {
  await initDb();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
