import userStoriesService from "./userStories.service.js";

class UserStoriesController {
    
    getAllUserStories = async (req, res, next) => {
        try {
            const { projectId, sprintId } = req.query;
            const userStories = await userStoriesService.getAllUserStories({ projectId, sprintId });
            res.status(200).json({ status: 'OK', data: userStories });
        } catch (error) {
            next(error);
        }
    }

    getOneUserStory = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userStory = await userStoriesService.getOneUserStory(id);
            res.status(200).json({ status: 'OK', data: userStory });
        } catch (error) {
            next(error); 
        }
    }

    createUserStory = async (req, res, next) => {
        try {
            const { body } = req;
            const createdStory = await userStoriesService.createUserStory(body);
            res.status(201).json({ status: "CREATED", data: createdStory });
        } catch (error) {
            next(error);
        }
    }

    updateUserStory = async (req, res, next) => {
        try {
            const { body, params: { id } } = req;  
            
            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }
    
            const updatedStory = await userStoriesService.updateUserStory(id, body); 
            res.status(200).json({ status: "OK", data: updatedStory });
        } catch (error) {
            next(error);
        }
    };
    
    deleteUserStory = async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }

            await userStoriesService.deleteUserStory(id);
            
            res.sendStatus(204); 
        } catch (error) {
            next(error);
        }
    }
}

export default new UserStoriesController();