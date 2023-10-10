const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "blog.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/users/", async (request, response) => {
  const getUsersQuery = `
      SELECT
        *
      FROM
        users
      ORDER BY
        id;`;
  const usersArray = await db.all(getUsersQuery);
  response.send(usersArray);
});

app.post("/users/", async (request, response) => {
  const userDetails = request.body;
  console.log(userDetails);
  const { username, email } = userDetails;
  const addUserQuery = `
    INSERT INTO users (username, email)
      VALUES
        (
          '${username}',
          '${email}'
        );`;

  const dbResponse = await db.run(addUserQuery);
  const userId = dbResponse.lastID;
  response.send({ userId: userId });
});

app.post("/blogs/", async (request, response) => {
  const blogDetails = request.body;
  console.log(blogDetails);
  const { title, content, userId } = blogDetails;
  const addBlogQuery = `
    INSERT INTO blogs (title, content, userId)
      VALUES
        (
          '${title}',
          '${content}',
          ${userId}
        );`;

  const dbResponse = await db.run(addBlogQuery);
  const blogId = dbResponse.lastID;
  response.send({ blogId: blogId });
});

app.post("/comments/", async (request, response) => {
  const commentDetails = request.body;
  console.log(commentDetails);
  const { text, userId, blogId } = commentDetails;
  const addCommentQuery = `
    INSERT INTO comments (text, userId, blogId)
      VALUES
        (
          '${text}',
          '${userId}',
          ${blogId}
        );`;

  const dbResponse = await db.run(addCommentQuery);
  const commentId = dbResponse.lastID;
  response.send({ commentId: commentId });
});

function getFriends(userId, levelNo) {
  return new Promise((resolve, reject) => {
    if (levelNo == 1) {
      // Get all users who have commented on the same blog as the given user.
      db.all(`SELECT DISTINCT u.id FROM users u JOIN comments c ON u.id = c.user_id WHERE c.blog_id IN (SELECT blog_id FROM comments WHERE user_id = ${userId}) AND u.id != ${userId}`, [], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows.map(row => row.id));
        }
      });
    } else {
      // Get all friends at the previous level.
      getFriends(userId, levelNo - 1).then(previousFriends => {
        // Get all users who have commented on blogs where any of the previous friends have commented.
        db.all(`SELECT DISTINCT u.id FROM users u JOIN comments c ON u.id = c.user_id WHERE c.id IN (SELECT blog_id FROM comments WHERE user_id IN (${previousFriends.join(',')})) AND u.id != ${userId} AND u.id NOT IN (${previousFriends.join(',')})`, [], (err, rows) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            resolve(rows.map(row => row.id));
          }
        });
      }).catch(err => reject(err));
    }
  });
}

app.get("/users/:userId/level/:levelNo", async (request, response) => {
  const { userId, levelNo } = request.params;
  try {
    const friends = await getFriends(userId, levelNo);
    res.json(friends);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Internal server error');
  }
});
