-- Create tables for credit application system

-- Таблица КЛИЕНТЫ
CREATE TABLE IF NOT EXISTS Clients (
 client_id BIGSERIAL PRIMARY KEY, -- Уникальный идентификатор клиента, автоинкремент
 full_name VARCHAR(255) NOT NULL, -- ФИО клиента
 date_of_birth DATE NOT NULL, -- Дата рождения
 passport_series VARCHAR(4) NOT NULL, -- Серия паспорта
 passport_number VARCHAR(6) NOT NULL, -- Номер паспорта
 passport_issue_date DATE NOT NULL, -- Дата выдачи паспорта
 passport_issuing_authority VARCHAR(500) NOT NULL, -- Орган, выдавший паспорт
 address VARCHAR(1000) NOT NULL, -- Адрес проживания/регистрации
 phone_number VARCHAR(20) NOT NULL, -- Контактный телефон
 email VARCHAR(255) UNIQUE, -- Email (должен быть уникальным)
 client_type VARCHAR(10) NOT NULL CHECK (client_type IN ('ФЛ', 'ЮЛ', 'ИП')), -- Тип клиента
 inn VARCHAR(12) UNIQUE, -- ИНН (может быть null для ФЛ, но должен быть уникальным, если есть)
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Дата и время создания записи
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Дата и время последнего обновления
);

