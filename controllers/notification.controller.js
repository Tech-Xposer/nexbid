import connection from '../config/db.js';
import ApiResponse from '../handlers/response.handler.js';
import { ApiError } from '../handlers/error.handler.js';


export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const [notifications] = await connection.execute(
            'SELECT * FROM notifications WHERE user_id = ?',
            [userId]
        );
        return ApiResponse.success(res, 200, 'Notifications fetched successfully', { notifications });
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
};


export const markNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await connection.execute(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
            [userId]
        );
        return ApiResponse.success(res, 200, 'Notifications marked as read');
    } catch (error) {
        return ApiResponse.error(res, error.message, error.statusCode || 500);
    }
};
