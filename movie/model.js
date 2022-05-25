import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "127.0.0.1",
  //port: 3307,
  user: "vmadmin",
  password: "sml12345",
  database: "movie-db",
});

await connection.connect();

export async function getAll(userid) {
  const query = "SELECT * FROM Movies WHERE user = ? OR public = 1";
  const [data] = await connection.query(query, [userid]);

  return data;
}

async function insert(movie, userid) {
  const query =
    "INSERT INTO Movies (title, year, public, user) VALUES (?, ?, ?, ?)";
  const [result] = await connection.query(query, [
    movie.title,
    movie.year,
    movie.public,
    userid,
  ]);
  return { ...movie, id: result.insertId };
}

async function update(movie, userid) {
  const query =
    "UPDATE Movies SET title = ?, year = ?, public = ?, user = ? WHERE id = ?";
  await connection.query(query, [
    movie.title,
    movie.year,
    movie.public,
    userid,
    movie.id,
  ]);
  return movie;
}

export async function get(id) {
  const query = "SELECT * FROM Movies WHERE id = ?";
  const [data] = await connection.query(query, [id]);

  return data.pop();
}

export async function remove(id, userid) {
  const movie = get(id);
  if (movie.user == userid || movie.public) {
    const query = "DELETE FROM Movies WHERE id = ?";
    await connection.query(query, [id]);
  }
  return;
}

export function save(movie, userid) {
  if (!movie.id) {
    return insert(movie, userid);
  } else {
    return update(movie, userid);
  }
}
