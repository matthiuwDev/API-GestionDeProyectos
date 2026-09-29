import usersService from "./users.service.js";

class UserController{
    getUsers = async (req, res, next) => {
        try {
            const { projectId } = req.params;
            const users = await usersService.getUsers(projectId);

            res.send({ status: 'OK', data: users });
        } catch (error) {
            next(error);
        }
    }

    
}

export default new UserController();