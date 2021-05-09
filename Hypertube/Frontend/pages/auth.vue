<template>
  <v-app>
    <Navbar />
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="error" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
    <Background />
    <Footer />
  </v-app>
</template>
<script>alert("dddd");</script>

<script>
import axios from "axios";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import Background from "@/components/website/Background";

export default {
  components: { Navbar, Footer, Background },
  data: () => ({
    snackbar: false,
    timeout: 8000,
    text: '',
  }),
    mounted() {
        const params = new URL(document.location).searchParams;
        const token = params.get('token');
        const message = params.get('message');
        if (token)
        {
            this.$cookies.set('token', token, {})
            this.$router.push("/profile");
        }
        else
        {
            this.snackbar = true;
            this.text = message;
        }
    },
  }
</script>