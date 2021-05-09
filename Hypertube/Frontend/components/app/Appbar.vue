<template>
  <div>
    <v-app-bar app color="accent" flat hide-on-scroll class="hidden-sm-and-down">
        <n-link to="/hypertube">
            <v-hover v-slot:default="{ hover }">
                <v-toolbar-title class="logo secondary--text transition-fast-in-fast-out" :style="hover ? 'font-size: 30px;' : null">
                    <v-icon class="pr-2" color="secondary" large>mdi-movie-open</v-icon>
                    <span class="font-weight-light">HYPER</span>
                    <span>TUBE</span>
                </v-toolbar-title>
            </v-hover>
        </n-link>
        <v-spacer></v-spacer>
        <v-hover v-slot:default="{ hover }" v-for="(btn, index) in btns" :key="index">
            <n-link :to="btn.route">
                <v-btn
                    nuxt
                    :color="hover ? 'primary' : 'secondary'"
                    class="uppercase white--text btn roboto-condensed"
                    text
                ><v-icon class="mr-1" color="secondary">{{ btn.iconn }}</v-icon><span color="secondary">{{btn.text}}</span></v-btn>
            </n-link>
        </v-hover>
        <v-hover v-slot:default="{ hover }">
            <v-btn @click="ft_logout"
                :color="hover ? 'secondary' : 'primary'"
                outlined
                tile
                class="uppercase white--text btn ml-4 roboto-condensed"
            >LOG OUT</v-btn>
        </v-hover>
    </v-app-bar>  
    <v-app-bar app color="accent" flat hide-on-scroll class="hidden-md-and-up">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index">
              <a :href="item.route">
                <v-list-item-title>{{ item.text }}</v-list-item-title>                
              </a>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-btn @click="ft_logout"
                >LOG OUT</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      btns: [
        { text: 'Profile', route: '/profile', iconn: 'mdi-account' },
        { text: 'Setting', route: '/setting', iconn: 'mdi-settings' },
        { text: 'History', route: '/history', iconn: 'mdi-file-document-box-multiple' },
      ],
      items: [
        { text: 'Hyper Tube', route: '/hypertube' },
        { text: 'Profile', route: '/profile' },
        { text: 'Setting', route: '/setting' },
        { text: 'History', route: '/history', },
      ],
    }
  },
  methods: {
    ft_logout() {
      this.$cookies.removeAll();
      this.$router.push("/");
    },
  },
}
</script>

<style scoped>
.logo
{
  font-weight: bold;
  font-size: 25px;
  letter-spacing: 0.02em;
  cursor: pointer;
  text-decoration: none;
}
.btn
{
  font-weight: bold;
  letter-spacing: 0.05em;
  font-size: 18px !important;
}
a
{
  text-decoration: none;
}
</style>