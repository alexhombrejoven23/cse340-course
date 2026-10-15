import { body, validationResult } from 'express-validator';

import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { addVolunteer, removeVolunteer, isVolunteer } from '../models/volunteers.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define validation and sanitization rules for project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = 'Service Project Details';

    // Only check volunteer status when a user is logged in
    let volunteerStatus = false;
    if (req.session && req.session.user) {
        volunteerStatus = await isVolunteer(req.session.user.user_id, projectId);
    }

    res.render('project', { title, project, categories, volunteerStatus });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId } = req.body;

    try {
        const newProjectId = await createProject(title, description, location, date, organizationId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const processVolunteerSignup = async (req, res) => {
    const projectId = req.params.id;

    try {
        await addVolunteer(req.session.user.user_id, projectId);
        req.flash('success', 'You have signed up to volunteer for this project!');
    } catch (error) {
        console.error('Error signing up as volunteer:', error);
        req.flash('error', 'There was an error signing up to volunteer.');
    }

    res.redirect(`/project/${projectId}`);
};

const processVolunteerRemoval = async (req, res) => {
    const projectId = req.params.id;

    try {
        await removeVolunteer(req.session.user.user_id, projectId);
        req.flash('success', 'You have been removed as a volunteer');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'There was an error removing you as a volunteer.');
    }

    // Return to the dashboard if the request came from there
    if (req.body.redirectTo === 'dashboard') {
        return res.redirect('/dashboard');
    }

    res.redirect(`/project/${projectId}`);
};

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    processVolunteerSignup,
    processVolunteerRemoval
};