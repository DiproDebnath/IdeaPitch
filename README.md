# IdeaPitch
 IdeaPitch is an app where anyone can pitch their idea and raise funds to give life to the idea.


## Installation

Install dependencies

```bash
  npm install
```

Change database information from `app-directory/config/config.json`
```json
    {
    "username": "root",
    "password": "root",
    "database": "ideaPitch",
    "host": "127.0.0.1",
    "dialect": "mysql"
    }
```

Create database 

```bash
  npx sequelize-cli db:create
```

Run database migration

```bash
  npx sequelize-cli db:migrate
```

Create admin wih database Seeder 

```bash
  npx sequelize-cli db:seed:all
```

Start the server

```bash
  npm run dev
```

if face any sql error while fetching api, disable `only_full_group_by` from the mysql global variable. 
[check to the documantation](https://support.cpanel.net/hc/en-us/articles/360050889873-How-do-I-disable-ONLY-FULL-GROUP-BY-in-MySQL-)


## Admin info

```bash
  username: "admin"
  password: "Admin1234"

```





## API Reference

### Auth route

#### Sign up


```http
  POST /signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Your username |
| `password` | `string` | **Required**. Your password |

Create an user and returns user info with access token.


#### Sign in

```http
  POST /signin
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username` | `string` | **Required**. Your username |
| `password` | `string` | **Required**. Your password |

Returns user info with access token.



### Idea route

#### Create Idea

```http
  POST /idea/create
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `title`       | `string` | **Required**. Title of an Idea  |
| `description` | `string` | **Required**. Description of an idea |
| `budget`      | `number` | **Required**. Idea budget |
| `thumbnail`   | `file`   | **Required**. Thumbnail picture of an idea |



Returns idea object.

#### Update Idea

```http
  POST /idea/id/update
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `id`          | `string` |  **Required**. id of an idea  |
| `title`       | `string` |  Title of an Idea  |
| `description` | `string` |  Description of an idea |
| `budget`      | `number` |  Idea budget |
| `thumbnail`   | `file`   |  Thumbnail picture of an idea |



Returns idea object.


#### Delete Idea

```http
  GET /idea/id/delete
```
| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `id`          | `string` |  **Required**. id of an idea  |





#### Clap an Idea

```http
  POST /idea/clap
```
| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `claps`          | `number` |  **Required**. number of claps for an idea  |
| `ideaId`          | `number` |  **Required**. id of an idea  |

Returns number of claps of the user for an idea .


#### Fund an Idea

```http
  POST /idea/sendFund
```
| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `amount`          | `number` |  **Required**.  amount of fund you want to send to an idea  |
| `ideaId`          | `number` |  **Required**. id of an idea  |

Returns idea fund object .


#### Refund from an Idea

```http
  GET /idea/id/returnFund
```
| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `id`          | `string` |  **Required**. id of an idea  |

Returns user fund object .

### Admin route

#### Get all Idea

```http
  GET /admin/idea
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |


Returns Array of Idea  objects .

#### Get Idea by Id

```http
  GET /admin/idea/id
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `id`          | `string` |  **Required**. id of an idea  |

Returns a Idea object .

#### Approve an Idea

```http
  GET /admin/idea/id/approve
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `id`          | `string` |  **Required**. id of an idea  |

Returns a Idea object.


#### Reject an Idea

```http
  POST /admin/idea/id/reject
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `id`          | `string` |  **Required**. id of an idea  |
| `note`          | `string` |  **Required**. reason(s) to reject an idea  |

Returns a Idea object.

### User route


#### Get idea created by user

```http
  GET /user/profile
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |


Returns user profile objects .


#### Get idea created by user

```http
  GET /user/idea/own_idea
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |


Returns Array of Idea  objects created by the user .



#### Get idea funded by user

```http
  GET /user/idea/funded_idea
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |


Returns Array of Idea objects funded by the user .


#### Get idea by Id 

```http
  GET /user/idea/id
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `id`          | `string` |  **Required**. id of an idea  |


Returns an Idea objects.

#### Get claps number of an idea of the user

```http
  GET /user/idea/id/getclap
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `token`          | `string` |  **Required**. Access Token  |
| `id`          | `string` |  **Required**. id of an idea  |


Returns an claps number of an idea of the user.


### Public route

#### Get user by Id

```http
  GET /user/id
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `id`          | `string` |  **Required**. id of an user  |


#### Get all Idea

```http
  GET /idea
```


Returns Arrays of approved Idea  object .

#### Get Idea by Id

```http
  GET /idea/id
```

| Parameter     | Type     | Description                       |
| :--------     | :------- | :-------------------------------- |
| `id`          | `string` |  **Required**. id of an idea  |

Returns an approved Idea  object .