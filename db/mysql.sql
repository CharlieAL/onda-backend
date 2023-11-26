drop database if exists onda_db;

create database onda_db;

use onda_db;

create table users (
	user_id int auto_increment,
    avatar_url varchar(300) null,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(50) null unique,
    user_handle varchar(50) not null unique,
    phone_number char(10) null,
    birth date null,
    password text null,
    create_at timestamp not null default (now()),
    role ENUM('admin', 'company', 'normal') NOT NULL DEFAULT 'normal',
    PRIMARY KEY(user_id)
);

-- INSERT INTO users(first_name,last_name,email,user_handle,phone_number,birth, avatar_url,role)
-- VALUES 
-- 	('charlie', 'ramirez', 'charlie@email.com', 'charlie', '1234567890', '1990-05-15','https://cdn.dribbble.com/users/1058247/screenshots/4888594/media/8d76ceee57aec2f4889a6aecfbefeb7a.jpg?resize=400x0','admin');
    
CREATE TABLE friends (
    sender_user_id INT NOT NULL,
    reciver_user_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_date TIMESTAMP NULL,
    primary key(sender_user_id,reciver_user_id),
    FOREIGN KEY (sender_user_id) REFERENCES users (user_id),
    FOREIGN KEY (reciver_user_id) REFERENCES users (user_id)
);
-- CREATE TRIGGER reduce_likes_company  AFTER delete ON likes_company     FOR EACH ROW     BEGIN   UPDATE company SET num_likes = num_likes - 1         WHERE company_id = NEW.like_company_id;     END

ALTER TABLE friends 
ADD CONSTRAINT check_friends_id
CHECK (sender_user_id <> reciver_user_id);

-- INSERT INTO friends (sender_user_id, reciver_user_id)
-- VALUES
--     (1, 2),
--     (3, 4),
--     (5, 6),
--     (3, 1),
--     (5, 1),
--     (6, 1),
--     (2, 3);
-- -- lista de solicitudes
-- SELECT sender_user_id, users.avatar_url,users.first_name, users.user_handle, status FROM friends
-- INNER JOIN users ON friends.sender_user_id = users.user_id
-- WHERE friends.sender_user_id = 7 AND friends.status = 'pending';
-- -- lista de amigos
-- SELECT sender_user_id, users.avatar_url,users.first_name, users.user_handle, status FROM friends
-- INNER JOIN users ON friends.sender_user_id = users.user_id
-- WHERE friends.reciver_user_id = 1 AND friends.status = 'accepted';

-- SELECT
--     u.user_id AS friend_user_id,
--     u.first_name AS friend_first_name,
--     u.last_name AS friend_last_name,
--     u.email AS friend_email,
--     u.user_handle AS friend_user_handle,
--     u.avatar_url
-- FROM
--     friends AS f
-- INNER JOIN
--     users AS u
-- ON
--     f.sender_user_id = u.user_id
-- WHERE
--     f.reciver_user_id = 1; -- Reemplaza 1 con el valor deseado de user_id


CREATE TABLE company(
	company_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id int not null unique,
    name_company VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    description VARCHAR(200) NULL,
    timetables VARCHAR(100) NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    image_url_1 VARCHAR(200) NULL,
    image_url_2 VARCHAR(200) NULL,
    image_url_3 VARCHAR(200) NULL,
    image_url_4 VARCHAR(200) NULL,
    location VARCHAR(150) NOT NULL,
    status ENUM('close', 'open') NOT NULL DEFAULT 'close',
    num_comments INT DEFAULT 0,
    num_likes INT DEFAULT 0,
	  num_events INT DEFAULT 0,
    create_at timestamp not null default (now()),
    foreign key (user_id) references users (user_id)
);

