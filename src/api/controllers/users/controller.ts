import UserService from "../../services/user";
import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";
import { LIMIT_MAX_PAGINATION } from "../../../utils";

export class Controller {
  async all(req: Request, res: Response): Promise<void> {
    const {page, limit} = req.query
    const data = await fetch(`${process.env.TERNOA_API_URL}/api/users/?page=${page}&limit=${limit}`)
    const response = await data.json()
    res.json(response)
  }

  async newUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { body } = req;
      const { walletId } = body;
      let existingUser = null;
      try {
        const data = await fetch(`${process.env.TERNOA_API_URL}/api/users/${walletId}`)
        existingUser = await data.json()
      }
      finally {
        if (existingUser) {
          res.status(409).send("Wallet user already exists");
        } else {
          const data = await fetch(`${process.env.TERNOA_API_URL}/api/users/create`, {
            method: 'POST',
            body
          })
          const user = await data.json()
          res.json(user);
        }
      }
    } catch (err) {
      next(err);
    }
  }

  async getUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const { incViews, walletIdViewer } = req.query
      const { ip } = req
      const user = await UserService.findUser(id, incViews === "true", walletIdViewer as string, ip, true);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getUsersBywalletId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { walletIds } = req.query
      const data = await fetch(`${process.env.TERNOA_API_URL}/api/users/getUsers?walletIds=${(walletIds as string[]).join("&walletIds=")}`)
      const users = await data.json()
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  async reviewRequested(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const data = await fetch(`${process.env.TERNOA_API_URL}/api/users/reviewRequested/${req.params.id}`,{
        method: 'PATCH'
      });
      const user = await data.json()
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getAccountBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const balance = await UserService.getAccountBalance(req.params.id);
      res.json(balance);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await fetch(`${process.env.TERNOA_API_URL}/api/users/${req.params.walletId}`,{
        method: 'POST',
        body: req.body
      });
      const user = await data.json();
      res.json(user);
    } catch (err) {
      next(err)
    }
  }

  async likeNft(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { walletId, nftId, serieId } = req.query
      const data = await fetch(`${process.env.TERNOA_API_URL}/api/users/like?walletId=${walletId}&nftId=${nftId}&serieId=${serieId}`, {
        method: 'POST',
      })
      const user = await data.json()
      res.json(user);
    } catch (err) {
      next(err)
    }
  }

  async unlikeNft(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { walletId, nftId, serieId } = req.query
      const data = await fetch(`${process.env.TERNOA_API_URL}/api/users/unlike?walletId=${walletId}&nftId=${nftId}&serieId=${serieId}`, {
        method: 'POST',
      })
      const user = await data.json()
      res.json(user);
    } catch (err) {
      next(err)
    }
  }

  async getLikedNfts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const {page, limit} = req.query
      if (!id) throw new Error("wallet id not given")
      if (page && (isNaN(Number(page)) || Number(page) < 1)) throw new Error("Page argument is invalid")
      if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > LIMIT_MAX_PAGINATION)) throw new Error("Limit argument is invalid")
      const nfts = await UserService.getLikedNfts(id as string, page as string, limit as string);
      res.json(nfts);
    } catch (err) {
      next(err)
    }
  }

  
  async verifyTwitter(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>{
    try{
      if (!req.params.id) throw new Error("User wallet id not given")
      res.redirect(`${process.env.TERNOA_API_URL}/api/users/verifyTwitter/${req.params.id}`)
    }catch(err){
      next(err)
    }
  }
}
export default new Controller();