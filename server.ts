import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import mysql from "mysql2/promise";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- DATABASE INITIALIZATION ---
let useSqlite = false;
let pool: any = null;
let sqliteDb: any = null;

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
    console.warn("MySQL connection failed, falling back to SQLite for preview:", error);
    useSqlite = true;
    sqliteDb = new Database("uniweb.db");
    
    // Create tables in SQLite
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS carreras (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        codigo TEXT NOT NULL UNIQUE,
        facultad TEXT NOT NULL,
        descripcion TEXT,
        duracion_semestres INTEGER NOT NULL,
        estado TEXT DEFAULT 'activa'
      );
      CREATE TABLE IF NOT EXISTS materias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        codigo TEXT NOT NULL UNIQUE,
        creditos INTEGER NOT NULL,
        semestre INTEGER NOT NULL,
        descripcion TEXT,
        carrera_id INTEGER NOT NULL,
        estado TEXT DEFAULT 'activa',
        FOREIGN KEY (carrera_id) REFERENCES carreras(id)
      );
      CREATE TABLE IF NOT EXISTS estudiantes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombres TEXT NOT NULL,
        apellidos TEXT NOT NULL,
        tipo_documento TEXT NOT NULL,
        numero_documento TEXT NOT NULL UNIQUE,
        correo TEXT NOT NULL,
        telefono TEXT,
        fecha_nacimiento TEXT,
        direccion TEXT,
        carrera_id INTEGER NOT NULL,
        estado TEXT DEFAULT 'activo',
        FOREIGN KEY (carrera_id) REFERENCES carreras(id)
      );
    `);

    // Seed data if empty
    const count = sqliteDb.prepare("SELECT COUNT(*) as count FROM carreras").get().count;
    if (count === 0) {
      sqliteDb.prepare("INSERT INTO carreras (nombre, codigo, facultad, descripcion, duracion_semestres) VALUES (?, ?, ?, ?, ?)").run(
        'Ingeniería de Sistemas', 'IS101', 'Facultad de Ingeniería', 'Carrera de software.', 10
      );
      sqliteDb.prepare("INSERT INTO carreras (nombre, codigo, facultad, descripcion, duracion_semestres) VALUES (?, ?, ?, ?, ?)").run(
        'Administración de Empresas', 'ADM303', 'Ciencias Económicas', 'Gestión empresarial.', 10
      );
    }
  }
}

// --- API HELPERS ---
async function query(sql: string, params: any[] = []) {
  if (useSqlite) {
    const stmt = sqliteDb.prepare(sql.replace(/\?/g, '?'));
    if (sql.trim().toUpperCase().startsWith("SELECT")) {
      return [stmt.all(...params)];
    } else {
      const result = stmt.run(...params);
      return [{ insertId: result.lastInsertRowid }];
    }
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
