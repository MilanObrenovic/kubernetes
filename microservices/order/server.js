const express    = require("express")
const actuator   = require("express-actuator");
const app        = express();

// Envs
const port = process.env.PORT || 8081;
const appName = process.env.APP_NAME;
const killInSeconds = process.env.KILL_IN_SECONDS;

const orders = [
	{customerId: 1, items: ['Apples', 'Bananas']},
	{customerId: 2, items: ['Water']},
];

let router = express.Router();

app.use(actuator());

router.get("/api/v1/orders/customers/:customerId", function(req, res) {
	const customerOrders = orders.find(o =>  o.customerId == req.params.customerId);
	if (customerOrders) {
		return res.json(customerOrders);
	}
	return res.json([]);
});

app.use("/", router);

app.listen(port, () => {
	console.log(`${appName || ""} Server Running on port ${port}`);
	if (killInSeconds) {
		console.log(`Server will die in ${killInSeconds} seconds.`)
		setTimeout(() => {
			process.exit(1);
		}, killInSeconds * 1000);
	}
});
