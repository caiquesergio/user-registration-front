<template>
  <v-container grid-list-md>
    <v-row class="justify-center">
      <v-col cols="6">
        <v-form ref="form" @submit.prevent>
          <v-text-field v-model="email" label="Email" :rules="[rules.emailMatch, rules.required]"></v-text-field>
          <v-text-field v-model="pswd" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]" :type="show1 ? 'text' : 'password'" hint="minimo 8 caracteres"
            label="Senha" name="input-10-1" counter @click:append="show1 = !show1"></v-text-field>

          <v-btn :loading="loading" class="mt-2" text="Entrar" type="submit" @click="Login"></v-btn>
          <v-btn class="mt-2 ml-5" text="Cadastrar um usuário" @click="goToRegistration"></v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getLoginUser } from '@/services/users.service';
export default {
  setup() {
    const router = useRouter()
    const email = ref('')
    const pswd = ref('')
    const loading = ref(false)
    const show1 = ref(false)
    const show2 = ref(false)
    const rules = {
      required: value => !!value || 'Obrigatorio.',
      min: v => v.length >= 8 || 'Min 8 caracteres',
      emailMatch: v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail invalido',
    }

    async function Login() {
      loading.value = true;

      if (email.value !== "" && pswd.value !== "") {
        await getLoginUser(email.value).then((res) => {
          if (res.status === 200) {
            router.push({ name: 'listUsers', query: { user: res.data.isAdmin } });
          }
        })
      }
      loading.value = false;
    }

    async function goToRegistration() {
      await router.push({ name: 'registration' });
    }

    return {
      email,
      pswd,
      rules,
      loading,
      show1,
      show2,
      goToRegistration,
      Login
    }
  },
}
</script>