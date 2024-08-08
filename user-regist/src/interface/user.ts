export interface User {
    nome: string
    senha: string
    endereco?: string
    telefone?: number
    email?: string
    isAdmin: boolean
}

export interface UserEdit {
    ID: number,
    nome?: string
    endereco?: string
    telefone?: number
    email?: string
}