-- Индексы для таблицы Clients
CREATE INDEX IF NOT EXISTS idx_clients_full_name ON Clients (full_name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_passport_data ON Clients (passport_series, passport_number); -- Уникальный индекс по паспортным данным

-- Таблица КРЕДИТНЫЕ_ПРОГРАММЫ
CREATE TABLE IF NOT EXISTS CreditPrograms (
 program_id BIGSERIAL PRIMARY KEY, -- Уникальный идентификатор программы, автоинкремент
 program_name VARCHAR(255) UNIQUE NOT NULL, -- Название программы (должно быть уникальным)
 min_amount NUMERIC(18, 2) NOT NULL CHECK (min_amount > 0), -- Минимальная сумма кредита
 max_amount NUMERIC(18, 2) NOT NULL CHECK (max_amount > min_amount), -- Максимальная сумма кредита
 min_term_months INTEGER NOT NULL CHECK (min_term_months > 0), -- Минимальный срок в месяцах
 max_term_months INTEGER NOT NULL CHECK (max_term_months > min_term_months), -- Максимальный срок в месяцах
 interest_rate NUMERIC(5, 2) NOT NULL CHECK (interest_rate > 0), -- Процентная ставка
 description TEXT, -- Описание программы
 is_active BOOLEAN DEFAULT TRUE, -- Флаг активности программы
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Таблица ЗАЯВКИ
CREATE TABLE IF NOT EXISTS Applications (
 application_id BIGSERIAL PRIMARY KEY, -- Уникальный идентификатор заявки, автоинкремент
 client_id BIGINT NOT NULL REFERENCES Clients(client_id) ON DELETE CASCADE, -- Ссылка на клиента
 program_id BIGINT NOT NULL REFERENCES CreditPrograms(program_id), -- Ссылка на кредитную программу
 application_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Дата подачи заявки
 status VARCHAR(50) NOT NULL DEFAULT 'Новая' CHECK (status IN ('Новая', 'В проверке', 'Одобрена', 'Отказано', 'Закрыта')), -- Статус заявки
 requested_amount NUMERIC(18, 2) NOT NULL CHECK (requested_amount > 0), -- Запрошенная сумма кредита
 requested_term_months INTEGER NOT NULL CHECK (requested_term_months > 0), -- Запрошенный срок в месяцах
 status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Дата и время последнего обновления статуса
 inspector_comments TEXT, -- Комментарии инспектора
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для таблицы Applications
CREATE INDEX IF NOT EXISTS idx_applications_client_id ON Applications (client_id);
CREATE INDEX IF NOT EXISTS idx_applications_program_id ON Applications (program_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON Applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_date ON Applications (application_date);

-- Таблица СКОРИНГ
CREATE TABLE IF NOT EXISTS Scorings (
 scoring_id BIGSERIAL PRIMARY KEY, -- Уникальный идентификатор скоринга, автоинкремент
 application_id BIGINT UNIQUE NOT NULL REFERENCES Applications(application_id) ON DELETE CASCADE, -- Ссылка на заявку (одна заявка - один скоринг)
 scoring_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Дата проведения скоринга
 score_value INTEGER NOT NULL, -- Скоринговый балл
 risk_category VARCHAR(50) NOT NULL, -- Категория риска
 ai_recommendation VARCHAR(100) NOT NULL CHECK (ai_recommendation IN ('Одобрить', 'Отказать', 'Доп. проверка')), -- Рекомендация ИИ
 details_json JSONB, -- Детали скоринга в формате JSON
 ai_model_version VARCHAR(50), -- Версия модели ИИ
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для таблицы Scorings
CREATE INDEX IF NOT EXISTS idx_scorings_application_id ON Scorings (application_id);
CREATE INDEX IF NOT EXISTS idx_scorings_scoring_date ON Scorings (scoring_date);
CREATE INDEX IF NOT EXISTS idx_scorings_risk_category ON Scorings (risk_category);

-- Таблица РЕШЕНИЯ_ПО_ЗАЯВКАМ
CREATE TABLE IF NOT EXISTS ApplicationDecisions (
 decision_id BIGSERIAL PRIMARY KEY, -- Уникальный идентификатор решения, автоинкремент
 application_id BIGINT UNIQUE NOT NULL REFERENCES Applications(application_id) ON DELETE CASCADE, -- Ссылка на заявку (одно решение на заявку)
 decision_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Дата принятия решения
 decision_type VARCHAR(20) NOT NULL CHECK (decision_type IN ('Одобрено', 'Отказано')), -- Тип решения
 rejection_reason TEXT, -- Причина отказа (если отказано)
 approved_amount NUMERIC(18, 2), -- Одобренная сумма (если одобрено)
 approved_term_months INTEGER, -- Одобренный срок (если одобрено)
 approved_interest_rate NUMERIC(5, 2), -- Одобренная ставка (если одобрено)
 employee_id BIGINT, -- ID сотрудника, принявшего решение
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для таблицы ApplicationDecisions
CREATE INDEX IF NOT EXISTS idx_decisions_application_id ON ApplicationDecisions (application_id);
CREATE INDEX IF NOT EXISTS idx_decisions_decision_type ON ApplicationDecisions (decision_type);

-- Таблица КРЕДИТНЫЕ_ДЕЛА
CREATE TABLE IF NOT EXISTS CreditCases (
 case_id BIGSERIAL PRIMARY KEY, -- Уникальный идентификатор кредитного дела, автоинкремент
 application_id BIGINT UNIQUE NOT NULL REFERENCES Applications(application_id) ON DELETE CASCADE, -- Ссылка на заявку (одно дело на заявку)
 creation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Дата формирования дела
 initiator_employee_id BIGINT, -- ID сотрудника, инициировавшего формирование дела
 status VARCHAR(50) NOT NULL DEFAULT 'Сформировано' CHECK (status IN ('Сформировано', 'В работе', 'Закрыто')), -- Статус дела
 responsible_employee_id BIGINT, -- ID сотрудника, ответственного за дело
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для таблицы CreditCases
CREATE INDEX IF NOT EXISTS idx_credit_cases_application_id ON CreditCases (application_id);
CREATE INDEX IF NOT EXISTS idx_credit_cases_status ON CreditCases (status);

-- Таблица ДОКУМЕНТЫ
CREATE TABLE IF NOT EXISTS Documents (
 document_id BIGSERIAL PRIMARY KEY, -- Уникальный идентификатор документа, автоинкремент
 case_id BIGINT NOT NULL REFERENCES CreditCases(case_id) ON DELETE CASCADE, -- Ссылка на кредитное дело
 document_type VARCHAR(100) NOT NULL, -- Тип документа (например, 'Паспорт', 'Справка 2-НДФЛ')
 file_name VARCHAR(255) NOT NULL, -- Имя файла
 file_path VARCHAR(1000) NOT NULL, -- Путь к файлу в хранилище
 upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Дата загрузки
 file_size_bytes BIGINT, -- Размер файла в байтах
 file_hash VARCHAR(64), -- Хеш файла (например, SHA256 для проверки целостности)
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для таблицы Documents
CREATE INDEX IF NOT EXISTS idx_documents_case_id ON Documents (case_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON Documents (document_type);

-- Таблица КРЕДИТНЫЕ_ДОГОВОРЫ
CREATE TABLE IF NOT EXISTS CreditAgreements (
 agreement_id BIGSERIAL PRIMARY KEY, -- Уникальный идентификатор договора, автоинкремент
 decision_id BIGINT UNIQUE NOT NULL REFERENCES ApplicationDecisions(decision_id) ON DELETE CASCADE, -- Ссылка на решение (один договор на одобренное решение)
 signing_date DATE NOT NULL, -- Дата подписания договора
 agreement_number VARCHAR(100) UNIQUE NOT NULL, -- Номер договора (должен быть уникальным)
 electronic_agreement_path VARCHAR(1000), -- Путь к электронному договору
 signing_status VARCHAR(50) NOT NULL CHECK (signing_status IN ('Ожидает', 'Подписан ЭЦП', 'Отклонен')), -- Статус подписания
 agreement_amount NUMERIC(18, 2) NOT NULL, -- Сумма по договору
 agreement_term_months INTEGER NOT NULL, -- Срок по договору в месяцах
 agreement_interest_rate NUMERIC(5, 2) NOT NULL, -- Процентная ставка по договору
 created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для таблицы CreditAgreements
CREATE INDEX IF NOT EXISTS idx_agreements_decision_id ON CreditAgreements (decision_id);
CREATE INDEX IF NOT EXISTS idx_agreements_number ON CreditAgreements (agreement_number);

-- Insert sample data for CreditPrograms
INSERT INTO CreditPrograms (program_name, min_amount, max_amount, min_term_months, max_term_months, interest_rate, description) VALUES
('Потребительский кредит', 50000.00, 1000000.00, 6, 60, 12.5, 'Стандартный потребительский кредит на любые цели'),
('Ипотека', 1000000.00, 30000000.00, 60, 360, 7.8, 'Ипотечное кредитование на покупку жилья'),
('Автокредит', 300000.00, 5000000.00, 12, 84, 10.5, 'Кредит на покупку нового автомобиля'),
('Рефинансирование', 100000.00, 3000000.00, 12, 120, 9.0, 'Программа рефинансирования существующих кредитов');

-- Insert sample data for Clients
INSERT INTO Clients (full_name, date_of_birth, passport_series, passport_number, passport_issue_date, passport_issuing_authority, address, phone_number, email, client_type, inn) VALUES
('Иванов Иван Иванович', '1985-07-15', '1234', '567890', '2010-08-20', 'Отделом УФМС России по г. Москва', 'г. Москва, ул. Пушкина, д. 10, кв. 55', '+7(999)123-45-67', 'ivanov@example.com', 'ФЛ', '123456789012'),
('Петров Петр Петрович', '1978-04-22', '4567', '123456', '2005-05-15', 'Отделом УФМС России по г. Санкт-Петербург', 'г. Санкт-Петербург, пр. Невский, д. 100, кв. 75', '+7(999)765-43-21', 'petrov@example.com', 'ФЛ', '987654321098'),
('ООО "Ромашка"', '1995-10-10', '0000', '000000', '1995-10-10', 'МНС России', 'г. Москва, ул. Цветочная, д. 15', '+7(495)111-22-33', 'romashka@example.com', 'ЮЛ', '5678901234');

-- Insert sample data for Applications
INSERT INTO Applications (client_id, program_id, application_date, status, requested_amount, requested_term_months, inspector_comments) VALUES
(1, 1, '2023-01-10', 'Новая', 500000.00, 24, 'Первичное обращение'),
(2, 2, '2023-02-15', 'В проверке', 5000000.00, 240, 'Требуется дополнительная проверка документов'),
(3, 4, '2023-03-01', 'Одобрена', 2000000.00, 60, 'Все документы проверены');

-- Insert sample data for Scorings
INSERT INTO Scorings (application_id, score_value, risk_category, ai_recommendation, details_json, ai_model_version) VALUES
(1, 750, 'Средний', 'Одобрить', '{"income_factor": 0.8, "credit_history": "good", "debt_ratio": 0.3}', 'v2.1'),
(2, 810, 'Низкий', 'Одобрить', '{"income_factor": 0.9, "credit_history": "excellent", "debt_ratio": 0.15}', 'v2.1'),
(3, 650, 'Высокий', 'Доп. проверка', '{"income_factor": 0.6, "credit_history": "fair", "debt_ratio": 0.5}', 'v2.1');

-- Insert sample data for ApplicationDecisions
INSERT INTO ApplicationDecisions (application_id, decision_type, rejection_reason, approved_amount, approved_term_months, approved_interest_rate, employee_id) VALUES
(1, 'Одобрено', NULL, 450000.00, 24, 13.0, 1),
(2, 'Одобрено', NULL, 4800000.00, 240, 8.2, 2),
(3, 'Отказано', 'Высокая закредитованность клиента', NULL, NULL, NULL, 1);
