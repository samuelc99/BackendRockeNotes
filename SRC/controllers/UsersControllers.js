const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

const sqliteConnection = require("../database/sqlite")
class UserControllers {
  async create(request, response) {
    const { name, email, password } = request.body;
    const database = await sqliteConnection()
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
    const hashedPassword = await hash(password, 8)

    if (checkUserExists) {
      throw new AppError(`The email ${email} is already in use.`)
    }
    await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?) ', [name, email, hashedPassword])
    return response.status(201).json({})
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;
    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

    if (!user) {
      throw new AppError("User not found!")
    }
    const userWithUpdatedMail = await database.get("SELECT  * FROM users WHERE email = (?)", [email])

    if (userWithUpdatedMail && userWithUpdatedMail.id !== user.id) {
      throw new AppError(`The email ${userWithUpdatedMail.mail} is already in use.`)
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      console.log(user.password);
      throw new AppError('The old password is required to update the password!')
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError(`The old password  didn't match with values on database----`)
      }
      user.password = await hash(password, 8)
    }


    await database.run(
      `UPDATE users SET 
        name = ?,  
        email = ?, 
        password = ?,
        updated_at = DATETIME("now", "localtime") 
        WHERE id = ?`, [user.name, user.email, user.password, user.id]
    );
    return response.status(201).json({ message: "Updated" })
  }

}

module.exports = UserControllers