# CrismaApp

O CrismaApp é um projeto pessoal voltado para a organização e controle da frequência dos crismandos do ano de 2024.

## Funcionalidades

- Busca de frequência a partir do nome e data de nascimento do crismando;
- Área de administração restrita;
- Cadastro, atualização e exclusão de crismandos;
- Controle da frequência dos domingos e encontros;
- Geração de tabela excel com todos os dados.

## Tecnologias usadas

- Python;
- Framework Flask;
- Bcrypt, para criptografia;
- Peewee, como *Object Relational Mapping*;
- Dotenv;
- waitress como servidor WSGI;
- pandas para a geração do arquivo.

## Instalação

### Requerimentos

Para instalar esse projeto você precisa ter o [Docker Desktop](https://docs.docker.com/get-docker/) e o Git instalados em sua máquina.

### Passo a Passo

1. Clone o projeto:

    ```
    git clone https://github.com/Felifelps/CrismaApp CrismaApp
    ```

2. Entre na pasta do projeto e rode o seguinte comando para gerar sua senha:

    ```
    python generate_env.py <sua-senha>
    ```

3. Rode o comando:

    ```
    docker compose up -d
    ```

> [!NOTE]
> Quando trocar de senha, rode `docker compose up -d --build` após a alteração para que a nova senha seja salva

4. Acesse [esse link](http://localhost:8080)

> [!NOTE]
> Caso não apareça, recarregue na página algumas vezes

5. Caso queira desligar o servidor use:

    ```
    docker compose down
    ```

## Contribuição

Fique à vontade para fazer Forks e várias Pull Requests. Estou aberto a sugestões e melhorias.