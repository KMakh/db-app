# Система управления кредитными заявками

Приложение для управления процессом кредитования, включающее работу с клиентами, кредитными программами и заявками. Технологии:

- PostgreSQL база данных
- Node.js и Express для серверной части
- HTML, CSS и JavaScript для клиентской части
- Docker и Docker Compose для развертывания

## Возможности

- CRUD операции для клиентов, кредитных программ и заявок
- Поиск и сортировка данных
- Комплексное отображение данных связанных таблиц на одной форме
- Отслеживание полного цикла кредитной заявки от создания до подписания договора
- Скоринг и принятие решений по кредитным заявкам
- Управление документами
- Удобный пользовательский интерфейс с модальными окнами

## Requirements

- Docker and Docker Compose

## Setup Instructions

1. Clone or download this repository
2. Navigate to the project directory
3. Run the application using Docker Compose:

```
docker-compose up
```

4. Once the application is running, open your browser and go to: http://localhost:3000

## Структура базы данных

Приложение использует следующие связанные таблицы:

- **Clients**: Информация о клиентах
  - client_id (Primary Key)
  - full_name, date_of_birth, passport_series, passport_number и другие данные клиента
  - client_type (ФЛ, ЮЛ, ИП)

- **CreditPrograms**: Кредитные программы
  - program_id (Primary Key)
  - program_name, min_amount, max_amount, interest_rate и другие параметры

- **Applications**: Кредитные заявки
  - application_id (Primary Key)
  - client_id (Foreign Key к Clients)
  - program_id (Foreign Key к CreditPrograms)
  - application_date, status, requested_amount и другие данные по заявке

- **Scorings**: Результаты скоринга
  - scoring_id (Primary Key)
  - application_id (Foreign Key к Applications)
  - score_value, risk_category, ai_recommendation и другие данные скоринга

- **ApplicationDecisions**: Решения по заявкам
  - decision_id (Primary Key)
  - application_id (Foreign Key к Applications)
  - decision_type, approved_amount, approved_interest_rate и другие данные решения

- **CreditCases**: Кредитные дела
  - case_id (Primary Key)
  - application_id (Foreign Key к Applications)
  - status и другие данные по делу

- **Documents**: Документы по кредитному делу
  - document_id (Primary Key)
  - case_id (Foreign Key к CreditCases)
  - document_type, file_path, file_size_bytes и другие данные о документе

- **CreditAgreements**: Кредитные договоры
  - agreement_id (Primary Key)
  - decision_id (Foreign Key к ApplicationDecisions)
  - agreement_number, signing_date, signing_status и другие данные договора

## Usage

- Switch between Employees and Departments using the tabs at the top
- Use the search box to find employees by name or email
- Sort employees by different fields
- Add, edit, or delete records using the action buttons

## Development

To make changes to the application:

- Backend code is in `app/server.js`
- Frontend HTML is in `app/public/index.html`
- Frontend CSS is in `app/public/css/styles.css`
- Frontend JavaScript is in `app/public/js/script.js`
- Database initialization script is in `init-db/01-init.sql`
