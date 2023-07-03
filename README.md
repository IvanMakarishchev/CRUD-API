# CRUD-API

## Install

Run command in your terminal:

```
git clone -b develop https://github.com/IvanMakarishchev/CRUD-API.git
```

---

## How to use

### Get users:

Use GET method and endpoint:

```
api/users
```

### Get specific user:

Use GET method and endpoint:

```
api/users/{userId}
```

### Add user to database:

Use POST method and endpoint:

```
api/users
```

Use next body scheme:

```
{
  "username": string,
  "age": number,
  "hobbies": Array<string>
}
```
### Change user on database:

Use PUT method and endpoint:

```
api/users/{userId}
```

Use next body scheme:

```
{
  "username": string,
  "age": number,
  "hobbies": Array<string>
}
```
### Delete user:

Use DELETE method and endpoint:

```
api/users/{userId}
```