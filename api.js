const URL = "https://api.jsonbin.io/v3/b/66fe2f42ad19ca34f8b1e3fe";

export async function patchData(data = {}) {
  // Default options are marked with *
  const response = await fetch(URL, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key":
        "$2a$10$kpVUFEVLeP6fZb1Xplr3TuVOjzOVU6zuYoayKoYEAj3CXohv8d5bq",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

export async function getData() {
  // Default options are marked with *
  const response = await fetch(URL, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      "X-Access-Key":
        "$2a$10$kpVUFEVLeP6fZb1Xplr3TuVOjzOVU6zuYoayKoYEAj3CXohv8d5bq",
    },
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}
