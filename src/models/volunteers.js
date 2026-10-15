import db from './db.js';

const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
    `;
    await db.query(query, [userId, projectId]);
};

const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2
    `;
    await db.query(query, [userId, projectId]);
};

const getVolunteerProjects = async (userId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.project_date, sp.location,
               o.name AS organization_name
        FROM volunteer v
        JOIN service_project sp ON v.project_id = sp.project_id
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY sp.project_date
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

const isVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM volunteer
        WHERE user_id = $1 AND project_id = $2
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

export { addVolunteer, removeVolunteer, getVolunteerProjects, isVolunteer };