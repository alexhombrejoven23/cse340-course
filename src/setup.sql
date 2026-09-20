-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization (organization_id)
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
(1, 'Community Garden Build', 'Building raised garden beds for a local school.', 'La Paz', '2026-10-01'),
(1, 'Roof Repair Drive', 'Repairing roofs for low-income families.', 'Sucre', '2026-10-15'),
(1, 'Water Well Construction', 'Building a new well for a rural community.', 'Potosi', '2026-11-01'),
(1, 'Housing Renovation', 'Renovating homes damaged by flooding.', 'Cochabamba', '2026-11-20'),
(1, 'Solar Panel Installation', 'Installing solar panels for a community center.', 'Santa Cruz', '2026-12-05'),
(2, 'Urban Farm Expansion', 'Expanding an urban farm to grow more produce.', 'La Paz', '2026-10-03'),
(2, 'Composting Workshop', 'Teaching families how to compost food waste.', 'El Alto', '2026-10-18'),
(2, 'School Garden Project', 'Creating a vegetable garden at a local school.', 'Sucre', '2026-11-02'),
(2, 'Seed Bank Initiative', 'Establishing a community seed bank.', 'Cochabamba', '2026-11-22'),
(2, 'Farmers Market Setup', 'Organizing a weekly farmers market.', 'Santa Cruz', '2026-12-10'),
(3, 'Food Bank Drive', 'Collecting and distributing food to families in need.', 'La Paz', '2026-10-05'),
(3, 'Clothing Donation Event', 'Organizing a clothing drive for winter.', 'Potosi', '2026-10-20'),
(3, 'Senior Center Visits', 'Coordinating volunteer visits to senior centers.', 'Sucre', '2026-11-05'),
(3, 'Youth Mentorship Program', 'Pairing volunteers with at-risk youth.', 'Cochabamba', '2026-11-25'),
(3, 'Disaster Relief Support', 'Assisting families affected by natural disasters.', 'Santa Cruz', '2026-12-12');

-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ========================================
-- Project-Category Junction Table
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES service_project (project_id),
    FOREIGN KEY (category_id) REFERENCES category (category_id)
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Community Development'),
('Environmental Sustainability'),
('Education and Mentorship'),
('Emergency Relief');

-- ========================================
-- Insert sample data: Project-Category Associations
-- ========================================
INSERT INTO project_category (project_id, category_id)
VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 2),
(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 1),
(11, 4),
(12, 4),
(13, 3),
(14, 3),
(15, 4);