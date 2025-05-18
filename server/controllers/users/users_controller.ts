import { RequestHandler } from 'express';
import { ReturnError, ReturnSuccess } from '../../models/request_response';
import { UserService } from '../../services/users/users_serv';


export const getUsers: RequestHandler = async (req, res) => {
  const users = await UserService.getAllUsers();
  if (users instanceof Error) {
    return ReturnError(res, [users.message], 500);
  }

  return ReturnSuccess(res, users);
};

export const getUserByPid: RequestHandler = async (req, res) => {
  const { pid } = req.params;

  const user = await UserService.getUserByPid(pid);
  if (user instanceof Error) {
    return ReturnError(res, [user.message], 404);
  }

  return ReturnSuccess(res, user);
};

// export const exportUserTodos: RequestHandler = async (req, res) => {
//   const { pid } = req.params;

//   const exportData = await UserService.exportUserTodos(pid);
//   if (exportData instanceof Error) {
//     return ReturnError(res, [exportData.message], 400);
//   }

//   res.setHeader('Content-Type', 'application/json');
//   res.setHeader('Content-Disposition', `attachment; filename=todos_${exportData.user.username}_${Date.now()}.json`);
//   return res.json({ success: true, data: exportData });
// };