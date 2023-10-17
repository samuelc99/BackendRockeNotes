// const express = require('express')
// const app = express()

// // request.params é usado para obter parâmetros específicos que fazem parte da rota ou da URL. 
// //Esses parâmetros são extraídos de segmentos de rota definidos na configuração do servidor. 
// //Em geral, esses valores são usados para identificar um recurso específico
// // ou para realizar operações específicas no servidor,
// // dependendo do que foi definido na rota.

// app.get('/:id/:user', (request, response) => {
//   const { id, user } = request.params

//   response.send(`
//   Mensagem ID: ${id}.
//   Para o usuário: ${user}.`)
// })

// //request.query é usado para obter os parâmetros passados na URL 
// //como parte da string de consulta (query string). 
// //Esses parâmetros são geralmente usados para filtrar, classificar ou paginar resultados. 
// //Eles são adicionados à URL após um ponto de interrogação (?) 
// //e são compostos por pares chave-valor separados por &.

// // ------- exemplo da url: localhost:3333/users?page=5&limit=10 -------- //

// app.get("/users", (request, response) => {
// const { page, limit } = request.query

// response.send(`Página: ${page}. Mostrar: ${limit}`)
// })

// const PORT = 3333
// app.listen(PORT, () => console.log(`server is running on port ${PORT}`))



require("express-async-errors")
const migrationsRun = require("./database/sqlite/migrations")

const AppError = require("./utils/AppError")
const express = require("express")
const routes = require("./routes")

migrationsRun()
const app = express()
app.use(express.json())

app.use(routes)
app.use((error, request, response, next) => {

  if (error instanceof AppError) {
    return response.status(error.statusCode).json(
      {
        status: "error",
        message: error.message
      }
    )
  }

  console.error(error)


  return response.status(500).json({
    status: "Error",
    message: "Internal Server Error"
  })

})
app.get('/message/:id', (request, response) => {
  const { id } = request.params
  response.send(`Param ${id}`)

})


const PORT = 3333
app.listen(PORT, () => console.log(`The server is running in the ${PORT} port`))