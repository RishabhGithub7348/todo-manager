import oplog from "../../oplog/oplog";
import { UserModel } from "../../entities/user";
import { IUser } from "../../entities/user";
import { getErrorMessage } from "../../oplog/error";


export async function findByPid(pid: string): Promise<IUser | null | Error> {
  try {
    const user = await UserModel.findOne({ pid }).exec();
    return user;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function findByUsername(username: string): Promise<IUser | null | Error> {
  try {
    const user = await UserModel.findOne({ username }).exec();
    return user;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export async function findAll(): Promise<IUser[] | Error> {
  try {
    const users = await UserModel.find().select('pid username displayName').exec();
    return users;
  } catch (error) {
    oplog.error(getErrorMessage(error));
    return error as Error;
  }
}

export const UserRepository = {
  findByPid,
  findByUsername,
  findAll,
};