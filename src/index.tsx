import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

const BaseHtml = ({ children } : elements.Children) => `
	<html>
		<head>
			<title>BETH Example</title>
			<script src="https://unpkg.com/htmx.org@1.9.5" integrity="sha384-xcuj3WpfgjlKF+FXhSQFQ0ZNr39ln+hwjN3npfM9VBnUskLolQAcN80McRIVOPuO" crossorigin="anonymous"></script>
			<script src="https://cdn.tailwindcss.com"></script>
		</head>
		<body >
			<div class="flex flex-col items-center pt-6 w-[360px] mx-auto">
				${children}
			</div>
		</body>
	</html>
`;

const TodoForm = () => `
<form hx-post="/add_todo" hx-target="#todo_list" hx-swap="beforeend" hx-on::after-request=" if(event.detail.successful) this.reset()">
	<input type="text" name="todo" class="bg-slate-200 py-0.5 px-2" />
	<button type="submit" class="rounded hover:rounded-lg border-zinc-300 border-2 py-0.5 px-1">Submit</button>
</form>
<div class="w-full px-8 pb-4 flex flex-col items-start">
	<h3 class="font-bold text-lg">Todo List</h3>
	<ol id="todo_list"></ol>
</div>
<div class="w-full px-8 pb-4 flex flex-col items-start">
	<h3 class="font-bold text-lg">Complete List</h3>
	<ol id="complete_list"></ol>
</div>
`;

const app = new Elysia().use(html())
.get("/", () => (
	 <BaseHtml>
	 	<TodoForm />
	 </BaseHtml>
))
.post("/add_todo", ({ body }) => {
	console.log("Received request");
	console.log(body);
	return (
	<li>
		<input type="checkbox" hx-post="/completed" hx-trigger="click" hx-target="closest li" hx-swap="delete" hx-vals={`{ "value": "${body.todo}" }`} class="" />
		<span>{body.todo}</span>
	</li>
	)
}, {
	body: t.Object({
		todo: t.String(),
	}),
})
.post("/completed", ({ body}) => {
	console.log(body);

	return (
	<div id="complete_list" hx-swap-oob="beforeend">
		<li>
			<input type="checkbox" hx-post="/rework" hx-trigger="click" hx-target="closest li" hx-swap="delete" hx-vals={`{ "value": "${body.value}" }`} />
			<span>{body.value}</span>
		</li>
	</div>
	)
}, {
	body: t.Object({
		value: t.String()
	})
})
.post("/rework", ({ body}) => {
	console.log(body);

	return (
	<div id="todo_list" hx-swap-oob="beforeend">
		<li>
			<input type="checkbox" hx-post="/completed" hx-trigger="click" hx-target="closest li" hx-swap="delete" hx-vals={`{ "value": "${body.value}" }`} />
			<span>{body.value}</span>
		</li>
	</div>
	)
}, {
	body: t.Object({
		value: t.String()
	})
})
.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


