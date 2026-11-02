import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Déjala vacía si en XAMPP no tienes contraseña
  database: 'saborexpress_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;