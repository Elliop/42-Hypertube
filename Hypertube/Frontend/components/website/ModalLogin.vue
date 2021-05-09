<template>
  <v-dialog max-width="550px" v-model="dialog">
<!-- Snack Bar -->
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
<!-- Modal activator -->
    <template v-slot:activator="{ on }">
      <v-btn depressed slot="activator" v-on="on" color="primary" outlined>
        <span>LOG IN</span>
        <v-icon right>mdi-login-variant</v-icon>
      </v-btn>
    </template>
<!-- Modal Content -->
    <v-card color="accent">
      <v-card-title class="pb-2">
        <v-toolbar-title>{{registerTitle()}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- x -->
        <v-btn icon depressed slot="activator" v-on:click="dialog = !dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <!-- Form -->
      <v-card-text class="pt-2">
        <!-- Login -->
        <template v-if="status == `login`">
          <v-form v-model="valid" ref="register" method="post">
            <v-text-field v-model="login.username" outlined label="Username" type="text" :rules="usernameRules" required></v-text-field>
            <v-text-field v-model="login.password" outlined label="Password" type="password" :rules="passwordRules" required></v-text-field>
            <v-btn width="100%" @click="ft_login" color="primary" :disabled="!valid">LOGIN</v-btn>
          </v-form>
          <!-- Trouble -->
          <v-container fluid>
            <v-row justify="space-around" no-gutters>
              <a href="http://localhost:3000/auth/42"><v-btn><v-icon>42</v-icon></v-btn></a>
              <a href="http://localhost:3000/auth/google"><v-btn><v-icon>mdi-google</v-icon></v-btn></a>
              <a href="http://localhost:3000/auth/github"><v-btn><v-icon>mdi-github</v-icon></v-btn></a>
              <a href="http://localhost:3000/auth/gitlab"><v-btn><v-icon>mdi-gitlab</v-icon></v-btn></a>
            </v-row>
          </v-container>
          <v-container fluid>
            <v-row justify="space-around" no-gutters>
              <v-col align="end" justify="center">
                <h2 class="body-2" style="text-decoration: underline; cursor: pointer" @click="Trouble" >Trouble Logging In?</h2>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <!-- Recover Account -->
        <v-form v-else-if="status == `recover`" v-model="valid" ref="register">
          <v-text-field v-model="forget.username" outlined label="Username" type="text" :rules="usernameRules" required></v-text-field>
          <v-text-field v-model="forget.email" outlined label="Email Address" :rules="emailRules" type="email"></v-text-field>
          <v-btn @click="ft_forget" width="100%" :disabled="!valid" color="primary">RECOVER ACCOUNT</v-btn>
        </v-form>
        <!-- Register -->
        <v-form v-else-if="status == `register`" v-model="valid" ref="register">
          <v-text-field v-model="firstName" outlined label="First Name" type="text" :rules="FirstNameRules" required></v-text-field>
          <v-text-field v-model="lastName" outlined label="Last Name" type="text" :rules="LastNameRules" required></v-text-field>
          <v-text-field v-model="username" outlined label="Username" type="text" :rules="usernameRules" required></v-text-field>
          <v-text-field v-model="email" outlined label="Email Address" type="email" :rules="emailRules" required></v-text-field>
          <v-text-field v-model="password" outlined label="Password" type="password" :rules="passwordRules" required></v-text-field>
          <v-file-input v-model="image" :rules="picRules" accept="image/png, image/jpeg, image/jpg" placeholder="Pick an avatar" prepend-icon="mdi-camera" label="Avatar"></v-file-input>
          <v-btn @click="ft_register" width="100%" :disabled="!valid" color="primary">SIGN UP</v-btn>
        </v-form>
        <!-- Have or Don't -->
        <v-container grid-list-md fluid class="pt-4 mt-3">
          <v-row>
            <h2>{{wanaSR()}}</h2>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="general" >{{buttonSR()}}</v-btn>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      login: {},
      forget: {},
      valid: true,
      dialog: false,
      remember: false,
      snackbar: false,
      timeout: 8000,
      status: "login",
      text: '',
      image: [],
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      ///// Rules /////
      FirstNameRules: [
        v => !!v || 'First Name is required',
        v => (v && v.length <= 20) || 'First Name must be less than 20 characters',
      ],     
      LastNameRules: [
        v => !!v || 'Last Name is required',
        v => (v && v.length <= 20) || 'First Name must be less than 20 characters',
      ],
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length <= 100) || 'Username must be less than 100 characters',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length > 7) || 'Password must be more than 8 characters',
        v => /[A-Z]/.test(v) || 'Password must be valid',
        v => /[a-z]/.test(v) || 'Password must be valid',
        v => /[0-9]/.test(v) || 'Password must be valid',
      ],
      picRules: [
        value => !!value || 'Avatar is required',
        value => !value || value.size < 2000000 || "Image size should be less than 2 MB!"
      ],
      ///// Title /////
      registerTitle: function() {
        switch (this.status) {
          case "login":
            return "Login";
          case "recover":
            return "Recover Your Account";
          case "register":
            return "Sign up";
        }
      },
      ///// Mdf /////
      SRwith: function() {
        return this.status == "login" ? "Login With" : "Sign Up With";
      },
      wanaSR: function() {
        return this.status == "login" ? "Don't have an account?" : "Already Have An Account?";
      },
      buttonSR: function() {
        return this.status == "login" ? "Sign Up" : "Login";
      },
    };
  },
  methods: {
    general: function() {
      this.status == `login` ? this.status = `register` : this.status = `login`
      this.$refs.register.reset();
    },
    Trouble: function() {
      this.status = "recover";
    },
    reset () {
      this.$refs.form.reset()
    },
    ft_login: async function() {
      const respons = await this.login_req();
      if (respons.res)
        this.text = "Connected !"
      else
      {
        this.text = respons.err.response.data.error[0]
        this.snackbar = true;
      }
    },
    ft_register: async function() {
      const respons = await this.register_req();
      if (respons.res)
      {
        this.snackbar = true;    
      }
      else
      {
        this.text = respons.err.response.data.error[0]
        this.snackbar = true;
      }
    },
    ft_forget: async function() {
      const respons = await this.forget_req();
      if (respons.res)
      {
        this.snackbar = true;
      }
      else
      {
        this.text = respons.err.response.data.error[0]
        this.snackbar = true;
      }
    },
    login_req: async function() {
      return axios.post('http://localhost:3000/login', this.login)
      .then((res) => {
        this.$cookies.set('token', res.data.data[0].token, {})
        this.$router.push("/profile");
        return { res }
      })
      .catch(function(err) {
        return { err }
      })
    },
    register_req: async function() {
      const formData = new FormData();
      formData.append('firstname', this.firstName);
      formData.append('lastname', this.lastName);
      formData.append('username', this.username);
      formData.append('email', this.email);
      formData.append('password', this.password);
      formData.append('picture', this.image);
        return axios.post('http://localhost:3000/register', formData)
        .then((res) => {
          this.text = res.data.alert[1]
          return { res }
        })
        .catch(function(err) {
          return { err }
        })
    },
    forget_req: async function() {
      return axios.put('http://localhost:3000/reset', this.forget)
      .then((res) => {
        this.text = res.data.alert[1]
        return { res }
      })
      .catch(function(err) {
        return { err }
      })
    },
  }
};
</script>