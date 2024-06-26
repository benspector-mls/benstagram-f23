const knex = require('../knex');

class Like {
  static async create(user_id, post_id) {
    try {
      const query = `
        INSERT INTO likes (user_id, post_id)
        VALUES (?, ?) RETURNING *
      `;
      // this will throw an error if a duplicate pair is added
      const { rows } = await knex.raw(query, [user_id, post_id]);

      await knex.raw(`
        UPDATE posts 
        SET likes = likes + 1
        WHERE id = ?
      `, [post_id]);
      return rows[0]

    } catch (error) {
      return null;
    }
  }

  static async findLikesOfPost(post_id) {
    const query = `
    SELECT *
      FROM likes
      WHERE post_id = ?
    `
    const { rows } = await knex.raw(query, [post_id]);
    return rows;
  }

  static async findLikesByUser(user_id) {
    const query = `
    SELECT *
      FROM likes
      WHERE user_id = ?
    `
    const { rows } = await knex.raw(query, [user_id]);
    return rows;
  }

  static async countLikesOfPost(post_id) {
    const query = `
    SELECT COUNT(*)
      FROM likes
      WHERE post_id = ?
    `
    const { rows } = await knex.raw(query, [post_id]);
    return rows[0].count;
  }

  static async unLike(user_id, post_id) {
    const query = `
      DELETE FROM likes
      WHERE user_id=?
        AND post_id=?
    `;
    await knex.raw(query, [user_id, post_id]);

    await knex.raw(`
      UPDATE posts 
      SET likes = likes - 1
      WHERE id = ?
      AND likes > 0
    `, [post_id]);
    return true;
  }

  static async deleteAllLikesOfPost(post_id) {
    const query = `
      DELETE FROM likes
      WHERE post_id=?
    `;

    await knex.raw(`
      UPDATE posts 
      SET likes = 0
      WHERE id = ?
    `, [post_id]);
    await knex.raw(query, post_id);
    return true;
  }
}

const test = async () => {
  await Like.create(6, 1)
  await Like.create(1, 1)
  await Like.create(2, 1)

  console.log(await Like.findLikesOfPost(1));
  console.log(await Like.countLikesOfPost(1));
  console.log(await Like.unLike(1, 1));
  console.log(await Like.findLikesOfPost(1));
  console.log(await Like.deleteAllLikesOfPost(1));
  console.log(await Like.findLikesOfPost(1));

  knex.destroy();
}

// test();


module.exports = Like;
