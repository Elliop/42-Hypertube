<template>
  <v-card color="accent" width="100%" height="100%">
    <v-col v-for="item in items" :key="item.id">
        <v-row>
            <v-card style="margin: 1vh" width="100%">
                <v-card-text align="center">
                    <span class="headline">{{ item.title }}</span>
                </v-card-text>
            </v-card>
        </v-row> 
    </v-col>
  </v-card>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
        items: []
    };
  },
  mounted() {
      var token = this.$cookies.get('token');
      axios({
            method: 'get',
            url: `http://localhost:3000/history`,
            headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(data => {
        let tmp = [];
        for (let index = 0; index < data.data.data.length; index++) {
          const element = data.data.data[index];
          tmp.push({
            uniqueId: index,
            title: element.title,
          });
        }
        this.items = tmp;
      })
      .catch(err => console.log(err));
  },
};
</script>