DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users(
    id   SERIAL PRIMARY KEY,
    name    VARCHAR(255) NOT NULL,
    email   VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    verification_code_expires TIMESTAMP
);

CREATE TABLE messages(
    id SERIAL PRIMARY KEY,
    sender_email VARCHAR(255) NOT NULL,
    time_sent TIMESTAMP,
    conversationID INT NOT NULL,
    content TEXT
);
