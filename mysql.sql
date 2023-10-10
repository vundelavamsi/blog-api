-- CREATE TABLE users (
--       id INTEGER PRIMARY KEY AUTOINCREMENT,
--       username TEXT NOT NULL,
--       email TEXT NOT NULL
--     )


-- INSERT INTO users (username, email) 
-- VALUES ('user1',"user1@example.com")
-- VALUES ('user2',"user2@example.com")


-- CREATE TABLE blogs (
--       id INTEGER PRIMARY KEY AUTOINCREMENT,
--       title TEXT NOT NULL,
--       content TEXT NOT NULL,
--       userId INTEGER NOT NULL,
--       FOREIGN KEY (userId) REFERENCES users(id)
--     )


-- INSERT INTO blogs (title, content, userId) 
-- VALUES ('Blog 3', 'Sample content for Blog 3', 3)
-- VALUES ('Blog 2', 'Sample content for Blog 2', 2)


-- CREATE TABLE comments (
--       id INTEGER PRIMARY KEY AUTOINCREMENT,
--       text TEXT NOT NULL,
--       userId INTEGER NOT NULL,
--       blogId INTEGER NOT NULL,
--       FOREIGN KEY (userId) REFERENCES users(id),
--       FOREIGN KEY (blogId) REFERENCES blogs(id)
--     )

-- INSERT INTO comments (text, userId, blogId) 
-- VALUES ('Comment1-1', 1, 1)
-- VALUES ('Comment1-2', 2, 1)
-- VALUES ('Comment2-1', 1, 2)
-- VALUES('Comment2-2', 3, 2)
-- VALUES('Comment3-1', 2, 3)
-- VALUES('Comment3-2', 4, 3)
-- VALUES('Comment3-3', 5, 3)
-- VALUES('Comment4-1', 3, 4)
-- VALUES('Comment5-1', 4, 5)

-- select * from comments

-- SELECT MAX(id) FROM blogs;

-- ALTER TABLE blogs AUTO_INCREMENT = 5;


-- SELECT DISTINCT
--     c1.userId AS UserId,
--     c1.blogId AS BlogId,
--     1 AS Level
--   FROM
--     comments c1
--   WHERE
--     c1.blogId IN (
--       SELECT DISTINCT blogId
--       FROM comments
--       WHERE userId = 1
--     )

-- DELETE from blogs where id = 5
