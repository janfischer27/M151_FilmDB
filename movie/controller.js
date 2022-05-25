import { getAll, remove, get, save } from "./model.js";
import { render } from "./view.js";
import { render as form } from "./form.js";

export async function listAction(request, response) {
  const data = await getAll(request.user.id);
  const body = render(data);
  response.send(body);
}

export async function removeAction(request, response) {
  const id = parseInt(request.params.id, 10);
  await remove(id, request.user.id);
  response.redirect(request.baseUrl);
}

export async function formAction(request, response) {
  let movie = { id: "", title: "", year: "", public: 0 };

  if (request.params.id) {
    movie = await get(parseInt(request.params.id, 10));
  }

  console.log(movie);

  const body = form(movie);
  response.send(body);
}

export async function saveAction(request, response) {
  const movie = {
    id: request.body.id,
    title: request.body.title,
    year: request.body.year,
    public: request.body.public ? 1 : 0,
    user: request.user.id,
  };

  await save(movie, request.user.id);
  response.redirect(request.baseUrl);
}
