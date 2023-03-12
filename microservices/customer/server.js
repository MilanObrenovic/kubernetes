const express		= require("express");
const actuator	= require("express-actuator");
const app				= express();
const cors			= require("cors");
const axios			= require("axios");

// Envs
const PORT = process.env.PORT || 8080;
const KILL_IN_SECONDS = process.env.KILL_IN_SECONDS;
const ORDER_SERVICE = process.env.ORDER_SERVICE || "localhost:8081";
const APP_NAME = process.env.APP_NAME;

const customers = [
	{id: 1, name: 'James', address: 'UK', gender: 'M'},
	{id: 2, name: 'Jamila', address: 'US', gender: 'F'},
	{id: 3, name: 'Bilal', address: 'ES', gender: 'M'},
];

let router = express.Router();

app.use(actuator());
app.use(cors());

router.get("/api/v1/customers", function(req, res) {
	res.json(customers);
});

router.get("/api/v1/customers/:id/orders", function(req, res) {
	const url = `http://${ORDER_SERVICE}/api/v1/orders/customers/${req.params.id}`;
	axios.get(url)
		.then(response => {
			res.json(response.data);
		})
		.catch((e) => {
			res.status(500).json({
				e,
			});
		});
});

app.use("/", router);

app.listen(PORT, () => {
	console.log(`${APP_NAME || ""} Server Running on port ${PORT}`);
	if (KILL_IN_SECONDS) {
		console.log(`Server will die in ${KILL_IN_SECONDS} seconds.`);
		setTimeout(() => {
			process.exit(1);
		}, KILL_IN_SECONDS * 1000);
	}
});
