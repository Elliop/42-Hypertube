<template>
  <v-carousel cycle height="100%" :show-arrows="false" :hide-delimiters="true">
    <v-carousel-item v-for="(image, i) in images" :key="i">
      <v-img :src="images[i]" height="100%"></v-img>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
  export default {
    data () {
      return {
        images: [
                "https://images3.alphacoders.com/103/1039332.jpg",
                "https://straightfromamovie.com/wp-content/uploads/2020/01/knives-out-movie.jpg",
                "https://3.bp.blogspot.com/-cmcIiPf0164/XMCesPYXmII/AAAAAAAABuQ/hF6Sl7EpDKEkdj2R6B2ECGG6EbVke64yACKgBGAs/w0/avengers-endgame-characters-uhdpaper.com-4K-122.jpg",
                "https://images8.alphacoders.com/102/1022108.jpg",
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
                ]
      }
    },
  }
</script>