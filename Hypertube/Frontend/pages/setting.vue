<template>
  <v-row style="margin: 6vh 1vh 0 1vh">
    <v-col cols="12" xl="4" lg="4" md="4">
      <pic />
    </v-col>
    <v-col cols="12" xl="8" lg="8" md="8">
      <info />
    </v-col>
  </v-row>
</template>

<script>
import pic from "@/components/app/setting/pic";
import info from "@/components/app/setting/info";
import axios from "axios";
export default {
  layout: "app",
  components: { pic, info },
  mounted() {
    var token = this.$cookies.get('token');
    axios({
          method: 'post',
          url: 'http://localhost:3000/jwt/',
          headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => {
          if (response.data == false)
            this.$router.push("/");
          else
            this.$router.push("/setting");
      })
      .catch(error => {
          console.log(error);
      });
  },
};
</script>