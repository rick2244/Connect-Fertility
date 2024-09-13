CREATE TABLE todo_user_table (
    todo_id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    password_hash VARCHAR(255),
    email VARCHAR(255),
    verified BOOLEAN DEFAULT TRUE,
    change_password BOOLEAN DEFAULT FALSE,
    form_filled BOOLEAN DEFAULT FALSE,
    name_of_user VARCHAR(255),
    classification VARCHAR(255),
    sex VARCHAR(255),
    day_dob INTEGER,
    month_dob INTEGER,
    year_dob INTEGER,
    age INTEGER,
    latitude DECIMAL(10, 6),
    longitude DECIMAL(10, 6),
    city VARCHAR(255),
    region VARCHAR(255),
    race VARCHAR(255),
    ethnicty VARCHAR(255),
    blood VARCHAR(255),
    hair VARCHAR(255),
    eye VARCHAR(255),
    education VARCHAR(255),
    occupation VARCHAR(255),
    marital_status VARCHAR(255),
    height_ft INTEGER,
    height_inches INTEGER,
    weight_lbs INTEGER,
    hobbies VARCHAR(255),
    bio VARCHAR(255),
    preference VARCHAR(255)
)

CREATE TABLE UserVerification (
    id INTEGER NOT NULL,
    username VARCHAR(255) NOT NULL,
    uniqueString VARCHAR(255) NOT NULL,
    createdAt BIGINT NOT NULL,
    expiresAt BIGINT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE todo_lists_table(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES todo_user_table(todo_id),
    title VARCHAR(255)
)
CREATE TABLE todo_items_table(
    id SERIAL PRIMARY KEY,
    todo_list_idtwo INTEGER REFERENCES todo_lists_table(todo_list_id),
    content VARCHAR(255),
    due_date DATE,
    is_completed BOOLEAN
)