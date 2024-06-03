import { use, expect } from "chai";
import chaiHttp from "chai-http";
const chai = use(chaiHttp);
import jwt from "jsonwebtoken";
import fs from "fs";

chai.request();
import app from "../app.js";

const secretKey = process.env.JWT_SECRET;

const token = jwt.sign({ id: 21 }, secretKey, { expiresIn: "1h" });

describe("Items API with JWT Authentication", () => {
	let testItemId = 1;

	describe("GET /api/v1/items", () => {
		it("should return a list of items", async () => {
			const res = await chai
				.request(app)
				.get("/api/v1/items")
				.set("Authorization", `Bearer ${token}`);
			expect(res).to.have.status(200);
			expect(res.body).to.be.an("object");
		});
	});

	describe("POST /api/v1/items", () => {
		it("should create a new item with an image", async () => {
			const newItem = {
				name: "Sample Item",
				description: "This is a sample item.",
				starting_price: 100,
				end_time: "2024-06-30",
			};

			const imagePath = "/Users/ashutosh/Downloads/Image.jpeg";

			const res = await chai
				.request(app)
				.post("/api/v1/items")
				.set("Authorization", `Bearer ${token}`)
				.set("Content-Type", "application/x-www-form-urlencoded")
				.attach("image", fs.readFileSync(imagePath), "Image.jpeg")
				.field("name", newItem.name)
				.field("description", newItem.description)
				.field("starting_price", newItem.starting_price)
				.field("end_time", newItem.end_time);

			expect(res).to.have.status(201);
			expect(res.body).to.be.an("object");
			expect(res.body).to.have.property("status", "success");
			expect(res.body).to.have.property("data");
			expect(res.body.data).to.have.property("name", newItem.name);
			expect(res.body.data).to.have.property("itemId");
			expect(res.body.data).to.have.property(
				"description",
				newItem.description
			);
			testItemId = res.body.data.itemId;
		});
	});

	describe("GET /api/v1/items/:id", () => {
		it("should return a single item", async () => {
			const res = await chai
				.request(app)
				.get(`/api/v1/items/${testItemId}`)
				.set("Authorization", `Bearer ${token}`);
			expect(res).to.have.status(200);
			expect(res.body).to.be.an("object");
			expect(res.body).to.have.property("data");
			expect(res.body.data).to.be.an("object");
			expect(res.body.data).to.have.property("item");
			expect(res.body.data.item).to.be.an("object");
			expect(res.body.data.item).to.have.property("id", testItemId);
		});
	});

	describe("PUT /api/v1/items/:id", () => {
		it("should update an existing item", async () => {
			const updatedItem = {
				name: "Updated Item",
				description: "This is an updated item.",
				starting_price: 200,
				end_time: "2024-06-30",
			};
			const res = await chai
				.request(app)
				.put(`/api/v1/items/${testItemId}`)
				.set("Authorization", `Bearer ${token}`)
				.send(updatedItem);
			expect(res).to.have.status(200);
			expect(res.body).to.be.an("object");
			expect(res.body).to.have.property('message',"Item updated successfully");
			expect(res.body).to.have.property("data");
			expect(res.body.data).to.have.property("affectedRows", 1);

		});
	});

	describe("DELETE /api/v1/items/:id", () => {
	    it("should delete an item", async () => {
	        const res = await chai
	            .request(app)
	            .delete(`/api/v1/items/${testItemId}`)
	            .set("Authorization", `Bearer ${token}`);
	        expect(res).to.have.status(204);
	    });
	});
});
