# CrismaApp

CrismaApp is an organizational web app designed to manage the attendance of the Confirmation Group.

## Funcionalidades (Functionalities)

- Search frequency by name
- Administration area protected with password
- CRUD operations for confirmation candidates
- CRUD operations for meeting frequencies
- Generation of Excel tables

## Technologies

- Python
- Flask
- Bcrypt
- Peewee
- Dotenv
- waitress
- pandas

## Installation

To install this project:

1. Clone this project:

    ```shell
    git clone https://github.com/Felifelps/CrismaApp CrismaApp
    ```

2. In the project directory, generate your password with:

    ```shell
    python generate_env.py
    ```

3. To run the server:

    - Using Docker Compose:

        ```shell
        docker-compose up -d
        ```

        To stop the server, run:

        ```shell
        docker-compose down
        ```

    - or run `python app.py`

4. Access [this link](http://localhost:8080)

> [!NOTE]
> Reload the page if necessary.

## Contribution

Fork this repository, make your changes, and submit a pull request. I'll review it as soon as possible.
