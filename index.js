const express = require("express");

const server = express();

server.use(express.json());

let requestsOnApi = 0;
const projects = [
  { id: 1, title: "Projeto 1", tasks: [] },
  { id: 2, title: "Projeto 2", tasks: [] },
  { id: 3, title: "Projeto 3", tasks: [] }
];

//Middleware Global
server.use((req, res, next) => {
  console.log(
    requestsOnApi == 0
      ? `Foi feito ${++requestsOnApi} requisição até o momento.`
      : `Foram feitas ${++requestsOnApi} requisições até o momento.`
  );
  return next();
});

//Middleware Local
function checkIfProjectIdExists(req, res, next) {
  const projeto = projects.find(project => project.id == req.params.id);

  if (!projeto) {
    return res.json({
      message: `O projeto com ID [${req.params.id}] não existe!`
    });
  }

  req.projeto_valido = projects.indexOf(
    projects.find(project => project.id == req.params.id)
  );

  return next();
}

//ROTAS
server.get("/projects", (req, res) => {
  res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({ id: id, title: title, tasks: [] });

  return res.json(projects);
});

server.put("/projects/:id", checkIfProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(project => project.id == id).title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkIfProjectIdExists, (req, res) => {
  /*DIEGO
  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);
  */

  projects.splice(req.projeto_valido, 1);

  res.json(projects);
});

server.post("/projects/:id/tasks", checkIfProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(project => project.id == id).tasks.push(title);

  res.json(projects);
});

server.listen(3000);
