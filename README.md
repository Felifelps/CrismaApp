# CrismaApp

CrismaApp is an organizational web app designed to manage the attendance of the Confirmation Group.

## Functionalities

- Search frequency by name
- Administration area protected with password
- CRUD operations for confirmation candidates
- CRUD operations for meeting frequencies
- Generation of Excel tables
- Download photos from data tables
- Export data in CSV format

## Technologies

### Backend
- Python
- Flask
- Bcrypt
- Peewee
- Dotenv
- waitress
- pandas

### Frontend
- React
- TypeScript
- React Router
- html2canvas
- file-saver
- SweetAlert2

## Installation

To install this project:

1. Clone this project:

    ```shell
    git clone https://github.com/Felifelps/CrismaApp CrismaApp
    ```

2. Backend setup:

    - Navigate to the `backend` directory:

        ```shell
        cd CrismaApp/backend
        ```

    - Generate your password with:

        ```shell
        python generate_env.py
        ```

    - To run the backend server:

        - Using Docker Compose:

            ```shell
            docker-compose up -d
            ```

            To stop the server, run:

            ```shell
            docker-compose down
            ```

        - or run `python app.py`

3. Frontend setup:

    - Navigate to the `frontend` directory:

        ```shell
        cd ../frontend
        ```

    - Install dependencies:

        ```shell
        npm install
        ```

    - Start the development server:

        ```shell
        npm start
        ```

4. Access [this link](http://localhost:8080) for the backend and [this link](http://localhost:3000) for the frontend.

> [!NOTE]
> Reload the page if necessary.

## Contribution

Fork this repository, make your changes, and submit a pull request. I'll review it as soon as possible.