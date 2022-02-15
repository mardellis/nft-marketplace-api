import express from "express";
import controller from "./controller";
export default express
  .Router()
  .patch("/reviewRequested/:id", controller.reviewRequested) // atelierstudio-api
  .get("/", controller.getUsers) // atelierstudio-api
  .get("/verifyTwitter/:id", controller.verifyTwitter) // atelierstudio-api
  .get("/:id", controller.getUser) // atelierstudio-api
  .get("/:id/caps", controller.getAccountBalance)
  .post("/create", controller.newUser) // atelierstudio-api
  .post("/like", controller.likeNft) // atelierstudio-api
  .post("/unlike", controller.unlikeNft) // atelierstudio-api
  .post("/:walletId", controller.updateUser); // atelierstudio-api
