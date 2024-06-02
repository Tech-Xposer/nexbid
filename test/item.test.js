// tests/item.test.js

import { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../app.js";
import chai from "chai";

chai.use(chaiHttp);

describe("Items API", () => {
	describe("GET /api/items", () => {
		it("should return a list of items", async () => {
			const res = await chai.request(app).get("/api/items");
			expect(res).to.have.status(200);
			expect(res.body).to.be.an("array");
		});
	});

	// Add more test cases for other endpoints
});
