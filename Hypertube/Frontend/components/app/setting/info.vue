<template>
    <v-col>
        <!-- Snack Bar -->
            <div class="text-center">
                <v-snackbar v-model="snackbar" :timeout="timeout">
                    {{ text }}
                    <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
                </v-snackbar>
            </div>
        <!-- Modal activator -->
        <v-card color="accent">
            <v-form v-model="valid">
                <v-row style="margin: 4vh 0 0 0; padding: 2vh 0 0 0;">
                    <v-text-field v-model="FirstName" outlined label="First Name" type="text" required :rules="FirstNameRules" style="margin: 0 1vh 0 1vh"></v-text-field>
                    <v-text-field v-model="LastName" outlined label="Last Name" type="text" required :rules="LastNameRules" style="margin: 0 1vh 0 1vh"></v-text-field>
                    <v-text-field v-model="Username" outlined label="Username" type="text" required :rules="usernameRules" style="margin: 0 1vh 0 1vh"></v-text-field>
                </v-row>
                <v-row style="margin: 4vh 0 0 0; padding: 2vh 0 0 0;">
                    <v-text-field v-model="Email" outlined label="Email" type="email" required :rules="emailRules" style="margin: 0 1vh 0 1vh"></v-text-field>
                    <v-menu offset-y >
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" class="mx-5 mt-2">Langueage</v-btn>
                        </template>
                        <v-list>
                            <v-list-item v-for="(item, index) in btns" :key="index">
                                <v-btn @click="() => vl = item.vl">{{ item.title }}</v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-row>
                <v-row style="margin: 4vh 0 0 0; padding: 2vh 0 0 0;">
                    <v-text-field v-model="Password" outlined label="Password" type="password" required style="margin: 0 1vh 0 1vh"></v-text-field>
                </v-row>
                <v-row  style="margin: 2vh 0 0 0; padding: 0 0 2vh 0;">
                    <v-btn color="primary" @click="ft_update" width="95%" style="margin: 0 1vh 0 1vh" :disabled="!valid">Save</v-btn>
                </v-row>
            </v-form>            
        </v-card>
    </v-col>
</template>

<script>
import jwt_decode from 'jwt-decode';
import axios from "axios";
  export default {
    data: () => ({
        btns: [
            { title: 'ENGLISH', vl: "0" },
            { title: 'FRENCH', vl: "1" },
            { title: 'ARABIC', vl: "2" },
        ],
        snackbar: false,
        timeout: 8000,
        text: '',
        valid: true,
        ///// Default /////
        FirstName: "",
        LastName: "",
        Username: "",
        Password: "",
        Email: "",
        Pic: "",
        vl: "",
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
    }),
    methods: {
        ft_update: async function() {
            const respons = await this.update_req();
            if (respons.res)
            {
                this.text = "Profile Updated!"
                this.snackbar = true;                
            }
            else
            {
                this.text = "Invalid Params!"
                this.snackbar = true;
            }
        },
        update_req: async function() {
            var token = this.$cookies.get('token');
            const formData = new FormData();
            formData.append('firstname', this.FirstName);
            formData.append('lastname', this.LastName);
            formData.append('username', this.Username);
            formData.append('email', this.Email);
            formData.append('picture', this.Pic);
            formData.append('password', this.Password);
            formData.append('language', this.vl);
            return axios({
                method: 'put',
                url: `http://localhost:3000/user/`,
                data: formData,
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then((res) => {
                this.$cookies.set('token', res.data.data[0].token, {})
                return { res }
            })
            .catch(function(err) {
                return { err }
            })
        },
    },
    mounted() {
        var token = this.$cookies.get('token');
        var decoded = jwt_decode(token);
        axios({
            method: 'get',
            url: `http://localhost:3000/user/${decoded.username}`,
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then((res) => {
            this.FirstName = res.data.data[0].firstname;
            this.LastName = res.data.data[0].lastname;
            this.Username = res.data.data[0].username;
            this.Email = res.data.data[0].email;
            this.vl = res.data.data[0].language;
            if (res.data.data[0].picture)
            this.Pic = `http://localhost:3000/img/${res.data.data[0].picture}`;
            else
            this.Pic = `https://image.flaticon.com/icons/svg/149/149071.svg`;
        })
        .catch(function(err) {
            return { err }
        })
    },
}
</script>