-- INSERT INTO company (user_id,name_company, phone_number, description, timetables, email, image_url_1, image_url_2, image_url_3, image_url_4, location, status)
-- VALUES
--     ('1','ABC Corporation', '123-456-7890', 'A leading technology company.', 'Mon-Fri: 9 AM - 6 PM', 'abc@example.com', 'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', '123 Main Street, City', 'open'),
--     ('2','XYZ Enterprises', '987-654-3210', 'Providing quality services since 1995.', 'Mon-Sat: 10 AM - 7 PM', 'xyz@example.com', 'image5.jpg', 'image6.jpg', 'image7.jpg', 'image8.jpg', '456 Elm Street, Town', 'open'),
--     ('3','GreenTech Solutions', '555-123-4567', 'Sustainable technology solutions.', 'Mon-Thu: 8 AM - 5 PM', 'greentech@example.com', 'image9.jpg', 'image10.jpg', NULL, NULL, '789 Oak Avenue, Village', 'close'),
--     ('4','Swift Services', '111-222-3333', 'Swift and efficient services.', 'Mon-Fri: 8:30 AM - 5:30 PM', 'swift@example.com', 'image11.jpg', NULL, NULL, NULL, '101 Pine Road, Suburb', 'open'),
--     ('5','BlueSky Innovations', '777-888-9999', 'Innovating for a better future.', 'Mon-Wed: 9 AM - 6 PM', 'bluesky@example.com', 'image12.jpg', 'image13.jpg', 'image14.jpg', NULL, '222 Maple Lane, City', 'open');


CREATE TABLE events (
	event_id int auto_increment primary key,
    company_id int not null,
    title varchar(50) not null,
    description varchar(255) not null,
    price DECIMAL(10, 2) NOT NULL,
    city varchar(70) not null default 'Nogales',
    timetables varchar(100) not null,
    flayer text null,
    backflayer text null,
    num_people_asist int default 0,
    num_likes int default 0,
    num_comments int default 0,
    create_at timestamp not null default (now()),
    FOREIGN KEY (company_id) REFERENCES company (company_id)
);
-- Insertar eventos ficticios en la tabla "events"
-- INSERT INTO events (company_id, title, description, price, timetables, flayer)
--  VALUES
--    (1, 'Evento 1', 'Descripción del Evento 1', 25.99, '10:00 AM - 2:00 PM','https://d1csarkz8obe9u.cloudfront.net/posterpreviews/dj-music-night-club-video-flyer-design-template-2d9ea7c8a1c439dcfb118d765d9f8190_screen.jpg'),
--    (1, 'Evento 2', 'Descripción del Evento 2', 19.99, '3:00 PM - 5:00 PM','https://i.pinimg.com/736x/f7/a8/cb/f7a8cba0ba1642ce63fe35f8bbe3ba5e.jpg'),
--    (1, 'Evento 3', 'Descripción del Evento 3', 29.99, '1:00 PM - 4:00 PM','https://www.representltd.com/cdn/shop/products/BRANDON-EVENT-FLYER.jpg?v=1679905197'),
--    (1, 'Evento 4', 'Descripción del Evento 4', 14.99, '11:00 AM - 1:00 PM','https://i.pinimg.com/474x/eb/26/02/eb2602ebb4e33c2840852987b1abbd1f.jpg');

-- drop table user_event;

CREATE TABLE user_event (
    user_event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    boletos int default 0,
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (event_id) REFERENCES events (event_id)
);

