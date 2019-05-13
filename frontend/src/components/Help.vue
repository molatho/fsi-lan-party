<template>
  <b-carousel
    id="carousel-1"
    v-model="slide"
    :interval="4000"
    controls
    indicators
    background="#ababab"
    img-width="1024"
    img-height="480"
    style="text-shadow: 1px 1px 2px #333;"
    @sliding-start="onSlideStart"
    @sliding-end="onSlideEnd"
  >
    <!-- Slide with blank fluid image to maintain slide aspect ratio -->
    <b-carousel-slide 
        v-for="entry in entries"
        :key=entry
        :caption=entry.title 
        img-blank 
        img-alt="Blank image"
    >
      <p 
        v-if="entry.body && entry.body.length > 0"
        v-html="entry.body"> </p>
      <img
        v-if="entry.img && entry.img.length > 0"
        slot="img"
        class="d-block img-fluid w-100"
        width="1024"
        height="480"
        :src=entry.img
        alt="image slot"
      >
    </b-carousel-slide>
  </b-carousel>
</template>

<script>
const ENTRIES = [
    {
        title: "Welcome",
        body: 
            `Wichtige Dinge für euch:
            <ul>
                <li>Nicht-Studenten müssen sich eintragen</li>
                <li>Alle Teilnehmer müssen die AGB unterschreiben</li>
                <li>Netzwerk bekommst du automatisch (DHCP)</li>
                <li>Für Windows-user: Du bis tim Heimnetz, nicht im öffentlichen Netz</li>
                <li>Nein, es gibt kein Internet für die PCs (HS-MA war dagegen)</li>
                <li>Bitte keine Hotspots aufspannen!</li>
                <li>Pizzabestellungen gibt's auf <a href=http://pizza.party>pizza.party</a></li>
            </ul>`
    },
    {
        title: "Services",
        body: 
            `Alle Angebote im Intranet:
            <ul>
                <li><a href="http://fs.party">fs.pizza</a>: </li>
                <li><a href="http://share.party">share.pizza</a>: </li>
                <li><a href="http://teamspeak.party">teamspeak.pizza</a>: Hier geht's zum Teamspeak-Server!</li>
            </ul>`
    }
]

export default {
  name: "Help",
  components: {},
  data: function() {
    return {
      slide: 0,
      sliding: null,
      entries: ENTRIES
    };
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    }
  }
};
</script>