const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const mysql = require('mysql2');
require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to render home page
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/home', (req, res) => {
    res.render('index');
});

app.get('/home/book-:id', (req, res) => {
    console.log(req.params.id);
    res.render('details');
});

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Adjust this value based on your expected traffic
    queueLimit: 0
});

// Function to handle disconnection and reconnection
function handleDisconnect() {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            setTimeout(handleDisconnect, 2000); // Reconnect after 2 seconds
        } else {
            console.log("Database is connected");
            if (connection) connection.release(); // Release the connection back to the pool
        }
    });

    pool.on('error', (err) => {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Database connection lost. Reconnecting...');
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect(); // Start the initial connection

// Route to get all books
app.get('/books', (req, res) => {
    const sqlquery = 'SELECT * FROM books';
    pool.query(sqlquery, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Query not executed' });
        } else {
            res.status(200).json(result);
        }
    });
});

// Route to get a book by id
app.get('/books/:id', (req, res) => {
    const sqlquery = 'SELECT * FROM books WHERE id = ?';
    pool.query(sqlquery, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (result.length === 0) {
            res.status(404).send("Book with specified ID is not found");
        } else {
            res.status(200).json(result);
        }
    });
});

// Route to add a new book
app.post('/books', (req, res) => {
    const { title, author, genre, publication_year, language, price, isbn, publisher, rating, url } = req.body;
    const sqlquery = 'INSERT INTO books (title, author, genre, publication_year, language, price, isbn, publisher, rating, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [title, author, genre, publication_year, language, price, isbn, publisher, rating, url];
    pool.query(sqlquery, values, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).send({ status: true });
        }
    });
});

// Route to update a book by id
app.put('/books/:id', (req, res) => {
    console.log(req.body);
    const { title, author, genre, publication_year, language, price, isbn, publisher, rating, url } = req.body;
    const sqlquery = 'UPDATE books SET title = ?, author = ?, genre = ?, publication_year = ?, language = ?, price = ?, isbn = ?, publisher = ?, rating = ?, url = ? WHERE id = ?';
    const values = [title, author, genre, publication_year, language, price, isbn, publisher, rating, url, req.params.id];
    pool.query(sqlquery, values, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        } else if (result.affectedRows === 0) {
            console.log("No book found with the specified ID");
            res.status(404).json({ status: 'Book with specified ID is not available' });
        } else {
            console.log("Book updated successfully");
            res.status(200).json({ status: true });
        }
    });
});

// Route to delete a book by id
app.delete('/books/:id', (req, res) => {
    const sqlquery = 'DELETE FROM books WHERE id = ?';
    pool.query(sqlquery, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json({ status: err.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ status: 'The book you are trying to delete is not found' });
        } else {
            res.status(200).json({ status: true });
        }
    });
});

// Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running");
});
