<template>
    <v-row class="pa-16">
        <v-btn class="mb-5" outline color="primary" dark @click="goToHome">Voltar para home</v-btn>
        <v-data-table :headers="headers" :items="listUsers" :sort-by="[{ key: 'name', order: 'asc' }]">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Lista de Usuarios</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="1000px">
                        <template v-slot:activator="{ props }">
                            <v-btn class="mb-2" color="primary" dark v-bind="props">
                                Novo Usuario
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-text-field v-model="editedItem.nome" label="Nome"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-text-field v-model="editedItem.telefone" label="Telefone"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="6" sm="6">
                                            <v-text-field v-model="editedItem.endereco" label="Endereço"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click="close">
                                    Cancelar
                                </v-btn>
                                <v-btn color="blue-darken-1" variant="text" @click="save">
                                    Salvar
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete" max-width="500px">
                        <v-card>
                            <v-card-title class="text-h5">Deseja excluir este usuario?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancelar</v-btn>
                                <v-btn color="blue-darken-1" variant="text"
                                    @click="deleteItemConfirm(listUsers)">Sim</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon class="me-2" size="small" @click="editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon v-if="admin === 'Admin'" size="small" @click="deleteItem(item)">
                    mdi-delete
                </v-icon>
            </template>
            <template v-slot:no-data>
                Nenhum usuario encontrado
            </template>
        </v-data-table>
    </v-row>
</template>

<script>
import { getUsers, pathUser, deletetUser, postUser } from '@/services/users.service';
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
export default {
    setup() {
        const route = useRoute()
        const router = useRouter()
        const dialog = ref(false)
        const dialogDelete = ref(false)
        const headers = ref([
            {
                title: 'Nome',
                align: 'start',
                key: 'nome',
            },
            { title: 'Email', align: 'start', key: 'email' },
            { title: 'Telefone', align: 'start', key: 'telefone' },
            { title: 'Endereço', align: 'start', key: 'endereco' },
            { title: 'É admin', align: 'start', key: 'isAdmin' },
            { title: 'Ações', align: 'start', key: 'actions', sortable: false },
        ])
        const listUsers = ref([])
        const editedIndex = ref(-1)
        const editedItem = ref({
            nome: '',
            email: "",
            telefone: null,
            endereco: "",
        })
        const defaultItem = ref({
            nome: '',
            email: "",
            telefone: null,
            endereco: "",
        })
        const isAdmin = ref(false)

        onMounted(async () => {
            listUsers.value = await getUsers;
        })

        const formTitle = computed(() => {
            return editedIndex.value === -1 ? 'Novo usuario' : 'Edit usuario'
        })

        const admin = computed(() => {
            return route.query.user == 'true' ? 'Admin' : 'notAdmin'
        })

        function editItem(item) {
            editedIndex.value = listUsers.value.indexOf(item)
            editedItem.value = Object.assign({}, item)
            dialog.value = true
        }

        function deleteItem(item) {
            editedIndex.value = listUsers.value.indexOf(item)
            editedItem.value = Object.assign({}, item)
            dialogDelete.value = true
        }

        async function deleteItemConfirm() {
            await deletetUser(editedItem.value.ID).then((res) => {
                if (res.status === 200) {
                    listUsers.value.splice(editedIndex.value, 1)
                    closeDelete()
                }
            })
        }

        function close() {
            dialog.value = false
            nextTick(() => {
                editedItem.value = Object.assign({}, defaultItem.value)
                editedIndex.value = -1
            })
        }

        function closeDelete() {
            dialogDelete.value = false
            nextTick(() => {
                editedItem.value = Object.assign({}, defaultItem.value)
                editedIndex.value = -1
            })
        }

        async function save() {
            if (editedIndex.value > -1) {
                Object.assign(listUsers.value[editedIndex.value], editedItem.value)
                await pathUser(editedItem.value)
            } else {
                await postUser(editedItem.value)
                listUsers.value.push(editedItem.value)
            }
            close()
        }

        function goToHome() {
            router.push({ name: "home" })
        }

        return {
            dialog,
            dialogDelete,
            headers,
            listUsers,
            editedIndex,
            editedItem,
            defaultItem,
            formTitle,
            editItem,
            deleteItem,
            deleteItemConfirm,
            close,
            closeDelete,
            isAdmin,
            admin,
            save,
            goToHome
        }
    },
}
</script>