import type { User, UserEdit } from "@/interface/user";
import axios from "axios";

const getUsers = axios.get('http://localhost:8080/usuarios')
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        return error
    })

const getLoginUser = (email: string) => axios.get(`http://localhost:8080/usuarios/${email}`)
    .then(function (response) {
        return response
    })
    .catch(function (error) {
        return error
    })

const postUser = (user: User) => axios.post('http://localhost:8080/usuarios', user, {
}).then(function (response) {
    return response.data && response.status
}).catch(function (error) {
    return error
})

const pathUser = (user: UserEdit) => axios.patch(`http://localhost:8080/usuarios/${user.ID}`, user, {
}).then(function (response) {
    return response.status
}).catch(function (error) {
    return error
})

const deletetUser = (id: number) => axios.delete(`http://localhost:8080/usuarios/${id}`).catch(function (error) {
    return error
})

export {
    getUsers,
    getLoginUser,
    postUser,
    pathUser,
    deletetUser
}