CREATE TABLE comments(
	comment_id int auto_increment primary key,
    company_id int not null,
    user_id int not null,
    comment varchar(100) not null,
    FOREIGN KEY (company_id) REFERENCES company (company_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE event_comments(
	comment_id int auto_increment primary key,
    event_id int not null,
    user_id int not null,
    comment varchar(100) not null,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- ALTER TABLE event_comments
-- ADD COLUMN create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;




CREATE TABLE likes_company(
	likes_id int auto_increment primary key,
    like_company_id int not null,
    like_user_id int not null,
    FOREIGN KEY (like_company_id) REFERENCES company (company_id),
    FOREIGN KEY (like_user_id) REFERENCES users (user_id),
    CONSTRAINT uc_user_company UNIQUE (like_user_id, like_company_id)
);

CREATE TABLE likes_event(
	likes_id int auto_increment primary key,
    event_id int not null,
    user_id int not null,
    FOREIGN KEY (event_id) REFERENCES events (event_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT ue_user_event UNIQUE (user_id, event_id)
);

CREATE TABLE worker(
	worker_id int auto_increment primary key,
    company_id int not null,
    user_id int not null,
    status ENUM('avtived', 'disabled') NOT NULL DEFAULT 'disabled',
	FOREIGN KEY (company_id) REFERENCES company (company_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);

DELIMITER $$
CREATE TRIGGER increment_likes_company
	AFTER INSERT ON likes_company
    FOR EACH ROW
    BEGIN
		UPDATE company SET num_likes = num_likes + 1
        WHERE company_id = NEW.like_company_id;
    END $$
    
CREATE TRIGGER reduce_likes_company
	AFTER DELETE ON likes_company
    FOR EACH ROW
    BEGIN
		UPDATE company SET num_likes = num_likes - 1
        WHERE company_id = OLD.like_company_id;
    END $$
    
CREATE TRIGGER increment_likes_event
	AFTER INSERT ON likes_event
    FOR EACH ROW
    BEGIN
		UPDATE events SET num_likes = num_likes + 1
        WHERE event_id = NEW.event_id;
    END $$

CREATE TRIGGER reduce_likes_event
	AFTER DELETE ON likes_event
    FOR EACH ROW
    BEGIN
		UPDATE events SET num_likes = num_likes - 1
        WHERE event_id = OLD.event_id;
    END $$
    
CREATE TRIGGER increment_assist_event
	AFTER INSERT ON user_event
    FOR EACH ROW
    BEGIN
		UPDATE events SET num_people_asist = num_people_asist + 1
        WHERE event_id = NEW.event_id;
    END $$

CREATE TRIGGER reduce_assist_event
	AFTER DELETE ON user_event
    FOR EACH ROW
    BEGIN
		UPDATE events SET num_people_asist = num_people_asist - 1
        WHERE event_id = OLD.event_id;
    END $$
    
CREATE TRIGGER increment_comments_company
	AFTER INSERT ON comments
    FOR EACH ROW
    BEGIN
		UPDATE company SET num_comments = num_comments + 1
        WHERE company_id = NEW.company_id;
    END $$

CREATE TRIGGER reduce_comments_company
	AFTER DELETE ON comments
    FOR EACH ROW
    BEGIN
		UPDATE company SET num_comments = num_comments - 1
        WHERE company_id = OLD.company_id;
    END $$
    
CREATE TRIGGER increment_comments_event
	AFTER INSERT ON event_comments
    FOR EACH ROW
    BEGIN
		UPDATE events SET num_comments = num_comments + 1
        WHERE event_id = NEW.event_id;
    END $$

CREATE TRIGGER reduce_comments_event
	AFTER DELETE ON event_comments
    FOR EACH ROW
    BEGIN
		UPDATE events SET num_comments = num_comments - 1
        WHERE event_id = OLD.event_id;
    END $$

CREATE TRIGGER increment_event_company
	AFTER INSERT ON events
    FOR EACH ROW
    BEGIN
		UPDATE company SET num_events = num_events + 1
        WHERE company_id = NEW.company_id;
END $$

CREATE TRIGGER reduce_event_company
	AFTER DELETE ON events
    FOR EACH ROW
    BEGIN
		UPDATE company SET num_events = num_events - 1
        WHERE company_id = OLD.company_id;
END $$
DELIMITER ;


-- INSERT INTO likes_company (like_company_id,like_user_id)
-- VALUES
-- 	(1, 1),
--     (1, 2),
--     (1, 3),
--     (1, 4),
--     (1, 5);


-- UPDATE friends
-- SET status = 'accepted'
-- WHERE reciver_user_id = 123;
    






