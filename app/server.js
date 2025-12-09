const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Database configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'app_db',
    port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes for Clients
app.get('/api/clients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Clients ORDER BY client_id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/clients/search', async (req, res) => {
    try {
        const { term } = req.query;
        const result = await pool.query(`
            SELECT * FROM Clients
            WHERE
                full_name ILIKE $1 OR
                passport_series || passport_number ILIKE $1 OR
                email ILIKE $1 OR
                phone_number ILIKE $1 OR
                inn ILIKE $1
            ORDER BY client_id
        `, [`%${term}%`]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Clients WHERE client_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Клиент не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/clients', async (req, res) => {
    try {
        const {
            full_name,
            date_of_birth,
            passport_series,
            passport_number,
            passport_issue_date,
            passport_issuing_authority,
            address,
            phone_number,
            email,
            client_type,
            inn
        } = req.body;

        const result = await pool.query(
            `INSERT INTO Clients (
                full_name,
                date_of_birth,
                passport_series,
                passport_number,
                passport_issue_date,
                passport_issuing_authority,
                address,
                phone_number,
                email,
                client_type,
                inn
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [
                full_name,
                date_of_birth,
                passport_series,
                passport_number,
                passport_issue_date,
                passport_issuing_authority,
                address,
                phone_number,
                email,
                client_type,
                inn
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            full_name,
            date_of_birth,
            passport_series,
            passport_number,
            passport_issue_date,
            passport_issuing_authority,
            address,
            phone_number,
            email,
            client_type,
            inn
        } = req.body;

        const result = await pool.query(
            `UPDATE Clients SET
                full_name = $1,
                date_of_birth = $2,
                passport_series = $3,
                passport_number = $4,
                passport_issue_date = $5,
                passport_issuing_authority = $6,
                address = $7,
                phone_number = $8,
                email = $9,
                client_type = $10,
                inn = $11,
                updated_at = CURRENT_TIMESTAMP
            WHERE client_id = $12 RETURNING *`,
            [
                full_name,
                date_of_birth,
                passport_series,
                passport_number,
                passport_issue_date,
                passport_issuing_authority,
                address,
                phone_number,
                email,
                client_type,
                inn,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Клиент не найден' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/clients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Clients WHERE client_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Клиент не найден' });
        }

        res.json({ message: 'Клиент успешно удален' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// API Routes for Credit Programs
app.get('/api/credit-programs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM CreditPrograms ORDER BY program_id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/credit-programs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM CreditPrograms WHERE program_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Кредитная программа не найдена' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/credit-programs', async (req, res) => {
    try {
        const {
            program_name,
            min_amount,
            max_amount,
            min_term_months,
            max_term_months,
            interest_rate,
            description,
            is_active
        } = req.body;

        const result = await pool.query(
            `INSERT INTO CreditPrograms (
                program_name,
                min_amount,
                max_amount,
                min_term_months,
                max_term_months,
                interest_rate,
                description,
                is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
                program_name,
                min_amount,
                max_amount,
                min_term_months,
                max_term_months,
                interest_rate,
                description,
                is_active !== undefined ? is_active : true
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/credit-programs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            program_name,
            min_amount,
            max_amount,
            min_term_months,
            max_term_months,
            interest_rate,
            description,
            is_active
        } = req.body;

        const result = await pool.query(
            `UPDATE CreditPrograms SET
                program_name = $1,
                min_amount = $2,
                max_amount = $3,
                min_term_months = $4,
                max_term_months = $5,
                interest_rate = $6,
                description = $7,
                is_active = $8,
                updated_at = CURRENT_TIMESTAMP
            WHERE program_id = $9 RETURNING *`,
            [
                program_name,
                min_amount,
                max_amount,
                min_term_months,
                max_term_months,
                interest_rate,
                description,
                is_active,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Кредитная программа не найдена' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/credit-programs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM CreditPrograms WHERE program_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Кредитная программа не найдена' });
        }

        res.json({ message: 'Кредитная программа успешно удалена' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// API Routes for Applications
app.get('/api/applications', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT a.*,
                c.full_name AS client_name,
                p.program_name
            FROM Applications a
            JOIN Clients c ON a.client_id = c.client_id
            JOIN CreditPrograms p ON a.program_id = p.program_id
            ORDER BY a.application_id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/applications/search', async (req, res) => {
    try {
        const { term } = req.query;
        const result = await pool.query(`
            SELECT a.*,
                c.full_name AS client_name,
                p.program_name
            FROM Applications a
            JOIN Clients c ON a.client_id = c.client_id
            JOIN CreditPrograms p ON a.program_id = p.program_id
            WHERE
                c.full_name ILIKE $1 OR
                p.program_name ILIKE $1 OR
                a.status ILIKE $1
            ORDER BY a.application_id
        `, [`%${term}%`]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT a.*,
                c.full_name AS client_name,
                p.program_name
            FROM Applications a
            JOIN Clients c ON a.client_id = c.client_id
            JOIN CreditPrograms p ON a.program_id = p.program_id
            WHERE a.application_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/applications', async (req, res) => {
    try {
        const {
            client_id,
            program_id,
            application_date,
            status,
            requested_amount,
            requested_term_months,
            inspector_comments
        } = req.body;

        const result = await pool.query(
            `INSERT INTO Applications (
                client_id,
                program_id,
                application_date,
                status,
                requested_amount,
                requested_term_months,
                inspector_comments
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                client_id,
                program_id,
                application_date || new Date(),
                status || 'Новая',
                requested_amount,
                requested_term_months,
                inspector_comments
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            client_id,
            program_id,
            application_date,
            status,
            requested_amount,
            requested_term_months,
            inspector_comments
        } = req.body;

        const result = await pool.query(
            `UPDATE Applications SET
                client_id = $1,
                program_id = $2,
                application_date = $3,
                status = $4,
                requested_amount = $5,
                requested_term_months = $6,
                inspector_comments = $7,
                updated_at = CURRENT_TIMESTAMP,
                status_updated_at = CASE WHEN status <> $4 THEN CURRENT_TIMESTAMP ELSE status_updated_at END
            WHERE application_id = $8 RETURNING *`,
            [
                client_id,
                program_id,
                application_date,
                status,
                requested_amount,
                requested_term_months,
                inspector_comments,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM Applications WHERE application_id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }

        res.json({ message: 'Заявка успешно удалена' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// API Routes for Scorings
app.get('/api/scorings', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, a.status AS application_status
            FROM Scorings s
            JOIN Applications a ON s.application_id = a.application_id
            ORDER BY s.scoring_id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/scorings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Scorings WHERE scoring_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Скоринг не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/scorings/application/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM Scorings WHERE application_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Скоринг для данной заявки не найден' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/scorings', async (req, res) => {
    try {
        const {
            application_id,
            score_value,
            risk_category,
            ai_recommendation,
            details_json,
            ai_model_version
        } = req.body;

        const result = await pool.query(
            `INSERT INTO Scorings (
                application_id,
                score_value,
                risk_category,
                ai_recommendation,
                details_json,
                ai_model_version
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                application_id,
                score_value,
                risk_category,
                ai_recommendation,
                details_json,
                ai_model_version
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/scorings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            application_id,
            score_value,
            risk_category,
            ai_recommendation,
            details_json,
            ai_model_version
        } = req.body;

        const result = await pool.query(
            `UPDATE Scorings SET
                application_id = $1,
                score_value = $2,
                risk_category = $3,
                ai_recommendation = $4,
                details_json = $5,
                ai_model_version = $6,
                updated_at = CURRENT_TIMESTAMP
            WHERE scoring_id = $7 RETURNING *`,
            [
                application_id,
                score_value,
                risk_category,
                ai_recommendation,
                details_json,
                ai_model_version,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Скоринг не найден' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// API Routes for Application Decisions
app.get('/api/application-decisions', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT d.*, a.status AS application_status
            FROM ApplicationDecisions d
            JOIN Applications a ON d.application_id = a.application_id
            ORDER BY d.decision_id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/application-decisions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM ApplicationDecisions WHERE decision_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Решение не найдено' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/application-decisions/application/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM ApplicationDecisions WHERE application_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Решение для данной заявки не найдено' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/application-decisions', async (req, res) => {
    try {
        const {
            application_id,
            decision_type,
            rejection_reason,
            approved_amount,
            approved_term_months,
            approved_interest_rate,
            employee_id
        } = req.body;

        const result = await pool.query(
            `INSERT INTO ApplicationDecisions (
                application_id,
                decision_type,
                rejection_reason,
                approved_amount,
                approved_term_months,
                approved_interest_rate,
                employee_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                application_id,
                decision_type,
                rejection_reason,
                approved_amount,
                approved_term_months,
                approved_interest_rate,
                employee_id
            ]
        );

        // Update the application status based on decision
        await pool.query(
            `UPDATE Applications SET
                status = $1,
                status_updated_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE application_id = $2`,
            [decision_type === 'Одобрено' ? 'Одобрена' : 'Отказано', application_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// API Routes for combined data (related tables on one form)
app.get('/api/application-details/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get application info with client and program details
        const applicationResult = await pool.query(`
            SELECT
                a.*,
                c.full_name AS client_name,
                c.passport_series,
                c.passport_number,
                c.phone_number,
                c.email AS client_email,
                p.program_name,
                p.interest_rate AS program_interest_rate
            FROM Applications a
            JOIN Clients c ON a.client_id = c.client_id
            JOIN CreditPrograms p ON a.program_id = p.program_id
            WHERE a.application_id = $1
        `, [id]);

        if (applicationResult.rows.length === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }

        const application = applicationResult.rows[0];

        // Get scoring info if exists
        const scoringResult = await pool.query(
            'SELECT * FROM Scorings WHERE application_id = $1',
            [id]
        );

        // Get decision info if exists
        const decisionResult = await pool.query(
            'SELECT * FROM ApplicationDecisions WHERE application_id = $1',
            [id]
        );
        // Get credit case info if exists
        const caseResult = await pool.query(
            'SELECT * FROM CreditCases WHERE application_id = $1',
            [id]
        );

        // Get documents info if case exists
        let documentsResult = { rows: [] };
        if (caseResult.rows.length > 0) {
            documentsResult = await pool.query(
                'SELECT * FROM Documents WHERE case_id = $1 ORDER BY upload_date DESC',
                [caseResult.rows[0].case_id]
            );
        }

        // Get credit agreement info if exists
        let agreementResult = { rows: [] };
        if (decisionResult.rows.length > 0) {
            agreementResult = await pool.query(
                'SELECT * FROM CreditAgreements WHERE decision_id = $1',
                [decisionResult.rows[0].decision_id]
            );
        }

        // Combine all data
        const result = {
            application: application,
            scoring: scoringResult.rows.length > 0 ? scoringResult.rows[0] : null,
            decision: decisionResult.rows.length > 0 ? decisionResult.rows[0] : null,
            creditCase: caseResult.rows.length > 0 ? caseResult.rows[0] : null,
            documents: documentsResult.rows,
            agreement: agreementResult.rows.length > 0 ? agreementResult.rows[0] : null
        };

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// API Routes for detailed application view with related tables
app.get('/api/applications/:id/detailed', async (req, res) => {
    try {
        const { id } = req.params;

        // Get the application data
        const applicationResult = await pool.query(`
            SELECT a.*,
                   c.full_name AS client_name,
                   cp.program_name
            FROM Applications a
            JOIN Clients c ON a.client_id = c.client_id
            JOIN CreditPrograms cp ON a.program_id = cp.program_id
            WHERE a.application_id = $1
        `, [id]);

        if (applicationResult.rows.length === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }

        const application = applicationResult.rows[0];

        // Get scoring data if exists
        const scoringResult = await pool.query(`
            SELECT * FROM Scorings WHERE application_id = $1
        `, [id]);

        // Get decision data if exists
        const decisionResult = await pool.query(`
            SELECT * FROM ApplicationDecisions WHERE application_id = $1
        `, [id]);

        // Get credit case data if exists
        const caseResult = await pool.query(`
            SELECT * FROM CreditCases WHERE application_id = $1
        `, [id]);

        // Get documents if a case exists
        let documents = [];
        if (caseResult.rows.length > 0) {
            const documentsResult = await pool.query(`
                SELECT * FROM Documents WHERE case_id = $1
            `, [caseResult.rows[0].case_id]);
            documents = documentsResult.rows;
        }

        // Get credit agreement if a decision exists and it's approved
        let agreement = null;
        if (decisionResult.rows.length > 0 && decisionResult.rows[0].decision_type === 'Одобрено') {
            const agreementResult = await pool.query(`
                SELECT * FROM CreditAgreements WHERE decision_id = $1
            `, [decisionResult.rows[0].decision_id]);

            if (agreementResult.rows.length > 0) {
                agreement = agreementResult.rows[0];
            }
        }

        // Return comprehensive data
        res.json({
            application,
            scoring: scoringResult.rows[0] || null,
            decision: decisionResult.rows[0] || null,
            creditCase: caseResult.rows[0] || null,
            documents,
            agreement
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
