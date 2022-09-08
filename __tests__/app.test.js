const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => seed(testData));

describe("Testing the sites endpoint", () => {
  test("should return all of the valid sites, status 200", () => {
    return request(app)
      .get("/sites")
      .expect(200)
      .then(({ body }) => {
        const sites = body;
        expect(sites).toBeInstanceOf(Array);
        expect(sites).toHaveLength(4);
        sites.forEach((site) => {
          expect(site).toEqual(
            expect.objectContaining({
              authorID: expect.any(Number),
              siteName: expect.any(String),
              siteDescription: expect.any(String),
              siteImage: expect.any(String),
              siteAddress: expect.any(String),
              latitude: expect.any(Number),
              longitude: expect.any(Number),
              contactInfo: expect.any(String),
              websiteLink: expect.any(String),
            })
          );
        });
      });
  });

  test("should return all associated sites by stated author ID", () => {
    return request(app)
      .get("/sites?author_id=1")
      .expect(200)
      .then(({ body }) => {
        const sites = body;
        expect(sites).toBeInstanceOf(Array);
        expect(sites).toHaveLength(3);
        sites.forEach((site) => {
          expect(site).toEqual(
            expect.objectContaining({
              authorID: expect.any(Number),
              siteName: expect.any(String),
              siteDescription: expect.any(String),
              siteImage: expect.any(String),
              siteAddress: expect.any(String),
              latitude: expect.any(Number),
              longitude: expect.any(Number),
              contactInfo: expect.any(String),
              websiteLink: expect.any(String),
            })
          );
        });
      });
  });

  test("should post a new site into site db, status 201", () => {
    return request(app)
      .post("/sites")
      .send({
        authorID: 12,
        siteName: "String",
        siteDescription: "String",
        siteImage: "String",
        siteAddress: "String",
        latitude: 1232,
        longitude: 1232,
        contactInfo: "String",
        websiteLink: "String",
      })
      .expect(201)
      .then(({ body }) => {
        const sites = body;
        expect(sites).toBeInstanceOf(Object);
        expect(sites).toEqual(
          expect.objectContaining({
            authorID: 12,
            siteName: "String",
            siteDescription: "String",
            siteImage: "String",
            siteAddress: "String",
            latitude: 1232,
            longitude: 1232,
            contactInfo: "String",
            websiteLink: "String",
          })
        );
      });
  });

  test("should return a status 404 when passed an Author ID with no associated sites", () => {
    return request(app)
      .get("/sites?author_id=23")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Author ID does not exist");
      });
  });

  test("should return a status 400 when passed an invalid input", () => {
    return request(app)
      .get("/sites?author_id=dsahk")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Input");
      });
  });

  test("should return status 400 when missing info on posted site", () => {
    return request(app)
      .post("/sites")
      .send({
        authorID: 12,
        siteName: "String",
        siteDescription: "String",
        siteImage: "String",
        latitude: 1232,
        longitude: 1232,
        contactInfo: "String",
        websiteLink: "String",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Missing Input Information!");
      });
  });

  test("should return status 400 when given incorrect data on site posting", () => {
    return request(app)
      .post("/sites")
      .send({
        authorID: 12,
        siteName: "String",
        siteDescription: "String",
        siteImage: "String",
        siteAddress: "String",
        latitude: "1232",
        longitude: 1232,
        contactInfo: "String",
        websiteLink: "String",
      })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid Input");
      });
  });
});

describe("Testing the tours endpoint", () => {
  test("should return all of the valid tours, status 200", () => {
    return request(app)
      .get("/tours")
      .expect(200)
      .then(({ body }) => {
        const tours = body;
        expect(tours).toBeInstanceOf(Array);
        expect(tours).toHaveLength(2);
        tours.forEach((tour) => {
          expect(tour).toEqual(
            expect.objectContaining({
              tourId: expect.any(Number),
              tourCode: expect.any(Number),
              tourName: expect.any(String),
              tourDescription: expect.any(String),
              tourImage: expect.any(String),
              tourSites: expect.any(Array),
            })
          );
        });
      });
  });

  test("should return all associated tours by stated author ID", () => {
    return request(app)
      .get("/tours?author_id=1")
      .expect(200)
      .then(({ body }) => {
        const tours = body;
        expect(tours).toBeInstanceOf(Array);
        expect(tours).toHaveLength(2);
        tours.forEach((tour) => {
          expect(tour).toEqual(
            expect.objectContaining({
              tourId: expect.any(Number),
              tourCode: expect.any(Number),
              tourName: expect.any(String),
              tourDescription: expect.any(String),
              tourImage: expect.any(String),
              tourSites: expect.any(Array),
            })
          );
        });
      });
  });

  test("should return an empty array when passed an ID with no associated tours", () => {
    return request(app)
      .get("/tours?author_id=0")
      .expect(200)
      .then(({ body }) => {
        const tours = body;
        expect(tours).toBeInstanceOf(Array);
        expect(tours).toHaveLength(0);
      });
  });

  test("should post a new tour into site db, status 201", () => {
    return request(app)
      .post("/tours")
      .send({
        authorId: 1,
        tourName: "A Medium Tour of Durham",
        tourDescription: "A medium tour of historic Durham",
        tourImage:
          "https://myguideimages.s3.eu-west-2.amazonaws.com/durham_cathedral.jpg",
        tourSites: [1, 2, 3],
      })
      .expect(201)
      .then(({ body }) => {
        const tours = body;
        expect(tours).toBeInstanceOf(Object);
        expect(tours).toEqual(
          expect.objectContaining({
            tourId: expect.any(Number),
            tourCode: expect.any(Number),
            authorId: 1,
            tourName: "A Medium Tour of Durham",
            tourDescription: "A medium tour of historic Durham",
            tourImage:
              "https://myguideimages.s3.eu-west-2.amazonaws.com/durham_cathedral.jpg",
            tourSites: [1, 2, 3],
          })
        );
      });
  });
});

describe("Testing tours endpoint with specified tour_ids", () => {
  test("should return status 200 and the tour with corresponding tourId", () => {
    return request(app)
      .get("/tours/1")
      .expect(200)
      .then(({ body }) => {
        const tour = body[0];
        expect(tour).toEqual(
          expect.objectContaining({
            tourId: 1,
            authorId: 1,
            tourCode: 123456,
            tourName: "Tour of Durham",
            tourDescription: "A tour of historic Durham",
            tourImage:
              "https://myguideimages.s3.eu-west-2.amazonaws.com/durham_cathedral.jpg",
            tourSites: [1, 2, 3, 4],
          })
        );
      });
  });

  test("should return status 204 and no body for deleted tour", () => {
    return request(app)
      .delete("/tours/1")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/tours")
          .expect(200)
          .then(({ body }) => {
            expect(body).toBeInstanceOf(Array);
            expect(body).toHaveLength(1);
          });
      });
  });

  test("should return status 200 and updated tour for patch request", () => {
    const update = {
      tourCode: 555555,
      tourName: "test name",
      tourDescription: "test description",
    };
    return request(app)
      .patch("/tours/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        const tour = body[0];
        expect(tour).toEqual(
          expect.objectContaining({
            tourId: 1,
            authorId: 1,
            tourCode: 555555,
            tourName: "test name",
            tourDescription: "test description",
            tourImage:
              "https://myguideimages.s3.eu-west-2.amazonaws.com/durham_cathedral.jpg",
            tourSites: [1, 2, 3, 4],
          })
        );
      });
  });
});
