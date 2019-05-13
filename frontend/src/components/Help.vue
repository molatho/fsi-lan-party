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
        :key="entries.indexOf(entry)"
        :caption=entry.title
        img-alt="Blank image"
    >
      <p 
        v-if="entry.body && entry.body.length > 0"
        v-html="entry.body"> </p>
      <img
        slot="img"
        class="d-block img-fluid w-100"
        width="1024"
        height="480"
        src="../assets/wp_server3.jpg"
        alt="image slot"
      >
    </b-carousel-slide>
  </b-carousel>
</template>

<script>
const ENTRIES = [
    {
        title: "Welcome (1/2)",
        body: 
            `Wichtige Dinge für euch:
            <ul class="list">
                <li>Nicht-Studenten müssen sich eintragen</li>
                <li>Alle Teilnehmer müssen die AGB unterschreiben</li>
                <li>Netzwerk bekommst du automatisch (DHCP)</li>
                <li>Für Windows-user: Du bis tim Heimnetz, nicht im öffentlichen Netz</li>
            </ul>`
    },
    {
        title: "Welcome (2/2)",
        body: 
            `Wichtige Dinge für euch:
            <ul class="list">
                <li>Nein, es gibt kein Internet für die PCs (HS-MA war dagegen)</li>
                <li>Bitte keine Hotspots aufspannen!</li>
                <li>Pizzabestellungen gibt's auf <a href=http://pizza.party>pizza.party</a></li>
            </ul>`
    },
    {
        title: "Services",
        body: 
            `Alle Angebote im Intranet:
            <ul class="list">
                <li><a href="http://fs.party">fs.pizza</a>: FileZilla!</li>
                <li><a href="http://share.party">share.pizza</a>: Skripte, etc.</li>
                <li><a href="http://teamspeak.party">teamspeak.pizza</a>: Hier geht's zum Teamspeak-Server!</li>
            </ul>`
    },
    {
        title: "Essen",
        body: 
            `Die Sache mit dem Mampf...
            <ul class="list">
                <li>Die Speisekarte gibt's auf <a href="">http://pizza.party</a></li>
                <li>Sucht euch dort bis 19:00 Uhr etwas aus...</li>
                <li>... Fachschaftler werden dann eure Bestellungen aufnehmen und euch abkassieren!</li>
                <li>Die Lieferung wird in etwa XXX Minuten dauern.</li>
            </ul>`
    },
    {
        title: "Getränke",
        body: 
            /*`Die Fachschaft bietet an:
            <ul class="list">
                <li>Wasser: 0,00 €</li>
                <li>Kaffee: 0,00 €</li>
                <li>Mate: 1,20 €</li>
                <li>Bier: 1,10 €</li>
                <li>Softdrinks: 1,20 €</li>
                <li>Energydrinks: 0,80 €</li>
            </ul>`*/
            `Die Fachschaft bietet an:
            <table class="tbl">
              <tbody>
                <tr><td>Wasser</td><td>0,00 €</td></tr>
                <tr><td>Kaffee</td><td>0,00 €</td></tr>
                <tr><td>Mate</td><td>1,20 €</td></tr>
                <tr><td>Bier</td><td>1,10 €</td></tr>
                <tr><td>Softdrinks</td><td>1,20 €</td></tr>
                <tr><td>Energydrinks</td><td>0,80 €</td></tr>
              </tobdy>
            </table>
            `
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

<style>
.list {
  list-style-type:none;
}

.tbl {
  border: none;
  text-align: left;
}
</style>
