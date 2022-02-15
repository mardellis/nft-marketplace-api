import FollowModel from "../../models/follow";
import { IUser } from "../../interfaces/IUser";
import { CustomResponse } from "../../interfaces/graphQL";
import fetch from "node-fetch";
import { LIMIT_MAX_PAGINATION, ATELIER_STUDIO_API_URL } from '../../utils'
import { countFollowersFollowingQuery, followUnfollowQuery, getFollowersFollowingQuery, isUserFollowingQuery } from "../validators/followValidators";

export class FollowService {
  /**
   * Returns all of user's followers
   * @param query - see getFollowersFollowingQuery
   * @throws Will throw an error if followers can't be fetched
   */
   async getUserFollowers(query: getFollowersFollowingQuery): Promise<CustomResponse<IUser>> {
    try {
      const followerWalletIds: string[] = (await FollowModel.find({ followed: query.walletId })).map(x => x.follower)
      const filter: any = {walletIds: followerWalletIds, ...query.filter}
      const data = await fetch(`${ATELIER_STUDIO_API_URL}/api/users/?filter=${JSON.stringify(filter)}&pagination=${JSON.stringify(query.pagination)}`)
      return await data.json() as CustomResponse<IUser>;
    } catch (err) {
      throw new Error("Followers can't be fetched");
    }
  }

  /**
   * Returns all of users' followings
   * @param query - see getFollowersFollowingQuery
   * @throws Will throw an error if followings can't be fetched
   */
  async getUserFollowings(query: getFollowersFollowingQuery): Promise<CustomResponse<IUser>> {
    try {
      const followedWalletIds: string[] = (await FollowModel.find({ follower: query.walletId })).map(x => x.followed)
      const filter: any = {walletIds: followedWalletIds, ...query.filter}
      const data = await fetch(`${ATELIER_STUDIO_API_URL}/api/users/?filter=${JSON.stringify(filter)}&pagination=${JSON.stringify(query.pagination)}`)
      return await data.json() as CustomResponse<IUser>;
    } catch (err) {
      throw new Error("Followings can't be fetched");
    }
  }

  /**
   * count user's followers
   * @param query - see countFollowersFollowingQuery
   * @throws Will throw an error if followers can't be fetched
   */
   async countUserFollowers(query: countFollowersFollowingQuery): Promise<number> {
    try {
      return (await FollowModel.find({ followed: query.walletId })).length
    } catch (err) {
      throw new Error("Followers number can't be fetched");
    }
  }

  /**
   * count user's followers
   * @param query - see countFollowersFollowingQuery
   * @throws Will throw an error if followers can't be fetched
   */
   async countUserFollowing(query: countFollowersFollowingQuery): Promise<number> {
    try {
      return (await FollowModel.find({ follower: query.walletId })).length
    } catch (err) {
      throw new Error("Followed number can't be fetched");
    }
  }

  /**
   * Create a new follow
   * @param query - see followUnfollowQuery
   * @throws Will throw an error if user can't be followed
   */
  async follow(query: followUnfollowQuery): Promise<IUser> {
    try {
      let follow = await FollowModel.findOne({followed: query.walletIdFollowed, follower: query.walletIdFollower})
      if (follow) throw new Error("user is already following")
      follow = new FollowModel({followed: query.walletIdFollowed, follower: query.walletIdFollower});
      await follow.save()
      const data = await fetch(`${ATELIER_STUDIO_API_URL}/api/users/${query.walletIdFollowed}`)
      const userFollowed = await data.json() as IUser
      return userFollowed;
    } catch (err) {
      throw new Error("Couldn't follow user");
    }
  }

  /**
   * Delete a follow
   * @param query - see followUnfollowQuery
   * @throws Will throw an error if user can't be unfollowed
   */
     async unfollow(query: followUnfollowQuery): Promise<IUser> {
      try {
        const follow = await FollowModel.findOne({followed: query.walletIdFollowed, follower: query.walletIdFollower})
        if (!follow) throw new Error("user is already not following")
        await follow.delete()
        const data = await fetch(`${ATELIER_STUDIO_API_URL}/api/users/${query.walletIdFollowed}`)
        const userFollowed = await data.json()
        return userFollowed as IUser;
      } catch (err) {
        throw new Error("Couldn't unfollow user");
      }
    }

  /**
   * Check if follower follows followed
   * @param query - see isUserFollowingQuery
   * @throws Will throw an error if user can't be followed
   */
    async isUserFollowing(query: isUserFollowingQuery): Promise<{isFollowing: boolean}> {
      try {
        const follow = await FollowModel.findOne({followed: query.walletIdFollowed, follower: query.walletIdFollower})
        if (follow){
          return {isFollowing: true}
        }else{
          return {isFollowing: false}
        }
      } catch (err) {
        throw new Error("Couldn't retrieve follow");
      }
    }
}

export default new FollowService();
