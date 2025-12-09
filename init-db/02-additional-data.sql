-- Add more sample data to existing tables

-- Add more Clients
INSERT INTO Clients (full_name, date_of_birth, passport_series, passport_number, passport_issue_date, passport_issuing_authority, address, phone_number, email, client_type, inn) VALUES
('Сидорова Анна Петровна', '1990-03-25', '2345', '678901', '2010-04-15', 'Отделом УФМС России по г. Казань', 'г. Казань, ул. Ленина, д. 15, кв. 27', '+7(987)654-32-10', 'sidorova@example.com', 'ФЛ', '567890123456'),
('Козлов Алексей Николаевич', '1982-11-05', '3456', '789012', '2008-09-10', 'Отделом УФМС России по г. Нижний Новгород', 'г. Нижний Новгород, пр. Гагарина, д. 8, кв. 42', '+7(920)123-45-67', 'kozlov@example.com', 'ФЛ', '678901234567'),
('ИП Смирнов Игорь Владимирович', '1975-07-20', '4567', '890123', '2005-08-12', 'Отделом УФМС России по г. Екатеринбург', 'г. Екатеринбург, ул. Мира, д. 22, кв. 15', '+7(912)345-67-89', 'smirnov@example.com', 'ИП', '789012345678'),
('ООО "Техносервис"', '1998-05-17', '0000', '000001', '1998-05-17', 'МНС России', 'г. Москва, ул. Тверская, д. 10, офис 501', '+7(495)234-56-78', 'technoservice@example.com', 'ЮЛ', '890123456789'),
('Новикова Светлана Игоревна', '1993-09-28', '5678', '901234', '2013-10-05', 'Отделом УФМС России по г. Сочи', 'г. Сочи, ул. Морская, д. 5, кв. 18', '+7(918)765-43-21', 'novikova@example.com', 'ФЛ', '901234567890');

-- Add more Credit Programs
INSERT INTO CreditPrograms (program_name, min_amount, max_amount, min_term_months, max_term_months, interest_rate, description) VALUES
('Бизнес-старт', 500000.00, 10000000.00, 12, 120, 11.2, 'Кредитование для запуска малого бизнеса'),
('Образовательный кредит', 50000.00, 800000.00, 12, 60, 8.5, 'Специальная программа для оплаты обучения'),
('Пенсионный кредит', 10000.00, 300000.00, 3, 36, 9.9, 'Кредит с пониженной ставкой для пенсионеров');

-- Add more Applications
INSERT INTO Applications (client_id, program_id, application_date, status, requested_amount, requested_term_months, inspector_comments) VALUES
(4, 5, '2023-04-05', 'Новая', 3000000.00, 60, 'Заявка от юр. лица, требуется анализ финансовой отчетности'),
(5, 3, '2023-03-20', 'В проверке', 400000.00, 24, 'Проверка кредитной истории'),
(1, 6, '2023-05-01', 'В проверке', 5000000.00, 84, 'Требуется бизнес-план'),
(2, 7, '2023-04-25', 'Одобрена', 200000.00, 36, 'Одобрена после проверки документов'),
(3, 1, '2023-05-10', 'Отказано', 750000.00, 48, 'Высокая нагрузка по существующим кредитам');

-- Add more Scorings
INSERT INTO Scorings (application_id, score_value, risk_category, ai_recommendation, details_json, ai_model_version) VALUES
(4, 720, 'Средний', 'Одобрить', '{"income_factor": 0.75, "credit_history": "good", "debt_ratio": 0.35}', 'v2.1'),
(5, 680, 'Средний', 'Доп. проверка', '{"income_factor": 0.7, "credit_history": "fair", "debt_ratio": 0.4}', 'v2.1'),
(6, 790, 'Низкий', 'Одобрить', '{"income_factor": 0.85, "credit_history": "excellent", "debt_ratio": 0.2}', 'v2.1'),
(7, 630, 'Высокий', 'Отказать', '{"income_factor": 0.55, "credit_history": "poor", "debt_ratio": 0.6}', 'v2.1');

-- Add more ApplicationDecisions
INSERT INTO ApplicationDecisions (application_id, decision_type, rejection_reason, approved_amount, approved_term_months, approved_interest_rate, employee_id) VALUES
(4, 'Одобрено', NULL, 2800000.00, 48, 11.5, 2),
(5, 'Отказано', 'Недостаточный уровень дохода', NULL, NULL, NULL, 3),
(7, 'Одобрено', NULL, 180000.00, 36, 9.0, 1);

-- Add Credit Cases
INSERT INTO CreditCases (application_id, initiator_employee_id, status, responsible_employee_id) VALUES
(1, 1, 'Сформировано', 2),
(2, 2, 'В работе', 3),
(4, 3, 'В работе', 1);

-- Add Documents
INSERT INTO Documents (case_id, document_type, file_name, file_path, file_size_bytes, file_hash) VALUES
(1, 'Паспорт', 'passport_client1.pdf', '/documents/client1/passport.pdf', 1254876, 'a1b2c3d4e5f6g7h8i9j0'),
(1, 'Справка 2-НДФЛ', 'income_client1.pdf', '/documents/client1/income.pdf', 987543, 'b2c3d4e5f6g7h8i9j0k1'),
(2, 'Паспорт', 'passport_client2.pdf', '/documents/client2/passport.pdf', 1345987, 'c3d4e5f6g7h8i9j0k1l2'),
(2, 'Выписка из банка', 'bank_statement_client2.pdf', '/documents/client2/bank_statement.pdf', 2345678, 'd4e5f6g7h8i9j0k1l2m3'),
(3, 'Паспорт', 'passport_client3.pdf', '/documents/client3/passport.pdf', 1456789, 'e5f6g7h8i9j0k1l2m3n4');

-- Add Credit Agreements
INSERT INTO CreditAgreements (decision_id, signing_date, agreement_number, electronic_agreement_path, signing_status, agreement_amount, agreement_term_months, agreement_interest_rate) VALUES
(1, '2023-01-20', 'CRD-2023-001', '/agreements/CRD-2023-001.pdf', 'Подписан ЭЦП', 450000.00, 24, 13.0),
(2, '2023-03-01', 'CRD-2023-002', '/agreements/CRD-2023-002.pdf', 'Подписан ЭЦП', 4800000.00, 240, 8.2),
(4, '2023-04-15', 'CRD-2023-003', '/agreements/CRD-2023-003.pdf', 'Ожидает', 2800000.00, 48, 11.5);
