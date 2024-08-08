<template>
  <v-container grid-list-md>
    <v-row class="justify-center">
      <v-col cols="6">
        <v-form ref="form" @submit.prevent>
          <v-text-field v-model="nome" label="Nome" :rules="[rules.required]"></v-text-field>
          <v-text-field v-model="pswd" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" hint="minimo 8 caracteres"
            label="Senha" name="input-10-1" counter @click:append="show1 = !show1"></v-text-field>
          <v-text-field v-model="endereco" label="Endereço"></v-text-field>
          <v-text-field v-model="telefone" label="Telefone"></v-text-field>
          <v-text-field v-model="email" label="Email" :rules="[rules.emailMatch]"></v-text-field>
          <v-radio-group inline v-model="radio" :rules="[rules.required]">
            <v-radio label="Admin" value="one"></v-radio>
            <v-radio label="Colaborador" value="two"></v-radio>
          </v-radio-group>

          <v-btn class="mt-2" text="Cadastrar usuário" block type="submit" @click="sendCollaborator"></v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { postUser } from '@/services/users.service';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const nome = ref('')
    const pswd = ref('')
    const endereco = ref('')
    const telefone = ref(null)
    const email = ref('')
    const isAdmin = ref(false)
    const radio = ref('')
    const show1 = ref(false)
    const show2 = ref(false)
    const rules = {
      required: value => !!value || 'Obrigatorio.',
      min: v => v.length >= 8 || 'Min 8 caracteres',
      emailMatch: v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail invalido',
    }

    async function sendCollaborator() {
      const user = {
        nome: nome.value,
        senha: pswd.value,
        endereco: endereco.value,
        telefone: telefone.value,
        email: email.value,
        isAdmin: radio.value === "one" ? !isAdmin.value : isAdmin.value
      }
      if (user.nome !== "" && user.senha !== "" && user.email !== "" && user.isAdmin !== "") {
        await postUser(user).then((res) => {
          if (res === 200) {
            router.push({ name: 'home' });
          }
        });
      }
    }

    return {
      nome,
      pswd,
      endereco,
      telefone,
      email,
      isAdmin,
      radio,
      rules,
      show1,
      show2,
      sendCollaborator,
    }
  },

}
</script>