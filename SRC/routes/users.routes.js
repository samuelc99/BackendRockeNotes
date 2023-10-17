const { Router } = require("express")

const UsersControllers = require("../controllers/UsersControllers")

const usersRouts = Router()


const usersControllers = new UsersControllers()

usersRouts.post("/", usersControllers.create)
usersRouts.put("/:id", usersControllers.update)
  
  module.exports = usersRouts



  